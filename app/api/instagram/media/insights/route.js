import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  return { ok: res.ok, status: res.status, json };
}

async function mapLimit(arr, limit, fn) {
  const out = new Array(arr.length);
  let i = 0;

  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (i < arr.length) {
      const idx = i++;
      out[idx] = await fn(arr[idx], idx);
    }
  });

  await Promise.all(workers);
  return out;
}

function insightsToMap(insightsData) {
  // Meta returns [{ name, values:[{value}], ...}] or errors
  if (!Array.isArray(insightsData)) return null;
  const map = {};
  for (const row of insightsData) {
    const name = row?.name;
    const value = row?.values?.[0]?.value;
    if (name) map[name] = value;
  }
  return map;
}

function metricsFor(m) {
  const SAFE = ["reach", "saved", "shares", "total_interactions"];

  const isReel =
    m.media_type === "REEL" ||
    (typeof m.permalink === "string" && m.permalink.includes("reel"));

  if (isReel) {
    return {
      primary: [
        "reach",
        "saved",
        "shares",
        "total_interactions",
        "views",
        "ig_reels_avg_watch_time",
        "ig_reels_video_view_total_time",
      ],
      fallback: SAFE,
    };
  }

  if (m.media_type === "VIDEO") {
    return {
      primary: ["reach", "saved", "shares", "total_interactions"],
      fallback: SAFE,
    };
  }

  return {
    primary: ["reach", "saved", "shares", "total_interactions"],
    fallback: SAFE,
  };
}

const API_VERSION = "v24.0";
const elements = 200;

export async function GET(req) {
  const token = process.env.SYS_USER_ACCESS_CODE;
  const igUserId = process.env.IG_USER_ID;

  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Missing SYS_USER_ACCESS_TOKEN" },
      { status: 500 }
    );
  }
  if (!igUserId) {
    return NextResponse.json(
      { ok: false, error: "Missing IG_USER_ID" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(req.url);
  const limitTotal = Number(searchParams.get("limit") || elements);
  const concurrency = Number(searchParams.get("concurrency") || "6");

  // 1) Fetch media (paginate)
  const fields = [
    "id",
    "media_type",
    "timestamp",
    "thumbnail_url",
    "permalink",
    "caption",
    "profile_visits",
    "follows",
    "like_count",
    "comments_count",
    "profile_activity",
  ].join(",");

  let nextUrl =
    `https://graph.facebook.com/${API_VERSION}/${igUserId}/media` +
    `?fields=${encodeURIComponent(fields)}` +
    `&limit=${elements}` +
    `&access_token=${encodeURIComponent(token)}`;

  const media = [];
  while (nextUrl && media.length < limitTotal) {
    const r = await fetchJson(nextUrl);
    if (!r.ok) {
      return NextResponse.json(
        { ok: false, step: "media", status: r.status, error: r.json },
        { status: 200 }
      );
    }
    if (Array.isArray(r.json?.data)) media.push(...r.json.data);
    nextUrl = r.json?.paging?.next || null;
  }

  const items = media.slice(0, limitTotal);

  // 2) Fetch insights per media id with retry fallback
  const results = await mapLimit(items, concurrency, async (m) => {
    const { primary, fallback } = metricsFor(m);

    const callInsights = async (metricList) => {
      const url =
        `https://graph.facebook.com/${API_VERSION}/${m.id}/insights` +
        `?metric=${encodeURIComponent(metricList.join(","))}` +
        `&access_token=${encodeURIComponent(token)}`;
      return await fetchJson(url);
    };

    // Try primary metric set
    let r = await callInsights(primary);

    // If rejected due to unsupported metrics, retry with safe set
    // if (!r.ok) {
    //   r = await callInsights(fallback);
    // }

    return {
      ...m,
      insights_ok: r.ok,
      insights: r.ok ? r.json?.data : r.json, // keep error payload if still failing
      insights_map: r.ok ? insightsToMap(r.json?.data) : null,
    };
  });

  return NextResponse.json(
    { ok: true, count: results.length, data: results },
    { status: 200 }
  );
}

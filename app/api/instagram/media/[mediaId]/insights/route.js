import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const token = process.env.SYS_USER_ACCESS_CODE;
  if (!token)
    return NextResponse.json(
      { ok: false, error: "Missing SYS_USER_ACCESS_TOKEN" },
      { status: 500 }
    );

  const mediaId = params.mediaId;

  // Start with a broad set; Meta will error if you ask for unsupported metrics for that media type.
  const metric = [
    "impressions",
    "reach",
    "saved",
    "shares",
    "total_interactions",
    "video_views",
    "plays",
    "average_watch_time",
    "ig_reels_video_view_total_time",
  ].join(",");

  const url =
    `https://graph.facebook.com/v21.0/${mediaId}/insights` +
    `?metric=${encodeURIComponent(metric)}` +
    `&access_token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json({ ok: res.ok, mediaId, ...json }, { status: 200 });
}

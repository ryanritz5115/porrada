import { NextResponse } from "next/server";

export async function GET(req) {
  const token = process.env.SYS_USER_ACCESS_CODE;
  const igUserId = process.env.IG_USER_ID;

  if (!token)
    return NextResponse.json(
      { ok: false, error: "Missing SYS_USER_ACCESS_TOKEN" },
      { status: 500 }
    );
  if (!igUserId)
    return NextResponse.json(
      { ok: false, error: "Missing IG_USER_ID" },
      { status: 500 }
    );

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "25";

  const fields = [
    "id",
    "caption",
    "media_type",
    "media_url",
    "thumbnail_url",
    "permalink",
    "timestamp",
    "username",
    "like_count",
    "comments_count",
  ].join(",");

  const url =
    `https://graph.facebook.com/v21.0/${igUserId}/media` +
    `?fields=${encodeURIComponent(fields)}` +
    `&limit=${encodeURIComponent(limit)}` +
    `&access_token=${encodeURIComponent(token)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json({ ok: res.ok, ...json }, { status: 200 });
}

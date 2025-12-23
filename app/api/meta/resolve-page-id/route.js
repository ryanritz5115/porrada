import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const pageUrl = process.env.PORRADA_PAGE_URL;

  if (!appId || !appSecret || !pageUrl) {
    return NextResponse.json(
      { ok: false, error: "Missing env vars" },
      { status: 500 }
    );
  }

  const appAccessToken = `${appId}|${appSecret}`;

  const url =
    `https://graph.facebook.com/v21.0/` +
    `?id=${encodeURIComponent(pageUrl)}` +
    `&fields=id,name,link` +
    `&access_token=${encodeURIComponent(appAccessToken)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json({ ok: res.ok, json }, { status: 200 });
}

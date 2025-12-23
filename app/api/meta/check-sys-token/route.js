import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.SYS_USER_ACCESS_CODE;
  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;

  if (!token || !appId || !appSecret) {
    return NextResponse.json(
      {
        ok: false,
        error: "Missing SYS_USER_ACCESS_TOKEN or FB_APP_ID/FB_APP_SECRET",
      },
      { status: 500 }
    );
  }

  const appAccessToken = `${appId}|${appSecret}`;

  const url =
    `https://graph.facebook.com/v21.0/debug_token` +
    `?input_token=${encodeURIComponent(token)}` +
    `&access_token=${encodeURIComponent(appAccessToken)}`;

  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();

  return NextResponse.json({
    ok: res.ok,
    is_valid: json?.data?.is_valid,
    app_id: json?.data?.app_id,
    scopes: json?.data?.scopes,
  });
}

import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  if (!code)
    return NextResponse.json(
      { ok: false, error: "Missing code" },
      { status: 400 }
    );

  const appId = process.env.META_APP_ID;
  const appSecret = process.env.META_APP_SECRET;
  const redirectUri = process.env.IG_REDIRECT_URI;

  // 1) code -> short-lived user token
  const tokenUrl =
    "https://graph.facebook.com/v21.0/oauth/access_token" +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&client_secret=${encodeURIComponent(appSecret)}` +
    `&code=${encodeURIComponent(code)}`;

  const tokenRes = await fetch(tokenUrl);
  const tokenJson = await tokenRes.json();

  if (!tokenRes.ok) {
    return NextResponse.json(
      { ok: false, step: "code_exchange", tokenJson },
      { status: 500 }
    );
  }

  const shortLivedToken = tokenJson.access_token;

  // 2) short-lived -> long-lived
  const longUrl =
    "https://graph.facebook.com/v21.0/oauth/access_token" +
    `?grant_type=fb_exchange_token` +
    `&client_id=${encodeURIComponent(appId)}` +
    `&client_secret=${encodeURIComponent(appSecret)}` +
    `&fb_exchange_token=${encodeURIComponent(shortLivedToken)}`;

  const longRes = await fetch(longUrl);
  const longJson = await longRes.json();

  if (!longRes.ok) {
    return NextResponse.json(
      { ok: false, step: "long_lived_exchange", longJson },
      { status: 500 }
    );
  }

  // For personal use: display it once so you can paste into Vercel env.
  // Better: store in a DB/KV, but env is OK for MVP.
  return NextResponse.json({
    ok: true,
    long_lived_user_token: longJson.access_token,
    expires_in: longJson.expires_in,
    note: "Copy long_lived_user_token into Vercel env (IG_LONG_LIVED_USER_TOKEN).",
  });
}

import { NextResponse } from "next/server";

export async function GET() {
  const appId = process.env.META_APP_ID;
  const redirectUri = process.env.IG_REDIRECT_URI;

  // permissions you typically need for IG insights via the Instagram Platform
  const scope = [
    "instagram_basic",
    "instagram_manage_insights",
    "pages_show_list",
    "pages_read_engagement",
  ].join(",");

  const url =
    "https://www.facebook.com/v21.0/dialog/oauth" +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&response_type=code`;

  return NextResponse.redirect(url);
}

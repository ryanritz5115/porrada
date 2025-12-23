import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.IG_LONG_LIVED_USER_TOKEN;
  if (!token)
    return NextResponse.json({
      ok: false,
      error: "Missing IG_LONG_LIVED_USER_TOKEN",
    });

  const res = await fetch(
    `https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(token)}`,
    { cache: "no-store" }
  );

  const json = await res.json();
  return NextResponse.json({ ok: res.ok, json });
}

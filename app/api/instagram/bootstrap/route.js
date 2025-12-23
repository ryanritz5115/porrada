import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.SYS_USER_ACCESS_CODE;
  const pageId = process.env.FB_PAGE_ID;

  if (!accessToken)
    return NextResponse.json(
      { ok: false, error: "Missing SYS_USER_ACCESS_TOKEN" },
      { status: 500 }
    );
  if (!pageId)
    return NextResponse.json(
      { ok: false, error: "Missing PORRADA_PAGE_ID" },
      { status: 500 }
    );

  const igRes = await fetch(
    `https://graph.facebook.com/v21.0/${pageId}?fields=instagram_business_account&access_token=${encodeURIComponent(accessToken)}`,
    { cache: "no-store" }
  );

  const ig = await igRes.json();

  if (!igRes.ok) {
    return NextResponse.json(
      { ok: false, step: "page->instagram_business_account", ig },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    page_id: pageId,
    ig_user_id: ig.instagram_business_account?.id,
  });
}

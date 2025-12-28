import { track } from "@vercel/analytics";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // avoid caching surprises on edge/CDN

export async function GET(req, { params }) {
  const { uid } = await params;

  // Preserve any query params (UTMs, etc)
  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  track("qr-redirect", { uid });

  const destinationPath = `/products/${encodeURIComponent(uid)}${qs ? `?${qs}` : ""}`;
  const destinationUrl = new URL(destinationPath, url.origin);

  // 302 is safest while you may change destinations. You can switch to 308 later.
  const res = NextResponse.redirect(destinationUrl, 302);

  // Prevent caches from “locking” a redirect if you ever change behavior
  res.headers.set("Cache-Control", "no-store");

  return res;
}

// ============================================
// FILE: app/api/fetch-tracking/route.ts
// ============================================
import { NextResponse } from "next/server";
import { fetchRecentOrders } from "../../../lib/fetch/shopify-client";
import { fetchTrackingInfo } from "../../../lib/fetch/tracking-parser";
import { RateLimiter } from "../../../lib/fetch/rate-limiter";

export async function POST(req: Request) {
  try {
    const { daysAgo = 10 } = await req.json();

    // Fetch orders from Shopify
    console.log(`Fetching orders from last ${daysAgo} days...`);
    const orders = await fetchRecentOrders(daysAgo);

    // Extract tracking info
    const trackingData: any[] = [];

    orders.forEach((edge) => {
      const order = edge.node;
      order.fulfillments?.forEach((fulfillment: any) => {
        fulfillment.trackingInfo?.forEach((tracking: any) => {
          if (tracking.url) {
            trackingData.push({
              orderId: order.id,
              orderName: order.name,
              trackingNumber: tracking.number,
              trackingUrl: tracking.url,
              carrier: tracking.company || "Unknown",
            });
          }
        });
      });
    });

    console.log(`Found ${trackingData.length} tracking URLs`);

    // Fetch and parse tracking pages with Puppeteer
    // 3 concurrent browsers @ 1 second delay (safe for testing)
    const limiter = new RateLimiter(3, 1000);

    let completed = 0;
    const results = await Promise.all(
      trackingData.map(async (item) => {
        const estimatedDelivery = await limiter.add(() =>
          fetchTrackingInfo(item.trackingUrl, item.carrier, item.trackingNumber)
        );

        completed++;
        console.log(
          `[${completed}/${trackingData.length}] ${item.orderName} (${item.carrier}): ${estimatedDelivery || "NOT FOUND"}`
        );

        return {
          ...item,
          estimatedDelivery,
        };
      })
    );

    // Filter to only orders with found delivery dates
    const successful = results.filter((r) => r.estimatedDelivery);
    const failed = results.filter((r) => !r.estimatedDelivery);

    return NextResponse.json({
      total: results.length,
      successful: successful.length,
      failed: failed.length,
      data: results,
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      {
        error: "Failed to fetch tracking data",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

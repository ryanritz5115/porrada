import { posthogServer } from "@/lib/PostHog/posthog-server";
import crypto from "crypto";

function verifyShopifyWebhook(body, hmac) {
  const hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return hash === hmac;
}

// app/api/webhooks/shopify/route.ts
export async function POST(req) {
  try {
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");

    console.log("Webhook received:", { topic, hmac: hmac?.slice(0, 10) });

    if (!hmac || !topic) {
      return Response.json({ error: "Missing headers" }, { status: 400 });
    }

    const body = await req.text();
    const data = JSON.parse(body);

    console.log("Parsed data:", {
      orderId: data.id,
      customerId: data.customer?.id,
      email: data.email,
    });

    if (!verifyShopifyWebhook(body, hmac)) {
      console.log("Webhook verification failed");
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (topic === "orders/paid") {
      console.log("Capturing purchase event...");

      const eventData = {
        distinctId:
          data.customer?.id?.toString() || data.email || data.id.toString(),
        event: "purchase",
        properties: {
          order_id: data.id,
          order_number: data.order_number,
          total: parseFloat(data.total_price),
          currency: data.currency,
          item_count: data.line_items.length,
        },
      };

      console.log("Event data:", eventData);

      posthogServer.capture(eventData);

      // Flush so it sends immediately
      await posthogServer.shutdown();

      console.log("Event sent to PostHog");
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json(
      {
        error: "Internal error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

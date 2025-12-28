import { posthogServer } from "@/lib/PostHog/posthog-server";
import crypto from "crypto";

function verifyShopifyWebhook(body, hmac) {
  const hash = crypto
    .createHmac("sha256", process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, "utf8")
    .digest("base64");
  return hash === hmac;
}

export async function POST(req) {
  try {
    // Get headers directly from Request object
    const hmac = req.headers.get("x-shopify-hmac-sha256");
    const topic = req.headers.get("x-shopify-topic");

    if (!hmac || !topic) {
      return Response.json({ error: "Missing headers" }, { status: 400 });
    }

    const body = await req.text();

    if (!verifyShopifyWebhook(body, hmac)) {
      return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(body);

    posthogServer.capture({
      distinctId:
        data.customer?.id?.toString() || data.email || data.id.toString(),
      event: "purchase",
      properties: {
        order_id: data.id,
        order_number: data.order_number,
        total: parseFloat(data.total_price),
        subtotal: parseFloat(data.subtotal_price),
        tax: parseFloat(data.total_tax),
        shipping: parseFloat(
          data.total_shipping_price_set?.shop_money?.amount || 0
        ),
        currency: data.currency,
        item_count: data.line_items.length,
        discount_codes: data.discount_codes?.map((d) => d.code) || [],
        payment_method: data.payment_gateway_names?.[0],
        customer_email: data.email,
        customer_id: data.customer?.id,
      },
    });

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

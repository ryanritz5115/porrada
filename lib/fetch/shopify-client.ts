// ============================================
// FILE: lib/shopify-client.ts
// ============================================
import { createAdminApiClient } from "@shopify/admin-api-client";

const client = createAdminApiClient({
  storeDomain: process.env.CURIO_SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2025-01",
  accessToken: process.env.CURIO_SHOPIFY_ADMIN_API_TOKEN!,
});

export async function fetchRecentOrders(daysAgo: number = 10) {
  // Hardcoded date range: Dec 13-15, 2024
  const startDate = "2025-12-9T00:00:00Z";
  const endDate = "2025-12-16T23:59:59Z";

  const query = `
    query GetOrders($cursor: String) {
      orders(first: 250, query: "created_at:>=${startDate} AND created_at:<=${endDate}", after: $cursor, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            name
            createdAt
            fulfillments {
              trackingInfo {
                company
                number
                url
              }
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const allOrders: any[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;
  let pageCount = 0;

  while (hasNextPage) {
    try {
      pageCount++;
      console.log(`Fetching page ${pageCount}...`);

      const response = await client.request(query, {
        variables: { cursor },
      });

      console.log("Full response:", JSON.stringify(response, null, 2));

      // Check if response has errors
      if (response.errors) {
        console.error("GraphQL Errors:", response.errors);
        throw new Error(`GraphQL Error: ${JSON.stringify(response.errors)}`);
      }

      const data = response.data as any;

      if (!data) {
        console.error(
          "Response has no data property. Full response:",
          response
        );
        throw new Error("Invalid response from Shopify API - no data property");
      }

      if (!data.orders) {
        console.error(
          "Data has no orders property. Available properties:",
          Object.keys(data)
        );
        throw new Error(
          "Invalid response from Shopify API - no orders in data"
        );
      }

      const orders = data.orders.edges;
      allOrders.push(...orders);
      console.log(
        `Fetched ${orders.length} orders (total: ${allOrders.length})`
      );

      hasNextPage = data.orders.pageInfo.hasNextPage;
      cursor = data.orders.pageInfo.endCursor;

      // Optional: Add a small delay between requests to avoid rate limits
      if (hasNextPage) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  console.log(`Total orders fetched: ${allOrders.length}`);
  return allOrders;
}

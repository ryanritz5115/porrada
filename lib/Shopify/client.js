// lib/shopify/client.js

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_API_ACCESS_TOKEN;

/**
 * Shopify GraphQL fetch wrapper
 *
 * @param {Object} params
 * @param {String} params.query        - GraphQL query or mutation string
 * @param {Object} [params.variables]  - Variables passed into GraphQL
 * @param {Object} [params.cache]      - { revalidate, tags } or "force-cache"/"no-store"
 * @param {Object} [params.headers]    - Merge additional headers if needed
 *
 * @returns {Promise<any>}             - JSON response or throws on error
 */
export async function shopifyFetch({
  query,
  variables = {},
  cache = {}, // supports { revalidate } or string values
  headers = {},
}) {
  const endpoint = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

  // Convert cache input into Next fetch config
  let fetchOptions = {};
  if (typeof cache === "string") {
    fetchOptions.cache = cache; // "force-cache" | "no-store"
  } else if (typeof cache === "object") {
    fetchOptions.next = cache; // { revalidate: number, tags: [...] }
  }

  const res = await fetch(endpoint, {
    method: "POST",
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
  });

  // If Shopify throws or rate limits
  if (!res.ok) {
    console.error("❌ Shopify fetch error:", res.status, res.statusText);
    const errorText = await res.text();
    throw new Error(`Shopify API Error: ${errorText}`);
  }

  const json = await res.json();

  // Catch GraphQL-level errors
  if (json.errors) {
    console.error("❗ GraphQL errors:", json.errors);
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

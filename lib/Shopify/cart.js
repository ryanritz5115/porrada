import { shopifyFetch } from "@/lib/Shopify/client";
import {
  GET_CART_MICRO_QUERY,
  GET_CART_QUERY,
} from "@/lib/Shopify/Queries/cart";
import {
  ADD_PRODUCT_TO_CART_MUTATION,
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
} from "./Mutations/cart";
import { cookies } from "next/headers";

export async function getCart(cartId) {
  return shopifyFetch({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: "no-store", // always fresh for cart
  });
}

export async function createCartWithLines(lines) {
  const data = await shopifyFetch({
    query: CART_CREATE_MUTATION,
    variables: { lines },
    cache: "no-store",
  });

  return data.cartCreate.cart;
}

export async function addLinesToCart(cartId, lines) {
  // const t0 = performance.now();
  const data = await shopifyFetch({
    query: CART_LINES_ADD_MUTATION,
    variables: { cartId, lines },
    cache: "no-store",
  });
  // const t1 = performance.now();
  // console.log(`[cart] Shopify cartLinesAdd: ${(t1 - t0).toFixed(1)}ms`);

  return data.cartLinesAdd.cart;
}

export async function getMicroCart(cartId) {
  if (!cartId) {
    return {
      id: null,
      totalQuantity: 0,
      subtotal: 0,
      subtotalFormatted: "$0.00",
    };
  }

  const data = await shopifyFetch({
    query: GET_CART_MICRO_QUERY,
    variables: { cartId },
    cache: "no-store",
  });

  const cart = data.cart;

  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    cost: {
      totalAmount: {
        amount: Number(cart.cost.totalAmount.amount),
        currencyCode: cart.cost.totalAmount.currencyCode,
      },
    },
  };
}
export async function getFullCart(cartId) {
  if (!cartId) {
    return {
      id: null,
      totalQuantity: 0,
      subtotal: 0,
      subtotalFormatted: "$0.00",
    };
  }

  const data = await shopifyFetch({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });

  const cart = data.cart;

  return {
    id: cart.id,
    totalQuantity: cart.totalQuantity,
    subtotal: Number(cart.cost.subtotalAmount.amount),
    subtotalFormatted: `${cart.cost.subtotalAmount.currencyCode} ${cart.cost.subtotalAmount.amount}`,
    lines: cart.lines.edges.map((edge) => ({
      id: edge.node.id,
      quantity: edge.node.quantity,
      title: edge.node.merchandise.product.title,
      linePrice: Number(edge.node.cost.totalAmount.amount),
      linePriceFormatted: `${edge.node.cost.totalAmount.currencyCode} ${edge.node.cost.totalAmount.amount}`,
    })),
  };
}

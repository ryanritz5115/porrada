"use server";

import { cookies } from "next/headers";
import {
  createCartWithLines,
  addLinesToCart,
  getMicroCart,
  getFullCart,
} from "@/lib/Shopify/cart";

export async function addProductToCartServer({
  variantId,
  quantity,
  sellingPlanId = "",
}) {
  // const t0 = performance.now();
  const cookieStore = await cookies();
  const existingCartId = cookieStore.get("cartId")?.value;

  let cart;

  if (!existingCartId) {
    cart = await createCartWithLines([
      {
        merchandiseId: variantId,
        quantity,
        ...(sellingPlanId && { sellingPlanId }),
      },
    ]);
  } else {
    cart = await addLinesToCart(existingCartId, [
      {
        merchandiseId: variantId,
        quantity,
        ...(sellingPlanId && { sellingPlanId }),
      },
    ]);
  }

  if (!cart) throw new Error("Cart operation failed");

  cookieStore.set("cartId", cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  // const t1 = performance.now();
  // console.log(`[cart] server action total: ${(t1 - t0).toFixed(1)}ms`);

  return cart;
}

export async function fetchFullCartAction() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  const cart = await getFullCart(cartId);
  return cart;
}

export async function getMicroCartAction() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  const cart = await getMicroCart(cartId);
  return cart;
}

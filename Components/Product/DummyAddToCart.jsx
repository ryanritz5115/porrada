"use client";

import { useTransition } from "react";
import { addProductToCartServer } from "@/app/Shopify/cart/actions";

export default function DummyAddToCart({ productName, variantId }) {
  const [isPending, startTransition] = useTransition();

  function onAddToCart() {
    startTransition(async () => {
      try {
        await addProductToCartServer({
          variantId,
          quantity: 1,
        });
        // later: update CartProvider with returned cart
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    });
  }

  return (
    <button onClick={onAddToCart} disabled={isPending}>
      {isPending ? "Adding..." : `Add ${productName} to cart`}
    </button>
  );
}

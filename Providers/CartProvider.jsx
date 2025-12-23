// app/providers/CartProvider.jsx
"use client";

import { fetchFullCartAction } from "@/app/Shopify/cart/actions";
import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ initialCart, initialCartId, children }) {
  const [summary, setSummary] = useState(initialCart);
  const [lines, setLines] = useState(null); // null = not loaded yet
  const [isLoadingLines, setIsLoadingLines] = useState(false);

  const loadFullCart = useCallback(async () => {
    if (lines || isLoadingLines || !summary?.id) return;
    setIsLoadingLines(true);
    try {
      const cart = await fetchFullCartAction();
      setLines(cart.lines);
      setSummary((prev) => ({
        ...prev,
        totalQuantity: cart.totalQuantity,
        subtotal: cart.subtotal,
      }));
    } finally {
      setIsLoadingLines(false);
    }
  }, [lines, isLoadingLines, summary?.id]);

  return (
    <CartContext.Provider
      value={{
        summary,
        lines,
        isLoadingLines,
        loadFullCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

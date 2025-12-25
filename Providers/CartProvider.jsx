// app/providers/CartProvider.jsx
"use client";

import { fetchFullCartAction } from "@/app/Shopify/cart/actions";
import { createContext, useContext, useState, useCallback } from "react";

const CartContext = createContext(null);

export function CartProvider({ initialCart, initialCartId, children }) {
  const [cart, setCart] = useState(initialCart ? initialCart : null);
  const [cartStatus, setCartStatus] = useState("idle");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        isOpen,
        setIsOpen,
        cartStatus,
        setCartStatus,
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

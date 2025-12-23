"use client";
import CartIcon from "@/app/Components/Icons/CartIcon";
import { useCart } from "@/Providers/CartProvider";

export default function CartButton() {
  const { cart } = useCart();
  if (!cart) {
    return (
      <button id="cartOpenButton" aria-label="Open cart button">
        <span className="cartItemCountHeader">0</span>
        <CartIcon />
      </button>
    );
  }

  const cartCount = cart.cart.totalQuantity;
  return (
    <button id="cartOpenButton" aria-label="Open cart button">
      <span className="cartItemCountHeader">{cartCount}</span>
      <CartIcon />
    </button>
  );
}

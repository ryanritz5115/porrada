"use client";
import { fetchFullCartAction } from "@/app/Shopify/cart/actions";
import CartIcon from "@/Components/Icons/CartIcon";
import { useCart } from "@/Providers/CartProvider";

export default function CartButton() {
  const { cart, setCart, setIsOpen, cartStatus, setCartStatus } = useCart();

  async function openCart(e) {
    setIsOpen(true);
    if (cartStatus == "ready" || cartStatus == "empty") return;
    setCartStatus("loading");
    const newCart = await fetchFullCartAction();
    setCartStatus(newCart?.lines?.nodes?.length > 0 ? "ready" : "empty");
    setCart(newCart);
  }

  return (
    <button
      id="cartOpenButton"
      aria-label="Open cart button"
      onClick={openCart}
    >
      <span
        className="cartItemCountHeader"
        style={{ display: cart?.totalQuantity > 0 ? "flex" : "none" }}
      >
        {cart.totalQuantity || 0}
      </span>
      <CartIcon />
    </button>
  );
}

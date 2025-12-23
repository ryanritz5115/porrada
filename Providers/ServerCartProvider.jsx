// Providers/CartProvider.tsx (SERVER COMPONENT)
import { getMicroCartAction } from "@/app/Shopify/cart/actions";
import { CartProvider } from "./CartProvider";

export default async function ServerCartProvider({
  children,
  initialCart,
  initialCartId,
}) {
  const cart = await getMicroCartAction(); // runs on the server

  return (
    <CartProvider initialCart={cart} initialCartId={cart?.id || ""}>
      {children}
    </CartProvider>
  );
}

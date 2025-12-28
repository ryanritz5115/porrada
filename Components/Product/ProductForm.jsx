"use client";
import ProductSelect from "./ProductSelect";
import ProductNudge from "./ProductNudge";
import { useEffect, useTransition } from "react";
import { addProductToCartServer } from "@/app/Shopify/cart/actions";
import { useCart } from "@/Providers/CartProvider";
import AddToCart from "./AddToCart";
import { track } from "@vercel/analytics";
import { PosthogTracking } from "@/lib/Analytics/events";

export default function ProductForm({ product }) {
  const subscribeAndSaveGroup = product.sellingPlanGroups.edges[0].node;

  const [isPending, startTransition] = useTransition();
  const { setCart, setIsOpen, setCartStatus } = useCart();

  useEffect(() => {
    PosthogTracking.productViewed(product);
  }, []);

  async function onFormSubmit(e) {
    e.preventDefault();
    // const start = performance.now();
    startTransition(async () => {
      const form = e.target;
      const formData = new FormData(form);
      const variantId = formData.get("id");
      const sellingPlanId =
        formData.get("purchase_option") == "onetime"
          ? undefined
          : formData.get("selling_plan");

      try {
        setCartStatus("loading");
        const cart = await addProductToCartServer({
          variantId,
          quantity: 1,
          sellingPlanId,
        });
        // track("Add to cart", {
        //   product_title: product.title,
        //   page: "/products/" + product.handle,
        // });
        setCartStatus(cart?.lines?.nodes?.length > 0 ? "ready" : "empty");
        setCart(cart);
        setIsOpen(true);
        PosthogTracking.addToCart(product, 1, cart);
        // const end = performance.now();
        // const duration = end - start;
        // console.log(`[cart] addToCart (client E2E) ${duration.toFixed(1)}ms`);

        // later: update CartProvider with returned cart
      } catch (err) {
        console.error("Add to cart failed:", err);
      }
    });
  }

  return (
    <form onSubmit={onFormSubmit} acceptCharset="UTF-8" className="productForm">
      <select
        name="id"
        data-productid="9061237620951"
        className="productFormVariants hidden"
        defaultValue={product.variants.edges[0].node.id}
        readOnly
      >
        <option value={product.variants.edges[0].node.id}>Peach Mango</option>
      </select>
      <ProductSelect subscribeAndSaveGroup={subscribeAndSaveGroup} />
      <AddToCart
        product={product}
        isPending={isPending}
        classes="pdpBtn"
        text={`Add ${product.title} to cart`}
      />

      <ProductNudge
        disabled={isPending}
        title={product.title}
        product={product}
      />

      <input type="hidden" name="product-id" value="9061237620951" />
      <input
        type="hidden"
        name="section-id"
        value="template--20460583092439__PDP_Main"
      />
    </form>
  );
}

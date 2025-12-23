"use client";
import ProductSelect from "./ProductSelect";
import ProductNudge from "./ProductNudge";
import Arrow from "../Tiny/Arrow";
import { useEffect, useTransition } from "react";
import { addProductToCartServer } from "@/app/Shopify/cart/actions";
import ButtonLoading from "../Tiny/ButtonLoading";
import { useCart } from "@/Providers/CartProvider";

export default function ProductForm({ product }) {
  const subscribeAndSaveGroup = product.sellingPlanGroups.edges[0].node;

  const [isPending, startTransition] = useTransition();
  const { setCart } = useCart();

  async function onFormSubmit(e) {
    e.preventDefault();
    console.log("Starting fetch");
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
        const cart = await addProductToCartServer({
          variantId,
          quantity: 1,
          sellingPlanId,
        });

        setCart({
          cart,
        });
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

      <button
        className="btn pdpBtn"
        aria-label="Add Focus to cart"
        type="submit"
        disabled={isPending}
      >
        <ButtonLoading loading={isPending}>
          <div className="btnTextCtn">
            <span>Add {product.title} to cart</span>
            <span>Add {product.title} to cart</span>
          </div>
          <div className="btnSvgBox">
            <Arrow />
            <Arrow />
          </div>
        </ButtonLoading>
      </button>
      <ProductNudge disabled={isPending} title={product.title} />

      <input type="hidden" name="product-id" value="9061237620951" />
      <input
        type="hidden"
        name="section-id"
        value="template--20460583092439__PDP_Main"
      />
    </form>
  );
}

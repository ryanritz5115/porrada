"use client";
import React, { useEffect } from "react";
import AddToCart from "./AddToCart";

export default function ProductNudge({ title, isPending, product }) {
  useEffect(() => {
    const cartNudge = document.querySelector(".fixedCartNudgeCtn");
    const pdpBtn = document.querySelector(".pdpBtn");
    let allowed = false;

    const nudgeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            allowed = true;
            cartNudge.classList.remove("active");
          } else if (allowed) {
            cartNudge.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );

    nudgeObserver.observe(pdpBtn);

    return () => {
      nudgeObserver.disconnect();
    };
  }, []);
  return (
    <div className="fixedCartNudgeCtn">
      <p className="cartNudgeTitle">{title}</p>
      <AddToCart
        product={product}
        isPending={isPending}
        classes="nudgeBtn"
        text={`Add ${product.title}`}
      />
    </div>
  );
}

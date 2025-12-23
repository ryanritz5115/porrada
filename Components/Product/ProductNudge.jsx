"use client";
import React, { useEffect } from "react";
import Arrow from "../Tiny/Arrow";

export default function ProductNudge({ title, isPending }) {
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
      <button
        disabled={isPending}
        className="btn nudgeBtn"
        aria-label="Add to cart"
        type="submit"
      >
        <div className="btnTextCtn">
          <span>Add to cart</span>

          <span>Add to cart</span>
        </div>
        <div className="btnSvgBox">
          <Arrow />
          <Arrow />
        </div>
      </button>
    </div>
  );
}

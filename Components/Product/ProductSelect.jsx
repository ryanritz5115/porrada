"use client";
import React, { useEffect, useRef } from "react";
import SelectChevron from "../Tiny/SelectChevron";

export default function ProductSelect({ subscribeAndSaveGroup }) {
  useEffect(() => {
    const form = document.querySelector(".productForm");
    if (!form) return;
    const radios = form.querySelectorAll('input[name="purchase_option"]');
    const wrap = document.getElementById("PlanWrap");
    const select = document.getElementById("SellingPlan");

    function updateUI() {
      const subscribe =
        form.querySelector('input[name="purchase_option"]:checked') &&
        form.querySelector('input[name="purchase_option"]:checked').value ===
          "subscribe";
      if (subscribe) {
        wrap.style.height = wrap.scrollHeight + 1 + "px";
        if (!select.name) select.name = "selling_plan"; // now the plan will be submitted
        select.disabled = false;
      } else {
        wrap.style.height = 0 + "px";

        if (select.name) select.removeAttribute("name"); // omit from submit → one-time purchase
        select.disabled = true;
      }
    }

    // init + listeners
    updateUI();
    radios.forEach((r) => r.addEventListener("change", updateUI));

    return () => {
      radios.forEach((r) => r.removeEventListener("change", updateUI));
    };
  }, []);
  return (
    <div className="sellingPlansCtn">
      <p className="eyebrow">Choose your price:</p>
      <div className="singleSellingPlanWrapper">
        <label htmlFor="Subscribe" className="sellingPlanLabel"></label>
        <input
          type="radio"
          name="purchase_option"
          id="Subscribe"
          value="subscribe"
          defaultChecked
        />
        <div className="singleSellingPlanCtn">
          <span className="sellingPlanTag">Best Value</span>
          <div className="singleSellingPlanDiv">
            <div className="sellingPlanLeft">
              <div className="sellingPlanTitleCtn">
                <div className="sellingPlanBubble selected">
                  <div></div>
                </div>
                <div>
                  <p className="sellingPlanTitle">Subscribe and Save</p>
                  <div className="sellingPlaneSubtitle">Save $20</div>
                </div>
              </div>
            </div>
            <div className="sellingPlanRight">
              <p className="sellingPlanOriginal">$69.99</p>
              <p className="sellingPlanDiscount">$49.99</p>
            </div>
          </div>
          <div id="PlanWrap" style={{ height: "50px" }}>
            <div className="sellingPlanSelectCtn">
              <SelectChevron />

              <select
                id="SellingPlan"
                className="sellingPlanSelect"
                name="selling_plan"
                defaultValue={
                  subscribeAndSaveGroup.sellingPlans.edges[0].node.id
                }
              >
                {subscribeAndSaveGroup.sellingPlans.edges.map((o, oo) => (
                  <option value={o.node.id} key={"sellingPlanOption" + oo}>
                    {o.node.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="sellingPlanSeperator">
        <span>Or</span>
      </div>
      <div className="singleSellingPlanWrapper">
        <label htmlFor="OTP" className="sellingPlanLabel"></label>
        <input type="radio" name="purchase_option" id="OTP" value="onetime" />

        <div className="singleSellingPlanCtn ">
          <div className="singleSellingPlanDiv">
            <div className="sellingPlanLeft">
              <div className="sellingPlanTitleCtn">
                <div className="sellingPlanBubble selected">
                  <div></div>
                </div>
                <div>
                  <p className="sellingPlanTitle">One-Time Purchase</p>
                  <div className="sellingPlaneSubtitle">1-month supply</div>
                </div>
              </div>
            </div>
            <div className="sellingPlanRight">
              <p className="sellingPlanOriginal otp">$69.99</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

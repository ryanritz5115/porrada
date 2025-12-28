"use client";
import {
  updateDiscountCodesServer,
  updateLineQuantityServer,
} from "@/app/Shopify/cart/actions";
import MinusIcon from "@/Components/Icons/MinusIcon";
import PlusIcon from "@/Components/Icons/PlusIcon";
import Trash from "@/Components/Icons/Trash";
import Button from "@/Components/Tiny/Button";
import LoadingElement from "@/Components/Tiny/LoadingElement";
import {
  computeSubtotalFromLines,
  computeTotalsFromLines,
  findVariantColor,
  formatMoneyWithCurrency,
} from "@/lib/misc/helpers";
import { useCart } from "@/Providers/CartProvider";
import "@/Styles/Cart/drawer.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function CartDrawer() {
  const { cart, isOpen, setIsOpen, setCart, cartStatus } = useCart();

  useEffect(() => {
    console.log(cart);
  }, [cart]);

  function cartClose(e) {
    setIsOpen(false);
  }

  async function onDiscountFormSubmit(e) {
    e.preventDefault();
    const discountCodeInput = document.getElementById("discountCode");
    const newCode = discountCodeInput.value.trim();
    if (!newCode) return;

    // Disable form elements
    discountCodeInput.disabled = true;
    e.target.querySelector("button").disabled = true;

    // Update discount codes in cart
    const newCart = await updateDiscountCodesServer(cart.id, [
      ...cart.discountCodes.map((d, dd) => d.code),
      newCode,
    ]);
    setCart(newCart);

    // Update local state and re-enable form elements
    discountCodeInput.value = "";
    discountCodeInput.disabled = false;
    e.target.querySelector("button").disabled = false;
    e.target.reset();
  }

  return (
    <div className={`cartDrawer${isOpen ? " open" : ""}`}>
      <div className="cartDrawerTop">
        <h2 className="cartTitle">Cart</h2>
        <button
          className="closeCart"
          aria-label="Close cart drawer"
          onClick={cartClose}
        >
          <svg
            width="25"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.58594 1.25 L16.5859 16.2468 M1.58594 16.25 L16.5859 1.25319"
              stroke="var(--black)"
              strokeWidth="1.24"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>
      <div className="cartDrawerSplit">
        <div className="cartDrawerLines">
          <ul
            className={"cartLines " + (cartStatus == "ready" ? "filled" : "")}
          >
            {cartStatus == "ready" ? (
              cart.lines.nodes.map((item, index) => (
                <CartItem item={item} index={index} key={index} />
              ))
            ) : (
              <p
                className="emptyCartMessage"
                style={{ opacity: cartStatus == "empty" ? 1 : 0 }}
              >
                Your cart is currently empty.
              </p>
            )}
          </ul>
        </div>
        <div
          className="cartDrawerFooter"
          style={{
            opacity: cart?.lines?.nodes?.length > 0 ? 1 : 0,
            visibility: cart?.lines?.nodes?.length > 0 ? "visible" : "hidden",
          }}
        >
          <div
            className="discountsCtn"
            style={{
              opacity: cart?.lines?.nodes?.length > 0 ? 1 : 0,
            }}
          >
            <h3 className="discountsTitle">Discounts</h3>
            <form id="cartDiscountForm" onSubmit={onDiscountFormSubmit}>
              <input
                placeholder="Add new discount code"
                type="text"
                id="discountCode"
                className="cartDiscountInput"
              />
              <button className="cartDiscountButton" type="submit">
                Apply
              </button>
            </form>
            <div className="discountsFlex">
              {cart?.discountCodes?.length > 0 &&
                cart.discountCodes.map((code, index) => (
                  <SingleDiscountCode
                    key={index + "dc"}
                    code={code}
                    index={index}
                    cart={cart}
                    setCart={setCart}
                  />
                ))}
            </div>
          </div>
          <div className="cartTotalFlex">
            <div className="subtotalCtn">
              <span className="subtotal">Subtotal:</span>
              {cart?.cost?.totalAmount?.amount !== undefined &&
                cart?.lines?.nodes?.length > 0 && (
                  <>
                    {computeTotalsFromLines(cart.lines.nodes).subtotal !==
                      computeTotalsFromLines(cart.lines.nodes).total && (
                      <span
                        className="discountedPrice"
                        style={{ display: "block" }}
                      >
                        saving $
                        {(
                          computeTotalsFromLines(cart.lines.nodes).total -
                          computeTotalsFromLines(cart.lines.nodes).subtotal
                        ).toFixed(2)}
                      </span>
                    )}
                  </>
                )}
            </div>
            <span className="finalPriceCtn">
              {cart?.cost?.totalAmount?.amount !== undefined &&
                cart?.lines?.nodes?.length > 0 && (
                  <>
                    {computeTotalsFromLines(cart.lines.nodes).subtotal !==
                      computeTotalsFromLines(cart.lines.nodes).total && (
                      <span className="discountedPrice">
                        ${computeTotalsFromLines(cart.lines.nodes).total}
                      </span>
                    )}
                    <span className="finalPrice">
                      ${computeTotalsFromLines(cart.lines.nodes).subtotal}
                    </span>
                  </>
                )}
            </span>
          </div>
          <Button
            classes="drawerCheckout fullWidth blackBorder"
            link={cart.checkoutUrl}
            text="Checkout"
          />
        </div>
      </div>
      <div className="cartOverlay" onClick={cartClose}></div>
    </div>
  );
}

function CartItem({ item, index }) {
  const { setCart, setCartStatus } = useCart();
  const lineRef = useRef(null);
  const [loadingLine, setIsLoadingLine] = useState(false);
  async function onCartLineQuantityChange(
    type = "increment",
    id,
    quantity,
    sellingPlanId = ""
  ) {
    setIsLoadingLine(true);
    toggleDisabledMutateButtons(true);
    let newCart;

    if (type === "increment") {
      // Handle increment logic
      newCart = await updateLineQuantityServer(id, quantity + 1, sellingPlanId);
      setCart(newCart);
    } else if (type === "decrement") {
      // Handle decrement logic
      newCart = await updateLineQuantityServer(id, quantity - 1, sellingPlanId);
      setCart(newCart);
    } else if (type === "delete") {
      // Handle delete logic
      newCart = await updateLineQuantityServer(id, 0, sellingPlanId);
      setCart(newCart);
    }
    setCartStatus(newCart?.lines?.nodes?.length > 0 ? "ready" : "empty");
    setIsLoadingLine(false);
    toggleDisabledMutateButtons(false);
  }

  function toggleDisabledMutateButtons(disabled = true) {
    const buttons = lineRef.current.querySelectorAll("[data-mutate]");
    buttons.forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  return (
    <li className="cartLine" ref={lineRef}>
      <div className="cartLineFlex">
        <div className="cartLineImageCtn">
          <Image
            src={item.merchandise.product.featuredImage.url}
            alt={
              item.merchandise.product.featuredImage.altText ||
              item.merchandise.product.title
            }
            width={85}
            height={125}
            onLoad={(e) => {
              e.currentTarget.style.opacity = 1;
              e.currentTarget.parentElement.background = "#ffffff";
            }}
          />
        </div>

        <div className="cartLineCtn">
          <div>
            <p className="cartLineTitle">{item.merchandise.product.title}</p>
            <p
              className="cartLineVariant"
              style={{ background: findVariantColor(item.merchandise.title) }}
            >
              {item.merchandise.title}
            </p>

            {item.sellingPlanAllocation ? (
              <p className="sellingPlanRow">
                {item.sellingPlanAllocation.sellingPlan.options[0].value}
              </p>
            ) : (
              <p className="sellingPlanRow">One-Time Purchase</p>
            )}
          </div>

          <div className="cartLineQuantityCtn">
            <button
              className="subtract"
              data-index={index}
              data-mutate
              data-minus
              onClick={() =>
                onCartLineQuantityChange(
                  "decrement",
                  item.id,
                  item.quantity,
                  item.sellingPlanAllocation
                    ? item.sellingPlanAllocation.sellingPlan.id
                    : ""
                )
              }
            >
              <MinusIcon />
            </button>
            <span className="quantity" data-quantity={item.quantity}>
              <LoadingElement loading={loadingLine} color="#999999">
                <span className="quantityLoading">{item.quantity}</span>
              </LoadingElement>
            </span>
            <button
              className="add"
              data-index={index}
              data-mutate
              data-inc
              onClick={() =>
                onCartLineQuantityChange(
                  "increment",
                  item.id,
                  item.quantity,
                  item.sellingPlanAllocation
                    ? item.sellingPlanAllocation.sellingPlan.id
                    : ""
                )
              }
            >
              <PlusIcon />
            </button>
          </div>
        </div>
        <div className="cartLineRight">
          <button
            className="deleteLine"
            data-mutate
            data-index={index}
            data-delete
            onClick={() =>
              onCartLineQuantityChange(
                "delete",
                item.id,
                item.quantity,
                item.sellingPlanAllocation
                  ? item.sellingPlanAllocation.sellingPlan.id
                  : ""
              )
            }
          >
            <Trash />
          </button>
          <p className="lineTotal">
            {item?.sellingPlanAllocation ? (
              <>
                <DiscountedPriceLine
                  discountedPrice={
                    item.sellingPlanAllocation.priceAdjustments[0].price.amount
                  }
                  originalPrice={
                    item.merchandise.product.compareAtPriceRange.maxVariantPrice
                      .amount
                  }
                  quantity={item.quantity}
                />
              </>
            ) : item.discountAllocations.length > 0 ? (
              <DiscountedPriceLine
                discountedPrice={
                  item.merchandise.product.compareAtPriceRange.maxVariantPrice
                    .amount
                }
                originalPrice={
                  item.merchandise.product.compareAtPriceRange.maxVariantPrice
                    .amount
                }
                discountAmount={
                  item.discountAllocations[0].discountedAmount.amount
                }
                quantity={item.quantity}
              />
            ) : (
              <NormalPriceLine
                price={
                  parseFloat(
                    item.merchandise.product.priceRange.maxVariantPrice.amount
                  ) * item.quantity
                }
              />
            )}
          </p>
        </div>
      </div>
    </li>
  );
}

function SingleDiscountCode({ code, index, cart, setCart }) {
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  async function RemoveDiscountCode(e, index) {
    setIsLoadingButton(true);
    const newDiscounts = cart.discountCodes
      .filter((_, i) => i !== index)
      .map((d) => d?.code);

    const newCart = await updateDiscountCodesServer(cart.id, [...newDiscounts]);
    setIsLoadingButton(false);
    setCart(newCart);
  }
  return (
    <div
      className={
        "discountCode " + (code.applicable ? "applied" : "notApplicable")
      }
      style={{ opacity: isLoadingButton ? 0.5 : 1 }}
    >
      <span>{code.code}</span>
      <button
        data-discount
        data-index={index}
        className="discountCodeRemoveButton"
        onClick={(e) => RemoveDiscountCode(e, index)}
        disabled={isLoadingButton}
      >
        <svg
          className="cartDiscountX"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 8.18359L8.49609 0.6875M8.49609 8.18359L1 0.6875"
            stroke="#5F5F5F"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}

function DiscountedPriceLine({
  originalPrice,
  discountedPrice,
  discountAmount = "0",
  quantity = 1,
}) {
  const discountedFloat = parseFloat(discountedPrice) * quantity;
  const originalFloat = parseFloat(originalPrice) * quantity;
  const discountAmountFloat = parseFloat(discountAmount);
  const originalFormatted = formatMoneyWithCurrency(originalFloat);
  const discountedFormatted = formatMoneyWithCurrency(
    discountedFloat - discountAmountFloat
  );
  return (
    <>
      <span className="lineTotalSpan discounted">{originalFormatted}</span>
      <span className="lineTotalSpan">{discountedFormatted}</span>
    </>
  );
}
function NormalPriceLine({ price }) {
  return (
    <>
      <span className="lineTotalSpan">{formatMoneyWithCurrency(price)}</span>
    </>
  );
}

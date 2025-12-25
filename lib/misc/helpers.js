export const universal = {
  fullScreenSizes: "(max-width: 990px) 75vw, 100vw",
};

export function alt(image) {
  return image.alt ? image.alt : "Image";
}
export function formatMoneyWithCurrency(amount, currencyCode = "USD") {
  return `$${amount.toFixed(2)}`;
}

export function findVariantColor(title) {
  if (title.includes("Blueberry")) {
    return "#5050FE";
  } else if (title.includes("Peach")) {
    return "#FFB74B";
  }
}

export function computeTotalsFromLines(lines) {
  const money = (m) => Number(m?.amount ?? m ?? 0);
  const qty = (q) => Number.parseInt(q ?? 0, 10) || 0;

  let total = 0; // pre-discount “original”
  let subtotal = 0; // post-discount (line-level discounts applied)

  for (const line of lines || []) {
    const q = qty(line.quantity);

    // 1) ORIGINAL unit price (one-time variant price)
    const originalUnit = money(line?.merchandise?.price);

    // 2) EFFECTIVE unit price (selling plan price if present, else original)
    // Prefer line.sellingPlanAllocation.priceAdjustments[0].price if you have it.
    const sellingPlanUnit = money(
      line?.sellingPlanAllocation?.priceAdjustments?.[0]?.price
    );

    const effectiveUnit = sellingPlanUnit > 0 ? sellingPlanUnit : originalUnit;

    const lineOriginalTotal = originalUnit * q;
    const lineEffectiveTotal = effectiveUnit * q;

    // 3) Discount allocations are already total $ off for the line (not per unit)
    const lineDiscount = (line?.discountAllocations || []).reduce(
      (sum, a) => sum + money(a?.discountedAmount),
      0
    );

    total += lineOriginalTotal;
    subtotal += Math.max(0, lineEffectiveTotal - lineDiscount);
  }

  return {
    total: total.toFixed(2),
    subtotal: subtotal.toFixed(2),
    savings: (total - subtotal).toFixed(2),
  };
}

function reduceDiscountAllocations(line) {
  return line.discountAllocations.reduce((total, allocation) => {
    return total + parseFloat(allocation.discountedAmount.amount);
  }, 0);
}
function reduceSubscriptionDiscounts(line) {
  return line.priceAdjustments.reduce((total, allocation) => {
    return total + parseFloat(allocation.price.amount);
  }, 0);
}

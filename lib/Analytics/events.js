export const EVENTS = {
  PRODUCT_VIEW: "product_view",
  ADD_TO_CART: "add_to_cart",
  PURCHASE: "purchase",
  APPLY_DISCOUNT: "apply_discount",
  INITIATE_CHECKOUT: "initiate_checkout",
  QR_SCAN: "qr_scan",
};

export const SCHEMA = {
  qr_scan: ["uid", "utm_source", "utm_medium", "utm_campaign"],
  view_product: ["uid"],
  add_to_cart: ["variant_id", "qty", "value", "currency"],
  begin_checkout: ["cart_id", "value", "currency"],
  purchase: ["order_id", "value", "currency"],
};

export const PosthogTracking = {
  // Product interactions
  productViewed: (product) => {
    window.posthog?.capture("product_viewed", {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      category: product.category,
      collection: product.collection,
    });
  },

  // Cart events
  addToCart: (product, quantity, cart) => {
    window.posthog?.capture("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity,
      cart_value: getCurrentCartValue(cart),
    });
  },

  removeFromCart: (product) => {
    window.posthog?.capture("remove_from_cart", {
      product_id: product.id,
      reason: "user_action", // vs 'out_of_stock'
    });
  },

  cartViewed: (cart) => {
    window.posthog?.capture("cart_viewed", {
      cart_value: getCurrentCartValue(cart),
      item_count: getCurrentCartItemCount(cart),
    });
  },

  // Checkout funnel
  checkoutStarted: (cart, transport) => {
    window.posthog?.capture(
      "checkout_started",
      {
        cart_value: getCurrentCartValue(cart),
        item_count: getCurrentCartItemCount(cart),
        has_discount: cart.discountCode !== null,
      },
      {
        transport,
      }
    );
  },

  paymentInfoEntered: (method) => {
    window.posthog?.capture("payment_info_entered", {
      payment_method: method,
    });
  },

  // Search
  searchPerformed: (query, resultsCount) => {
    window.posthog?.capture("search_performed", {
      query,
      results_count: resultsCount,
      has_results: resultsCount > 0,
    });
  },

  // Filters
  filterApplied: (filterType, value) => {
    window.posthog?.capture("filter_applied", {
      filter_type: filterType, // 'price', 'color', 'size'
      filter_value: value,
    });
  },
};

function getCurrentCartValue(cart) {
  return parseFloat(cart.cost.totalAmount.amount);
}

function getCurrentCartItemCount(cart) {
  return cart.lines.nodes.reduce((total, line) => total + line.quantity, 0);
}

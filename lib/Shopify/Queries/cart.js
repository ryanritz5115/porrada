import { cartFragment, cartMinimalFragment } from "../Fragments/cart";

export const GET_CART_QUERY = /* GraphQL */ `
  query getCart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartLineMinimal
    }
  }

  ${cartMinimalFragment}
`;

export const GET_CART_MICRO_QUERY = `
query getCart($cartId: ID!) {
    cart(id: $cartId) {
      id
      cost {
        totalAmount {
          amount
          currencyCode
        }
      }
      totalQuantity
    }
  }
`;

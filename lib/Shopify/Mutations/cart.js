import { cartFragment, cartMinimalFragment } from "../Fragments/cart";

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation cartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartLineMinimal
      }
    }
  }

  ${cartFragment}
`;

export const CART_LINES_ADD_MUTATION = /* GraphQL */ `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartLineMinimal
      }
    }
  }

  ${cartMinimalFragment}
`;

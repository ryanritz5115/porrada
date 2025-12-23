import { productFragment } from "./product";

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
      totalTaxAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      applicable
      code
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                ...product
              }
            }
          }
        }
      }
    }
    totalQuantity
  }
  ${productFragment}
`;

export const cartMinimalFragment = `
fragment CartLineMinimal on Cart {
  id
    checkoutUrl
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    discountCodes {
      applicable
      code
    }
  lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          sellingPlanAllocation {
              sellingPlan {
                id
                name
                recurringDeliveries
                options {
                  name
                  value
                }
              }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              product {
                title
                handle
                id
              }
              image {
                url
                altText
              }


            }
          }
        }
      }
    }
    totalQuantity
}
`;

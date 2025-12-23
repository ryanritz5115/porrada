import { imageFragment } from "./image";
import { sellingPlanFragment, sellingPlanGroupFragment } from "./sellingPlan";
import { seoFragment } from "./seo";

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    tags
    sellingPlanGroups(first: 5) {
      edges {
        node {
          ...SellingPlanGroupFields
        }
      }
    }
    collections(first: 5) {
      edges {
        node {
          id
          title
          handle
        }
      }
    }
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      maxVariantPrice {
        amount
        currencyCode
      }
      minVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    totalInventory
  }
  ${imageFragment}
  ${seoFragment}
  ${sellingPlanGroupFragment}
`;

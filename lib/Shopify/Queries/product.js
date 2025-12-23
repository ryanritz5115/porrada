import { productFragment } from "../Fragments/product";

export const GET_PRODUCTS = `
  query GetProducts {
    products(first: 25) {
      nodes {
        ...product
      }
    }
  }
  ${productFragment}
`;

export const GET_SINGLE_PRODUCT = `
  query getProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}

`;

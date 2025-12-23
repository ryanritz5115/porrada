import { shopifyFetch } from "./client";
import { GET_PRODUCTS, GET_SINGLE_PRODUCT } from "./Queries/product";

export async function getProducts() {
  return shopifyFetch({
    query: GET_PRODUCTS,
    cache: "force-cache",
  });
}

export async function getProductByHandle(handle) {
  return shopifyFetch({
    query: GET_SINGLE_PRODUCT,
    variables: {
      handle: handle,
    },
    cache: "force-cache",
  });
}

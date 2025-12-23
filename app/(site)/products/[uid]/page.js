import DummyAddToCart from "@/Components/Product/DummyAddToCart";
import Product from "@/Components/Product/Product";
import { getProductByHandle } from "../../../../lib/Shopify/product";

export default async function page({ params }) {
  const { uid } = await params;
  const product = await getProductByHandle(uid);
  //   console.log(product);
  const firstVariant = product.product.variants?.edges[0]?.node;
  // console.log(product);

  //   console.log(firstVariant);

  return (
    <div>
      <Product product={product.product} />
    </div>
  );
}

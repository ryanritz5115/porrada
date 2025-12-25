import Product from "@/Components/Product/Product";
import { getProductByHandle } from "../../../../lib/Shopify/product";
import Banner from "@/Components/Home/Banner";

export default async function page({ params }) {
  const { uid } = await params;
  const product = await getProductByHandle(uid);

  return (
    <div>
      <Product product={product.product} />
      <Banner
        slice={{
          title: "Unlock your potential",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices.",
          button: {
            text: "Get Porrada Focus",
            url: "#",
          },
        }}
      />
      <Banner
        slice={{
          title: "Unlock your potential",
          description:
            "Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et massa mi. Aliquam in hendrerit urna. Pellentesque sit amet sapien fringilla, mattis ligula consectetur, ultrices.",
          button: {
            text: "Get Porrada Focus",
            url: "#",
          },
        }}
      />
    </div>
  );
}

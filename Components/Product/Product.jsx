import Image from "next/image";
import "@/Styles/Product/pdp.css";
import ProductSelect from "./ProductSelect";
import ProductNudge from "./ProductNudge";
import Checkmark from "../Tiny/Checkmark";
import Arrow from "../Tiny/Arrow";
import ProductForm from "./ProductForm";
import Plus from "../Tiny/Plus";

export default function Product({ product }) {
  return (
    <div className="pdpCtn">
      <div className="pdpDiv">
        <div className="pdpLeft pdpSide">
          <div className="wrapper">
            <div className="pdpFlex" data-slider data-dots>
              {product.images.edges.map((i, ii) => (
                <div className="pdpImageCtn" key={"pdpImage" + ii}>
                  {ii == 0 ? (
                    <Image
                      src={i.node.url}
                      alt="PDP Image"
                      fill
                      sizes="(max-width: 1024px) 75vw, 60vw"
                      style={{ objectFit: "cover" }}
                      preload
                    />
                  ) : (
                    <Image
                      src={i.node.url}
                      alt="PDP Image"
                      fill
                      sizes="(max-width: 1024px) 75vw, 60vw"
                      style={{ objectFit: "cover" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="dots"></div>
        </div>
        <div className="pdpRight pdpSide">
          <span className="pill grey">Stick Packs</span>
          <h1 className="pdpTitle">Focus</h1>
          <p className="pdpDisc">
            Sharpen your mind, enhance focus, and stay in the flow state—on and
            off the mats.
          </p>
          <div className="pdpTags ">
            <div className="pill empty italic">Supports brain health</div>

            <div className="pill empty italic">Strengthens muscle</div>

            <div className="pill empty italic">
              Improves memory and cognition
            </div>
          </div>
          <ProductForm product={product} />
          <div className="belowPdpCtn">
            <div className="checksCtn">
              <div className="check">
                <Checkmark />
                <span>30-Day money-back guarantee</span>
              </div>
              <div className="check">
                <Checkmark />

                <span>Free Shipping in the US</span>
              </div>
            </div>

            <div className="downsellCtn">
              <div className="dLeft">
                <h2 className="downsellTitle">
                  <span>Still unsure?</span> Try {product.title} for only $9.99
                </h2>
                <a
                  href=""
                  className="btn "
                  aria-label={`Get ${product.title} Samples`}
                >
                  <div className="btnTextCtn">
                    <span>Get {product.title} Samples</span>
                    <span>Get {product.title} Samples</span>
                  </div>
                  <div className="btnSvgBox">
                    <Arrow />
                    <Arrow />
                  </div>
                </a>
              </div>
              <div className="dRight">
                {/* 
  <img src="//porradanutra.com/cdn/shop/files/Group_8726_1_200x.png?v=1759715711" alt="Samples" srcset="
      //porradanutra.com/cdn/shop/files/Group_8726_1_200x.png?v=1759715711 200w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_400x.png?v=1759715711 400w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_600x.png?v=1759715711 600w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_800x.png?v=1759715711 800w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_1000x.png?v=1759715711 1000w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_1200x.png?v=1759715711 1200w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_1400x.png?v=1759715711 1400w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_1400x.png?v=1759715711 1600w,
      //porradanutra.com/cdn/shop/files/Group_8726_1_2000x.png?v=1759715711 2000w
    " sizes="25vw" className="downsellImage" loading="lazy"> */}
              </div>
            </div>

            <div className="pdpTabsCtn">
              <div className="pdpTab accordian">
                <button className="pdpTabButton">
                  <span>Clinically Proven Benefits</span>
                  <Plus />
                </button>
                <div className="pdpTabAnswer answer">
                  <div className="metafield-rich_text_field">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipiscing elit Ut
                      et massa mi. <strong>Aliquam in hendrerit</strong> urna.
                      Pellentesque sit amet sapien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pdpTab accordian">
                <button className="pdpTabButton">
                  <span>Ingredients</span>
                  <Plus />
                </button>
                <div className="pdpTabAnswer answer">
                  <div className="metafield-rich_text_field">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipiscing elit Ut
                      et massa mi. <strong>Aliquam in hendrerit</strong> urna.
                      Pellentesque sit amet sapien.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pdpTab accordian">
                <button className="pdpTabButton">
                  <span>How to use</span>
                  <Plus />
                </button>
                <div className="pdpTabAnswer answer">
                  <div className="metafield-rich_text_field">
                    <p>
                      Lorem ipsum dolor sit amet consectetur adipiscing elit Ut
                      et massa mi. <strong>Aliquam in hendrerit</strong> urna.
                      Pellentesque sit amet sapien.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

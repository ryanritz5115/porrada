import { alt, universal } from "@/lib/misc/helpers";
import Image from "next/image";
import Button from "../Tiny/Button";
import "@/Styles/Home/hero.css";

export default function Hero({ slice }) {
  return (
    <div className="heroCtn">
      <div className="heroDiv auto mmax imageCtn br">
        <div className="heroInfo">
          <h1 className="h1">{slice.title}</h1>
          <p className="heroDisc">{slice.description}</p>
          <Button
            text={slice.button.text}
            link={slice.button.url}
            target={slice.button.target}
            classes="white"
          />
        </div>
        <Image
          src={"/images/other.png"}
          alt={"Hero"}
          sizes={universal.fullScreenSizes}
          fill
          className="heroImage"
          preload={true}
          loading="eager"
          fetchPriority="high"
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

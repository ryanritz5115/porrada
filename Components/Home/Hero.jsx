import { alt, universal } from "@/lib/misc/helpers";
import Image from "next/image";
import Button from "../Tiny/Button";

export default function Hero({ slice }) {
  return (
    <div class="heroCtn">
      <div class="heroDiv">
        <div class="heroImageCtn">
          <Image
            src={slice.image.url}
            alt={alt(slice.image)}
            sizes={universal.fullScreenSizes}
            fill
            className="heroImage"
            preload={true}
          />
        </div>
        <div class="pinch heroInfoDiv">
          <div class="heroInfo">
            <h1 class="heroHeader railCtn thin">{slice.title}</h1>
            <p class="heroDisc fadeUp">{slice.disc}</p>
            <Button text={slice.link.text} link={slice.link.url} />
          </div>
        </div>
      </div>
    </div>
  );
}

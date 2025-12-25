import Image from "next/image";
import Button from "../Tiny/Button";
import "@/Styles/Home/banner.css";

export default function Banner({ slice }) {
  return (
    <div className="bannerCtn">
      <div className="bannerDiv auto mmax br imageCtn">
        <div className="bannerInfo">
          <h2 className="h2 bannerTitle">{slice.title}</h2>
          <div className="bannerDisc">
            <p>{slice.description}</p>
          </div>
          <Button
            text={slice.button.text}
            link={slice.button.url}
            classes="white"
          />
        </div>
        <div className="underlay"></div>
        <Image
          src={"/images/default.webp"}
          alt="Banner Image"
          sizes="100vw"
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
    </div>
  );
}

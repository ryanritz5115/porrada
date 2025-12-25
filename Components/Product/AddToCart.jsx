import ButtonLoading from "../Tiny/ButtonLoading";
import Arrow from "../Tiny/Arrow";

export default function AddToCart({ product, isPending, classes, text }) {
  return (
    <button
      className={"btn " + classes}
      aria-label={`Add ${product.title} to cart`}
      type="submit"
      disabled={isPending}
    >
      <ButtonLoading loading={isPending}>
        <div className="btnTextCtn">
          <span>{text}</span>
          <span>{text}</span>
        </div>
        <div className="btnSvgBox">
          <Arrow />
          <Arrow />
        </div>
      </ButtonLoading>
    </button>
  );
}

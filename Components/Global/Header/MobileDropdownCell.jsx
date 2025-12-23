import DropOptionArrow from "@/app/Components/Icons/DropOptionArrow";
import Link from "next/link";

export default function MobileDropdownCell({ title, links }) {
  return (
    <div className="mobileDropdownCell">
      <button className="mobileDropdownCellButton" aria-label={title}>
        <p className="eyebrow">{title}</p>
        <DropOptionArrow />
      </button>
      <div className="mobileDropdownList">
        <ul>
          {links.map((l, ll) => (
            <li key={ll + title + "mdl"}>
              <Link href={l.url} aria-label={l.text}>
                {l.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

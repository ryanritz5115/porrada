import Link from "next/link";
import MobileDropdownCell from "./MobileDropdownCell";

const dt = [
  {
    title: "Home",
    url: "",
  },
  {
    title: "Products",
    url: "",
    links: [
      {
        title: "Dropdown 1",
        url: "",
      },
      {
        title: "Dropdown 2",
        url: "",
      },
      {
        title: "Dropdown 3",
        url: "",
      },
    ],
  },
];

export default function MobileNav() {
  return (
    <nav
      className="mobileNavigation"
      role="navigation"
      aria-label="Mobile navigation"
    >
      {dt.map((l, ll) => {
        if (l.links) {
          return (
            <MobileDropdownCell
              key={"mdc" + ll}
              title={l.title}
              links={l.links}
            />
          );
        } else {
          return (
            <Link
              className="mobileLinkRow"
              key={"mdl" + ll}
              href={l.url}
              aria-label={l.title}
            >
              {l.title}
            </Link>
          );
        }
      })}
    </nav>
  );
}

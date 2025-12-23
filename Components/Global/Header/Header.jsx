import Link from "next/link";
import MobileNav from "./MobileNav";
import Image from "next/image";
import React from "react";
import CartIcon from "@/Components/Icons/CartIcon";
import CartButton from "./CartButton";
import LoginButton from "./LoginButton";

const dt = [
  {
    title: "Home",
    url: "",
  },
  {
    title: "Home",
    url: "",
    links: [
      {
        title: "Home",
        url: "",
        image: "default.webp",
      },
      {
        title: "Home",
        url: "",
        image: "default.webp",
      },
      {
        title: "Home",
        url: "",
        image: "default.webp",
      },
      {
        title: "Home",
        url: "",
        image: "default.webp",
      },
    ],
  },
];

export default function Header() {
  return (
    <header role="banner">
      <div className="headerFlex">
        <div className="leftLogoCtn">
          <Link href="/" className="leftLogo noka" title="PORRADA Home">
            PORRADA
          </Link>
        </div>

        <nav
          className="desktopNav"
          role="navigation"
          aria-label="Main Navigation"
        >
          <ul>
            {dt.map((d, dd) => {
              if (d.links) {
                return (
                  <React.Fragment key={"megalink" + dd}>
                    <li className="desktopListItem hasMegaMenu">
                      <Link
                        href={d.url}
                        className="headerLink "
                        title={d.title}
                      >
                        {d.title}
                      </Link>
                    </li>
                    <ul
                      className="megaMenu"
                      role="menu"
                      aria-label="Submenu for {{ link.title }}"
                    >
                      {d.links.map((sublink, sd) => (
                        <li role="none" key={"megasublink" + sd + d.title}>
                          <Link
                            href={sublink.url}
                            className="megaLink"
                            role="menuitem"
                            title={sublink.title}
                          >
                            <div className="megaLinkImageWrapper">
                              <Image
                                src={"/images/" + sublink.image}
                                alt={sublink.title}
                                fill
                                sizes="33vw"
                              />
                            </div>
                            <p className="megaLinkTitle">{sublink.title}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </React.Fragment>
                );
              } else {
                return (
                  <li className="desktopListItem" key={"noMegaSublink" + dd}>
                    <Link href={d.url} className="headerLink " title={d.title}>
                      {d.title}
                    </Link>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
        <div className="rightNavFlex {% if customer %}extended{% endif %}">
          {/* <a className="headerAccountName" href="/account" aria-label="Account owner name">Hi {{ customer.first_name }}</a> */}

          <LoginButton />
          <CartButton />
          <button
            className="mobilePlus"
            aria-label="Mobile menu button"
            aria-expanded="false"
            aria-controls="mobileNav"
          >
            <div className="one line"></div>
            <div className="two line"></div>
            <div className="three line"></div>
          </button>
        </div>
        <div id="mobileNav">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

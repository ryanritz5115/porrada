"use client";
import Link from "next/link";

export default function Button({
  classes = "",
  text = "",
  aria,
  link = "",
  target = "_self",
  prefetch = true,
  onClick = () => {},
}) {
  return (
    <Link
      className={"btn " + classes}
      prefetch={prefetch}
      href={link}
      target={target}
      aria-label={aria || text}
      onClick={onClick}
    >
      <div className="btnTextCtn">
        <span>{text}</span>
        <span>{text}</span>
      </div>
      <div className="btnSvgBox">
        <Arrow />
        <Arrow />
      </div>
    </Link>
  );
}

function Arrow({ classes }) {
  return (
    <svg
      className={classes}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0.75 8L13.5781 8Z" fill="white" />
      <path
        d="M0.75 8L13.5781 8"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="square"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 14.75L14.25 8L7.5 1.25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  );
}

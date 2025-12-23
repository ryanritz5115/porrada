import Login from "@/app/Components/Icons/Login";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link
      prefetch={true}
      href="/account/login"
      className="loginLinkCtn"
      aria-label="Account icon"
    >
      <Login />
    </Link>
  );
}

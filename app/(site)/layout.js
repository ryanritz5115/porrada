import ServerCartProvider from "@/Providers/ServerCartProvider";
import Header from "@/Components/Global/Header/Header";
import { Inter } from "next/font/google";
import CartDrawer from "@/Components/Global/Cart/CartDrawer";
import { Analytics } from "@vercel/analytics/next";
const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ServerCartProvider>
          <Header />
          <main role="main">{children}</main>
          <CartDrawer />
        </ServerCartProvider>
        <Analytics />
      </body>
    </html>
  );
}

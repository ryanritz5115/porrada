import ServerCartProvider from "@/Providers/ServerCartProvider";
import Header from "@/Components/Global/Header/Header";
import { EB_Garamond, Inter } from "next/font/google";
import CartDrawer from "@/Components/Global/Cart/CartDrawer";
import { PosthogAnalytics } from "@/Components/Analytics/PosthogAnalytics";
import { Suspense } from "react";
// import { Analytics } from "@vercel/analytics/next";
const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});
const garamond = EB_Garamond({
  variable: "--eb-garamond",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <ServerCartProvider>
          <Header />
          <main role="main" className={`${garamond.variable}`}>
            {children}
          </main>
          <CartDrawer />
        </ServerCartProvider>
        {/* <Analytics /> */}
        <Suspense fallback={null}>
          <PosthogAnalytics />
        </Suspense>
      </body>
    </html>
  );
}

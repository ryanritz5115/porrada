import ServerCartProvider from "@/Providers/ServerCartProvider";
import Header from "@/app/Components/Global/Header/Header";
import { Inter } from "next/font/google";

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
        </ServerCartProvider>
      </body>
    </html>
  );
}

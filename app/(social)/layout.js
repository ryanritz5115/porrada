import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--inter",
  subsets: ["latin"],
});

export default function SiteLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <main role="main">{children}</main>
      </body>
    </html>
  );
}

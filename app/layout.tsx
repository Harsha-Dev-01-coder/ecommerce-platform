import type { Metadata } from "next";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import StoreProvider from "@/app/StoreProvider";

export const metadata: Metadata = {
  title: "ShopSphere | Your Online Store",
  description: "Discover quality products at great prices with ShopSphere.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <StoreProvider>
          <Navbar />

          <main className="flex-1">{children}</main>

          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
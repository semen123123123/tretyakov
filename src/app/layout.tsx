import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/lib/toast";
import HeaderWrapper from "@/components/HeaderWrapper";

export const metadata: Metadata = {
  title: "TRETYAKOV | Bracelets from Natural Stones",
  description: "Bracelets are more than just accessories. They are a chronology of your life path. A collection of personal symbols, memories and images.",
  keywords: "bracelets, natural stones, hematite, lapis lazuli, malachite, jewelry",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://db.onlinewebfonts.com" />
        <link rel="stylesheet" href="https://db.onlinewebfonts.com/c/dc841f8fd499a8d0d2e49d2a5e01505d?family=IdealistSans" />
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <ToastProvider>
            <HeaderWrapper />
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
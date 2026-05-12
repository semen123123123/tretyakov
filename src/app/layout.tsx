import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import HeaderWrapper from "@/components/HeaderWrapper";

export const metadata: Metadata = {
  title: "ТРЕТЬЯКОВ | Браслеты из натуральных камней",
  description: "Браслеты — это больше, чем просто аксессуары. Это хронология твоего жизненного пути. Коллекция личных символов, воспоминаний и образов.",
  keywords: "браслеты, натуральные камни, гематит, лазурит, малахит, украшения",
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
        <link rel="preload" href="https://db.onlinewebfonts.com/c/dc841f8fd499a8d0d2e49d2a5e01505d?family=IdealistSans" as="style" />
        <script dangerouslySetInnerHTML={{ __html: 'var f=document.querySelector(\'link[rel="preload"][as="style"]\');if(f)f.onload=function(){this.rel="stylesheet"}' }} />
        <noscript><link rel="stylesheet" href="https://db.onlinewebfonts.com/c/dc841f8fd499a8d0d2e49d2a5e01505d?family=IdealistSans" /></noscript>
      </head>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <HeaderWrapper />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
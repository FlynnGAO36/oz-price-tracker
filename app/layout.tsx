import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Price Tracker - Australian Retail Comparison",
  description: "Compare product prices across Australian retailers in real-time",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

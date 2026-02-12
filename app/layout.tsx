import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "澳大利亚商品价格查询系统",
  description: "查询澳大利亚本地零售商商品价格",
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

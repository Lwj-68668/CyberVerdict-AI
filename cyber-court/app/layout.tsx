import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cyber Court",
  description:
    "Cyber Court 是一个用于分析聊天争议的 AI 原型应用，输出双方责任比例、关键句和判词摘要。",
  keywords: ["聊天分析", "争议判断", "AI 产品原型", "Cyber Court"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

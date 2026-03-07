import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "寿命測定 — あなたの残り時間",
  description: "36の問いから、あなたの残り時間を算出する。",
  openGraph: {
    title: "寿命測定 — あなたの残り時間",
    description: "36の問いから、あなたの残り時間を算出する。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "寿命測定 — あなたの残り時間",
    description: "36の問いから、あなたの残り時間を算出する。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

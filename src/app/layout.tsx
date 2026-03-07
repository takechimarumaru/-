import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life Timer — あなたの残り時間",
  description:
    "36の問いに答えると、あなたの残り時間が秒単位でカウントダウンされます。",
  openGraph: {
    title: "Life Timer — あなたの残り時間",
    description:
      "36の問いに答えると、あなたの残り時間が秒単位でカウントダウンされます。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life Timer — あなたの残り時間",
    description:
      "36の問いに答えると、あなたの残り時間が秒単位でカウントダウンされます。",
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
          href="https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

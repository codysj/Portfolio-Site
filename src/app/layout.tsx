import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cody Jung | Portfolio",
  description:
    "Portfolio of Cody Jung — Business + Data Science at UC Berkeley Haas. Full-stack products, AI-assisted research tools, and quantitative data projects.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

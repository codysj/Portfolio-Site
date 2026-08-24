import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cody Jung | Software Engineer & Applied AI",
  description:
    "UC Berkeley Computer Science and Business student building reliable agent systems, ML evaluation infrastructure, and data-intensive software.",
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

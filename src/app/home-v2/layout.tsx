import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Albert_Sans } from "next/font/google";

const albert = Albert_Sans({ subsets: ["latin"], variable: "--hv-font", display: "swap" });

export const metadata: Metadata = {
  title: "Cody Jung | Home v2 preview",
  robots: { index: false, follow: false },
};

export default function HomeV2Layout({ children }: Readonly<{ children: ReactNode }>) {
  return <div className={albert.variable} style={{ display: "contents" }}>{children}</div>;
}

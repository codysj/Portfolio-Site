import { Albert_Sans } from "next/font/google";
import HomeV2Shell from "@/components/home-v2/HomeV2Shell";
import ScrollStage from "@/components/home-v2/directions/stage/ScrollStage";

const albert = Albert_Sans({ subsets: ["latin"], variable: "--hv-font", display: "swap" });

export default function Home() {
  return (
    <div className={albert.variable} style={{ display: "contents" }}>
      <HomeV2Shell>
        <ScrollStage />
      </HomeV2Shell>
    </div>
  );
}

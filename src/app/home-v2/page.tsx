import type { Metadata } from "next";
import HomeV2Shell from "@/components/home-v2/HomeV2Shell";
import ScrollStage from "@/components/home-v2/directions/stage/ScrollStage";

export const metadata: Metadata = { title: "Cody Jung | Home v2 preview: Scroll Stage" };

export default function HomeV2Stage() {
  return (
    <HomeV2Shell>
      <ScrollStage />
    </HomeV2Shell>
  );
}

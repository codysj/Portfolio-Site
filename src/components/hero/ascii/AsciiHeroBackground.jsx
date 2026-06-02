import FallingPetals from "@/components/hero/ascii/FallingPetals";

/* -------------------------- AsciiHeroBackground -------------------------- */

export default function AsciiHeroBackground() {
  return (
    <div className="ah-bg" aria-hidden="true">
      <div className="ah-glow moon" />
      <div className="ah-glow amb" />
      <FallingPetals />
      <div className="ah-grain" />
      <div className="ah-scrim" />
    </div>
  );
}

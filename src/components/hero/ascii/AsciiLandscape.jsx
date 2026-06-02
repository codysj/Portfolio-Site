import AsciiHill from "@/components/hero/ascii/AsciiHill";
import AsciiTree from "@/components/hero/ascii/AsciiTree";
import AsciiGrass from "@/components/hero/ascii/AsciiGrass";

/* ---------------------------- AsciiLandscape ----------------------------- */
/* Composes hill + tree + grass and dissolves its bottom edge into the
   section beneath the hero (mask applied in CSS). */

export default function AsciiLandscape() {
  return (
    <div className="ah-landscape" aria-hidden="true">
      <AsciiHill />
      <AsciiTree />
      <AsciiGrass />
    </div>
  );
}

import "@/components/hero/hero.css";

import AsciiHeroBackground from "@/components/hero/ascii/AsciiHeroBackground";
import HeroContent from "@/components/hero/HeroContent";
import ExperienceSection from "@/components/hero/sections/ExperienceSection";
import ProjectsSection from "@/components/hero/sections/ProjectsSection";
import AboutSection from "@/components/hero/sections/AboutSection";
import SiteFooter from "@/components/hero/sections/SiteFooter";

/*
  HeroPage — a CS portfolio hero with a procedural ASCII cherry-blossom
  landscape background.

  Structure:
    HeroPage
      ├─ AsciiHeroBackground   (glows, falling petals, grain, scrim)
      ├─ HeroContent           (topbar / eyebrow / headline / subhead / CTAs)
      │    └─ AsciiLandscape    (hill + tree + grass)
      ├─ ExperienceSection
      ├─ ProjectsSection
      ├─ AboutSection
      └─ SiteFooter

  Theming + animation live in hero.css (CSS variables + @keyframes). Editable
  copy lives in src/data/portfolio.js. The ASCII generators live in src/lib.
*/

export default function HeroPage() {
  return (
    <div className="ah-root">
      <AsciiHeroBackground />
      <HeroContent />
      <ExperienceSection />
      <ProjectsSection />
      <AboutSection />
      <SiteFooter />
    </div>
  );
}

import "@/components/hero/hero.css";

import Atmosphere from "@/components/hero/Atmosphere";
import HeroContent from "@/components/hero/HeroContent";
import ExperienceSection from "@/components/hero/sections/ExperienceSection";
import ProjectsSection from "@/components/hero/sections/ProjectsSection";
import AboutSection from "@/components/hero/sections/AboutSection";
import SiteFooter from "@/components/hero/sections/SiteFooter";

/* Portfolio content and the optional Minesweeper playground. */

export default function HeroPage() {
  return (
    <div className="ah-root">
      <Atmosphere />
      <HeroContent />
      <ExperienceSection />
      <ProjectsSection />
      <AboutSection />
      <SiteFooter />
    </div>
  );
}

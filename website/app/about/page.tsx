import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";

// Client Component Sections
import { AboutHero } from "@/components/about/AboutHero";
import { AboutMetrics } from "@/components/about/AboutMetrics";
import { ExperienceTimeline } from "@/components/about/ExperienceTimeline";
import { Education } from "@/components/about/Education";
import { Certifications } from "@/components/about/Certifications";
import { EngineeringPhilosophy } from "@/components/about/EngineeringPhilosophy";
import { SkillsMarquee } from "@/components/about/SkillsMarquee";
import { WorkingStyle } from "@/components/about/WorkingStyle";
import { Industries } from "@/components/about/Industries";
import { LearningFocus } from "@/components/about/LearningFocus";
import { FAQ } from "@/components/about/FAQ";
import { ContactCTA } from "@/components/about/ContactCTA";

export const metadata = {
  title: "About Musharraf Aziz | AI Engineer & Senior Software Engineer",
  description: "I build production-grade AI systems and high-performance full-stack platforms that solve real enterprise problems.",
};

export default function AboutPage() {
  return (
    <PageLayout>
      <AboutHero />
      <AboutMetrics />
      <ExperienceTimeline />
      <Education />
      <Certifications />
      <EngineeringPhilosophy />
      <SkillsMarquee />
      <WorkingStyle />
      <Industries />
      <LearningFocus />
      <FAQ />
      <ContactCTA />
    </PageLayout>
  );
}

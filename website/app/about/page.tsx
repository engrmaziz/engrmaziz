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
  title: "About Musharraf Aziz | Freelance & Full-Time Senior AI Engineer",
  description:
    "Senior AI engineer available for remote freelance projects and full-time US roles. Custom AI call agents, chatbots, RAG, and workflow automation for California and Florida.",
  alternates: { canonical: "/about" },
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

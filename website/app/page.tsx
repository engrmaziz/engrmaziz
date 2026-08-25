import * as React from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { siteMetadata } from "@/lib/seo";

// Client Component Sections
import { HomeHero } from "@/components/home/HomeHero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Services } from "@/components/home/Services";
import { Projects } from "@/components/home/Projects";
import { Philosophy } from "@/components/home/Philosophy";
import { Stack } from "@/components/home/Stack";
import { Process } from "@/components/home/Process";
import { CTA } from "@/components/home/CTA";

export const metadata = {
  title: "Hire a Senior AI Engineer for Custom Call Agents, Chatbots & RAG",
  description: siteMetadata.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <PageLayout withTopPadding={false}>
      <HomeHero />
      <TrustStrip />
      <Services />
      <Projects />
      <Philosophy />
      <Stack />
      <Process />
      <CTA />
    </PageLayout>
  );
}

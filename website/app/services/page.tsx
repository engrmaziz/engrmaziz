import { Metadata } from "next";
import { getPillars } from "@/lib/services";
import { ServicesClient } from "@/components/service/ServicesClient";

export const metadata: Metadata = {
  title: "Engineering Services | Production-Grade Systems",
  description: "Specialized technical services focusing on FAANG-level engineering, deterministic AI automation, and scalable backend architecture.",
  openGraph: {
    title: "Engineering Services | FAANG-Level Software Architecture",
    description: "Specialized technical services focusing on production-grade systems, AI, and scalable backend architecture.",
    type: "website",
  }
};

export default function ServicesPage() {
  const pillars = getPillars();
  return <ServicesClient initialServices={pillars} />;
}

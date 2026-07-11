"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Briefcase, Building2, MapPin, ChevronRight, Star, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Stack } from "@/components/layout/Stack";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const experiences = [
  {
    company: "Allama Iqbal Hospital Kasur",
    role: "AI Engineer & Operations Manager",
    period: "Aug 2024 – Present",
    industry: "Healthcare / MedTech",
    location: "Kasur, Pakistan",
    summary:
      "A dual-hat leadership and deep technical role at a major regional hospital. Bridging cutting-edge GenAI research with mission-critical healthcare operations where fault tolerance and data privacy are non-negotiable.",
    responsibilities: [
      "Architect and maintain enterprise-grade Multi-Agent LLM Workflows and Clinical RAG systems.",
      "Design AI Guardrail Gateways ensuring HIPAA-compliant PII/PHI redaction using Microsoft Presidio.",
      "Manage cross-departmental digital workflow automation across 10+ hospital departments.",
      "Monitor LLM production performance using CI/CD evaluation pipelines (DeepEval).",
    ],
    achievements: [
      "Zero AI hallucinations across 1,000+ daily clinical queries for 12+ consecutive months.",
      "25% reduction in system downtime after automated workflow deployment.",
      "18% efficiency gain in administrative operations via parallel n8n automation.",
      "High Performance Excellence Award — June 2025.",
    ],
    stack: ["Python", "LangGraph", "FastAPI", "ChromaDB", "MS Presidio", "n8n", "GPT-OSS", "Groq"],
    impact:
      "Modernized hospital operations, ensuring medical staff have instantaneous, secure access to clinical data, improving patient throughput and safety.",
  },
  {
    company: "NovaSole Pakistan",
    role: "Software Engineer & IT Manager",
    period: "Dec 2023 – Aug 2024",
    industry: "E-Commerce / Retail Tech",
    location: "Kasur, Pakistan",
    summary:
      "Heavy full-stack engineering role architecting, scaling, and maintaining a high-traffic e-commerce platform. Demanded deep expertise in Next.js, database optimization, and third-party API integrations.",
    responsibilities: [
      "Architect and develop the core e-commerce storefront and admin dashboard using Next.js and TypeScript.",
      "Design and maintain PostgreSQL/MySQL schemas for product catalogs, user data, and order routing.",
      "Integrate payment gateways, shipping APIs, and logistics providers across 3 distinct sales channels.",
      "Manage IT operations ensuring high availability during traffic spikes.",
    ],
    achievements: [
      "Scaled platform infrastructure to 500,000+ monthly visitors reliably.",
      "Maintained 98%+ data accuracy across complex multi-channel inventory systems.",
      "Drove monthly revenue of 10M PKR through platform performance.",
    ],
    stack: ["Next.js", "TypeScript", "React", "PostgreSQL", "MySQL", "Node.js", "Tailwind CSS"],
    impact:
      "Directly drove revenue by ensuring lightning-fast platform availability. API integrations eliminated manual logistics overhead and cart abandonment.",
  },
  {
    company: "Ihsan Solar Energy Pvt. Ltd.",
    role: "Team Lead, Quality Assurance & NOC Development",
    period: "Dec 2022 – Dec 2023",
    industry: "Renewable Energy / Solar",
    location: "Raiwind, Pakistan",
    summary:
      "Critical operational leadership combining hardware knowledge (solar PV systems) with software monitoring. Built a NOC from scratch to ensure maximum yield and uptime for deployed solar assets.",
    responsibilities: [
      "Architect and develop the company's first centralized Network Operations Center.",
      "Lead a 4-person engineering team monitoring 400+ kW of installed solar capacity.",
      "Design and implement QA protocols for hardware installation and software telemetry.",
      "Integrate inverter APIs and monitoring sensors into a unified real-time fault detection dashboard.",
    ],
    achievements: [
      "Reduced operational faults by 25% within the first year.",
      "Successfully monitored and maintained 400+ kW of active solar capacity.",
      "Productivity Leader Award — July 2023.",
    ],
    stack: ["REST APIs", "Inverter Telemetry", "Sensor Data Pipelines", "NOC Architecture", "Electrical Engineering"],
    impact:
      "Transitioned the company from reactive maintenance to proactive monitoring. Drastically reduced dispatch costs and improved client satisfaction.",
  },
  {
    company: "Transworld Home (ISP)",
    role: "Team Lead, Technical Assistance Center",
    period: "Mar 2022 – Nov 2022",
    industry: "Telecommunications / ISP",
    location: "Lahore, Pakistan",
    summary:
      "High-pressure operational leadership at a major ISP. Managing large-scale network health, enforcing strict SLAs, and leading a 14-person TAC team for 50,000+ user connections.",
    responsibilities: [
      "Manage and mentor a 14-person Technical Assistance Center team.",
      "Oversee network health and technical support for 50,000+ active connections.",
      "Enforce strict SLAs for fault resolution and customer support escalations.",
      "Optimize internal ticketing and routing workflows to reduce AHT.",
    ],
    achievements: [
      "98% SLA resolution rate across the network.",
      "99.95% network uptime maintained consistently.",
      "18% reduction in fault resolution time.",
      "Employee of the Month (September 2022), Workplace Commitment Award (October 2022).",
    ],
    stack: ["ISP Networking", "CRM/Ticketing Systems", "Incident Management", "SLA Enforcement"],
    impact:
      "Directly impacted customer retention and brand reputation. Operational optimizations saved significant man-hours.",
  },
  {
    company: "Sybrid Private Limited",
    role: "Customer Operations Specialist",
    period: "Nov 2021 – Feb 2022",
    industry: "Customer Operations",
    location: "Lahore, Pakistan",
    summary:
      "Established professional foundations in high-volume client communication and quality-driven execution. Handled complex customer workflows and escalations.",
    responsibilities: [
      "Process high-volume client communications and resolve critical escalations.",
      "Ensure adherence to quality assurance standards in all interactions.",
    ],
    achievements: [
      "Awarded Top Performer of the Month (×3).",
      "Awarded Top Quality Champ.",
    ],
    stack: ["Client Communication", "Quality Assurance", "Workflow Execution"],
    impact:
      "Built a strong foundation in process execution and quality-driven operations, earning multiple performance awards.",
  },
];

export function ExperienceTimeline() {
  return (
    <Section className="bg-elevated py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Experience</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Four years of progressively complex roles across healthcare, e-commerce, energy, and telecommunications — each producing measurable engineering outcomes.
          </p>
        </motion.div>

        <Stack gap="xl">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="bg-base border-border-default overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-8 border-b border-border-default">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-primary">{exp.role}</h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <span className="text-accent font-semibold flex items-center gap-1 text-sm">
                            <Building2 className="w-4 h-4" />
                            {exp.company}
                          </span>
                          <span className="text-secondary text-sm flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {exp.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <Badge variant="outline" className="mb-1">{exp.industry}</Badge>
                        <p className="text-sm font-mono text-secondary">{exp.period}</p>
                      </div>
                    </div>
                    <p className="text-secondary leading-relaxed mt-4 text-sm">{exp.summary}</p>
                  </div>

                  {/* Body */}
                  <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border-default">
                    <div className="p-8">
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-accent" /> Responsibilities
                      </h4>
                      <ul className="space-y-2">
                        {exp.responsibilities.map((r, j) => (
                          <li key={j} className="flex items-start gap-2 text-secondary text-sm leading-relaxed">
                            <ChevronRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8">
                      <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent" /> Achievements & KPIs
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((a, j) => (
                          <li key={j} className="flex items-start gap-2 text-secondary text-sm leading-relaxed">
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-8 py-5 bg-base/50 border-t border-border-default">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {exp.stack.map((s) => (
                        <Badge key={s} variant="default" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                    <p className="text-secondary text-sm italic">
                      <span className="font-semibold text-primary not-italic">Impact: </span>
                      {exp.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </Section>
  );
}

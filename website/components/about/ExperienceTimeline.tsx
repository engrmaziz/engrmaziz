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
    company: "Cygnus Technologies",
    role: "Senior Applied AI/ML Engineer",
    period: "Jul 2026 – Present",
    industry: "Applied AI / Enterprise Technology",
    location: "Lahore, Pakistan",
    summary:
      "Designing and deploying end-to-end AI and machine learning solutions for large-scale data processing, analytics, and intelligent automation across business functions.",
    responsibilities: [
      "Build scalable ETL and data pipelines for high-volume ingestion, transformation, and storage supporting analytics and model training.",
      "Develop and fine-tune custom ML, deep learning, and generative AI solutions, including LLMs and RAG applications.",
      "Build AI-powered reporting dashboards, predictive analytics, and recommendation systems for data-driven decision making.",
      "Deploy, monitor, and optimize production ML models following MLOps practices covering versioning, monitoring, and reliable rollout.",
    ],
    achievements: [
      "Enterprise AI applications grounded in operational data using LangChain, LlamaIndex, Hugging Face, OpenAI APIs, and vector databases.",
      "Cross-functional delivery of scalable, secure, high-performance AI solutions aligned with business objectives.",
    ],
    stack: ["Python", "LangChain", "LlamaIndex", "Hugging Face", "OpenAI", "Vector DBs", "MLOps", "ETL"],
    impact:
      "Shipping production AI systems that turn high-volume operational data into reliable analytics, automation, and model-driven decisions.",
  },
  {
    company: "Allama Iqbal Hospital, Kasur",
    role: "AI Engineer & Operations Manager",
    period: "Aug 2024 – Jul 2026",
    industry: "Healthcare / MedTech",
    location: "Kasur, Pakistan",
    summary:
      "Designed and deployed an LLM-powered AI agent with a LangChain RAG pipeline on a multi-channel patient platform, connecting the agent to real hospital systems.",
    responsibilities: [
      "Deployed an LLM-powered AI agent using OpenAI, Gemini, and Groq-hosted Llama 3.3 70B, with a LangChain RAG pipeline handling 1,000+ daily interactions.",
      "Built agent workflows integrating APIs, internal databases, and messaging platforms via a 16-node n8n automation system.",
      "Built and published a Model Context Protocol server giving AI agents structured, tool-based access to external systems.",
      "Hardened the agent against low-confidence or incorrect outputs using fallback handling and data governance before data reached the LLM.",
    ],
    achievements: [
      "1,000+ daily production interactions on a multi-channel patient platform.",
      "Monitored agent output quality over time, refining prompt design and retrieval logic from real interaction failure patterns.",
      "High Performance Excellence Award — June 2025.",
    ],
    stack: ["Python", "LangChain", "OpenAI", "Gemini", "Groq", "Llama 3.3 70B", "n8n", "MCP"],
    impact:
      "Gave clinical and operations teams a production AI agent grounded in hospital systems, with governance controls before any data reached the LLM.",
  },
  {
    company: "NovaSole Pakistan",
    role: "Automation Engineer & IT Manager",
    period: "Dec 2023 – Aug 2024",
    industry: "E-Commerce / Retail Tech",
    location: "Kasur, Pakistan",
    summary:
      "Built automated workflows and data pipelines connecting a high-traffic e-commerce platform to payment processors and inventory systems across three sales channels.",
    responsibilities: [
      "Built automated workflows connecting an e-commerce platform serving 500,000+ monthly visitors with payment processors and inventory systems across 3 sales channels, using REST APIs and webhook-based triggers.",
      "Built data pipelines and automated synchronisation logic, eliminating a previously manual daily reconciliation process.",
    ],
    achievements: [
      "Scaled platform infrastructure to 500,000+ monthly visitors.",
      "Achieved 98%+ data accuracy across multi-channel inventory and payment systems.",
    ],
    stack: ["REST APIs", "Webhooks", "Data Pipelines", "Automation", "E-Commerce Integrations"],
    impact:
      "Removed manual daily reconciliation and kept inventory and payments consistent across three sales channels under high traffic.",
  },
  {
    company: "Ihsan Solar Energy Pvt. Ltd.",
    role: "Team Lead, Quality Assurance & NOC Development",
    period: "Dec 2022 – Dec 2023",
    industry: "Renewable Energy / Solar",
    location: "Raiwind, Pakistan",
    summary:
      "Built monitoring and alerting logic for a Network Operations Center and led a QA team using operational data to improve fault detection across installed solar capacity.",
    responsibilities: [
      "Built monitoring and alerting logic for a Network Operations Center, using collected operational data to identify patterns and improve fault detection across 400+ kW installed capacity.",
      "Led a QA team of 4, introducing structured testing and data-driven analysis practices.",
    ],
    achievements: [
      "Reduced operational faults by 25%.",
      "Successfully monitored and maintained 400+ kW of active solar capacity.",
      "Productivity Leader Award — July 2023.",
    ],
    stack: ["REST APIs", "Inverter Telemetry", "Sensor Data Pipelines", "NOC Architecture", "QA"],
    impact:
      "Moved operations from reactive maintenance to data-driven monitoring, cutting faults and improving yield across deployed solar assets.",
  },
  {
    company: "Transworld Home (ISP)",
    role: "Team Lead, Technical Assistance Center",
    period: "Mar 2022 – Nov 2022",
    industry: "Telecommunications / ISP",
    location: "Lahore, Pakistan",
    summary:
      "Led a 14-person TAC team supporting 50,000+ active connections, using performance data to identify recurring issues and coach staff.",
    responsibilities: [
      "Led a 14-person team achieving 98% issue resolution within SLA across 50,000+ active connections, using performance data to identify recurring issues.",
      "Trained and mentored 10+ technical staff, reducing average fault resolution time.",
    ],
    achievements: [
      "98% issue resolution within SLA across 50,000+ active connections.",
      "18% reduction in average fault resolution time.",
    ],
    stack: ["ISP Networking", "CRM/Ticketing Systems", "Incident Management", "SLA Enforcement"],
    impact:
      "Improved SLA performance and cut resolution time by coaching staff and targeting recurring network issues with operational data.",
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
            Four years of progressively complex roles across applied AI, healthcare, e-commerce, energy, and telecommunications — each producing measurable engineering outcomes.
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

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
      "Build data pipelines and integration architectures for high-volume ingestion, transformation, and structured storage, aimed at lower latency.",
      "Develop and fine-tune LLM and RAG applications using LangChain, LlamaIndex, Hugging Face, OpenAI APIs, and vector databases.",
      "Deploy, monitor, and optimize production ML models on AWS following MLOps practices: versioning, performance monitoring, and reliable rollout.",
      "Extend PII redaction and data governance with spaCy NER and Microsoft Presidio, and build hallucination-detection evals against golden datasets.",
    ],
    achievements: [
      "Enterprise AI applications grounded in operational data using LangChain, LlamaIndex, Hugging Face, OpenAI APIs, and vector databases.",
      "Evaluation tooling that scores answer relevancy and faithfulness and tracks pass rate and latency over time.",
    ],
    stack: ["Python", "LangChain", "LlamaIndex", "Hugging Face", "OpenAI", "AWS", "Presidio", "MLOps"],
    impact:
      "Shipping production AI systems that turn high-volume operational data into reliable analytics, automation, and model-driven decisions.",
  },
  {
    company: "Bano Qabil Pakistan (Alkhidmat Foundation)",
    role: "Trainer, Applied Artificial Intelligence",
    period: "Aug 2026 – Present · Part-time volunteer",
    industry: "Applied AI Education",
    location: "Kasur, Pakistan",
    summary:
      "Part-time instructorship delivering hands-on applied AI, machine learning, and generative AI training for learners with little or no technical background.",
    responsibilities: [
      "Design and deliver a curriculum focused on real-world AI implementation and end-to-end application development, built around practical project work.",
      "Teach Python, large language models, prompt engineering, retrieval-augmented generation, AI agents, embeddings, vector databases, and modern AI frameworks in plain language.",
      "Mentor and assess learners through hands-on projects covering AI deployment, MLOps fundamentals, responsible AI, safety, ethics, and governance.",
    ],
    achievements: [
      "Volunteer instructorship under an Alkhidmat Foundation initiative, translating production AI practice into teachable, project-based skills.",
    ],
    stack: ["Python", "LLMs", "Prompt Engineering", "RAG", "AI Agents", "Vector DBs", "MLOps"],
    impact:
      "Turns production AI engineering into a teachable curriculum so beginners can ship real applications, not just notebooks.",
  },
  {
    company: "Allama Iqbal Hospital, Kasur",
    role: "AI Engineer & Operations Manager",
    period: "Aug 2024 – Jul 2026",
    industry: "Production AI / Operations Platforms",
    location: "Kasur, Pakistan",
    summary:
      "Designed and deployed an agentic AI call and chat system on Llama 3.3 70B (Groq), with OpenAI and Gemini as fallbacks, connected to live databases and messaging channels.",
    responsibilities: [
      "Shipped an agentic AI CallBot on Llama 3.3 70B via Groq, reachable over WhatsApp and inbound phone calls through Twilio, handling 1,000+ daily production interactions.",
      "Built a LangChain RAG pipeline grounding agent responses in operational knowledge, plus a 16-node n8n graph and an MCP server for tool-based system access.",
      "Hardened the agent with fallback handling and PII redaction (spaCy + Microsoft Presidio) before any data reached the language model.",
      "Deployed AI services on Microsoft Azure for nearly two years, and added OCR (Tesseract, PaddleOCR) plus PyTorch LSTM forecasting in the production inference path.",
    ],
    achievements: [
      "1,000+ daily production interactions across WhatsApp and voice.",
      "Monitored agent output quality over time, refining retrieval and prompts from real interaction failure patterns.",
      "High Performance Excellence Award — June 2025.",
    ],
    stack: ["Python", "LangChain", "Groq", "Llama 3.3 70B", "Twilio", "n8n", "MCP", "Azure"],
    impact:
      "Gave operations teams a production voice and chat agent grounded in live systems, with evals and governance before any data reached the LLM.",
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
            More than five years of progressively complex roles across applied AI, backend systems, e-commerce, energy, and telecommunications — plus a current part-time applied-AI instructorship.
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
              <Card className="overflow-hidden border-border-default bg-base">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="border-b border-border-default p-5 sm:p-8">
                    <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                      <div className="min-w-0 max-w-full">
                        <h3 className="text-2xl font-bold text-primary">{exp.role}</h3>
                        <div className="mt-2 flex min-w-0 flex-wrap items-center gap-3">
                          <span className="flex min-w-0 items-center gap-1 text-sm font-semibold text-accent">
                            <Building2 className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 break-words">{exp.company}</span>
                          </span>
                          <span className="flex min-w-0 items-center gap-1 text-sm text-secondary">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="min-w-0 break-words">{exp.location}</span>
                          </span>
                        </div>
                      </div>
                      <div className="min-w-0 max-w-full sm:max-w-xs sm:text-right">
                        <Badge variant="outline" className="mb-1">{exp.industry}</Badge>
                        <p className="font-mono text-sm text-secondary">{exp.period}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-secondary">{exp.summary}</p>
                  </div>

                  {/* Body */}
                  <div className="grid divide-y divide-border-default md:grid-cols-2 md:divide-x md:divide-y-0">
                    <div className="p-5 sm:p-8">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Briefcase className="h-4 w-4 text-accent" /> Responsibilities
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

                    <div className="p-5 sm:p-8">
                      <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Star className="h-4 w-4 text-accent" /> Achievements & KPIs
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
                  <div className="border-t border-border-default bg-base/50 px-5 py-5 sm:px-8">
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

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Award } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const certifications = [
  {
    provider: "Google / Coursera",
    title: "Google AI Professional Certificate",
    date: "April 2026",
    skills: [
      "Neural Network Architecture (CNNs, RNNs)",
      "TensorFlow & Keras",
      "ML Data Pipelines",
      "Ethical AI & bias mitigation",
    ],
    badge: "Google",
    color: "text-blue-600 dark:text-blue-400",
  },
  {
    provider: "Linux Foundation",
    title: "PyTorch & Deep Learning for Decision Makers (LFS116)",
    date: "2025",
    skills: [
      "Tensor mathematics & GPU acceleration",
      "Custom neural network design",
      "Training loops & backpropagation",
      "ML ROI evaluation",
    ],
    badge: "LFS116",
    color: "text-orange-600 dark:text-orange-400",
  },
  {
    provider: "Anthropic / UCC",
    title: "AI Fluency: Framework & Foundations",
    date: "2025",
    skills: [
      "Advanced Prompt Engineering (CoT, Few-Shot)",
      "System Prompt design & output schemas",
      "Context window optimization",
      "Safe, predictable AI outputs (JSON/XML)",
    ],
    badge: "Anthropic",
    color: "text-purple-600 dark:text-purple-400",
  },
  {
    provider: "McKinsey & Company",
    title: "McKinsey Forward Program",
    date: "December 2025",
    skills: [
      "Structured problem-solving (McKinsey Way)",
      "Adaptability & resilience",
      "Stakeholder communication",
      "Data-driven business strategy",
    ],
    badge: "McKinsey",
    color: "text-teal-600 dark:text-teal-400",
  },
  {
    provider: "Pakistan Engineering Council",
    title: "Registered Professional Engineer (ENGR.)",
    date: "2021 (Active)",
    skills: [
      "Formal engineering ethics & safety standards",
      "Continuous professional development (CPD)",
      "National engineering recognition",
      "6 CPD points — AI, Cybersecurity, Solar (2025)",
    ],
    badge: "PEC",
    color: "text-green-600 dark:text-green-400",
  },
];

export function Certifications() {
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
          <Badge variant="outline" className="mb-4">Credentials</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">
            Certifications
          </h2>
          <p className="text-lg text-secondary max-w-2xl">
            Verifiable credentials from Google, the Linux Foundation, Anthropic, McKinsey, and the Pakistan Engineering Council — not weekend courses.
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {certifications.map((cert, i) => (
            <motion.div key={i} variants={fadeUp}>
              <Card className="bg-base border-border-default h-full hover:border-accent/40 transition-colors duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <span className={`text-xs font-mono font-bold uppercase tracking-wider ${cert.color}`}>
                        {cert.badge}
                      </span>
                      <p className="text-xs text-secondary mt-0.5">{cert.provider}</p>
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{cert.date}</Badge>
                  </div>

                  <h3 className="text-sm font-bold text-primary mb-4 leading-snug flex-1">
                    {cert.title}
                  </h3>

                  <div className="border-t border-border-default pt-4">
                    <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-2">
                      Skills Validated
                    </p>
                    <ul className="space-y-1.5">
                      {cert.skills.map((s) => (
                        <li key={s} className="flex items-start gap-2 text-xs text-secondary">
                          <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Additional certs */}
          <motion.div variants={fadeUp}>
            <Card className="bg-base border-dashed border-border-default h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-secondary">Additional CPD</span>
                </div>
                <h3 className="text-sm font-bold text-primary mb-4">Continuing Professional Development</h3>
                <ul className="space-y-2 text-xs text-secondary flex-1">
                  {[
                    "HP LIFE: AI for Business Professionals (Aug 2025)",
                    "Coursera: Business Analysis & Process Management (Aug 2025)",
                    "OpenLearn: Entrepreneurship — Ideas to Reality (Aug 2025)",
                    "6× PEC CPD Webinars: AI, Cybersecurity, Solar (Sep–Oct 2025)",
                    "SEI RE101: Fundamental Math for Solar (Jan 2026)",
                  ].map((c) => (
                    <li key={c} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                      {c}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Process() {
  return (
    <Section className="bg-base">
      <Container>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Methodology</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">Engineering Lifecycle</h2>
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-4 bottom-4 w-px bg-border-default md:left-1/2 md:-translate-x-1/2" />
          
          <div className="space-y-12">
            {[
              { step: "01", title: "Discovery & Scope", desc: "Deep dive into business requirements, identifying constraints, scale expectations, and core data models." },
              { step: "02", title: "System Architecture", desc: "Drafting the blueprint. Selecting the right databases, defining API contracts, and planning the infrastructure." },
              { step: "03", title: "Agile Development", desc: "Writing clean, modular code with continuous integration. Building the core engine first, UI second." },
              { step: "04", title: "Rigorous Testing", desc: "Automated unit tests, integration tests, and simulated load testing to guarantee fault tolerance." },
              { step: "05", title: "Deployment & Ops", desc: "Containerized deployment to staging, blue-green production rollouts, and setting up observability dashboards." }
            ].map((phase, i) => (
              <motion.div 
                key={phase.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 items-start ${i % 2 === 0 ? "md:flex-row-reverse text-left md:text-right" : ""}`}
              >
                <div className="md:w-1/2" />
                <div className="absolute left-0 md:left-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-base border-2 border-accent text-accent font-mono text-xs font-bold -translate-x-[15px] md:-translate-x-1/2 z-10">
                  {phase.step}
                </div>
                <div className="md:w-1/2 pl-12 md:pl-0 flex flex-col justify-center">
                  <div className={`bg-elevated p-6 rounded-xl border border-border-default shadow-sm ${i % 2 === 0 ? "md:mr-12" : "md:ml-12"}`}>
                    <h3 className="text-xl font-bold text-primary mb-2">{phase.title}</h3>
                    <p className="text-secondary">{phase.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}

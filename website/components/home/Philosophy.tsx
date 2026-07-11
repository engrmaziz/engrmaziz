"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Shield, Workflow, Terminal } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Philosophy() {
  return (
    <Section className="bg-base overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-5 sticky top-32"
          >
            <Badge variant="outline" className="mb-4">Philosophy</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-primary mb-6 leading-tight">
              Software is not just written. It is <span className="text-accent italic">architected.</span>
            </h2>
            <p className="text-lg text-secondary">
              I believe in backend-first thinking. A flashy frontend cannot hide a brittle database schema or a synchronous bottleneck.
            </p>
          </motion.div>
          
          <div className="lg:col-span-7 flex flex-col gap-12">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex gap-6">
              <div className="flex-shrink-0 mt-1"><Shield className="w-6 h-6 text-accent" /></div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-3">Security & Reliability</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  Every API endpoint assumes it is under attack. Rate limiting, input validation, and zero-trust architectures are not afterthoughts—they are the foundation. Systems must fail gracefully and log aggressively.
                </p>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex gap-6">
              <div className="flex-shrink-0 mt-1"><Workflow className="w-6 h-6 text-accent" /></div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-3">Scalable By Design</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  Monoliths are fine until they aren&apos;t. I design systems with bounded contexts, preparing for horizontal scaling and decoupled microservices when the business demands it. Statelessness is paramount.
                </p>
              </div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex gap-6">
              <div className="flex-shrink-0 mt-1"><Terminal className="w-6 h-6 text-accent" /></div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-3">Test Driven Reality</h3>
                <p className="text-secondary leading-relaxed text-lg">
                  Code without tests is legacy code the moment it is committed. I enforce strict CI/CD pipelines with unit, integration, and load testing. Documentation is treated as executable code.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

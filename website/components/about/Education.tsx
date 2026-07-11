"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Award, Star, BookOpen, CheckCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { SplitLayout } from "@/components/layout/SplitLayout";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function Education() {
  return (
    <Section className="bg-base py-24">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="mb-16"
        >
          <Badge variant="outline" className="mb-4">Education</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">
            Academic Foundation
          </h2>
        </motion.div>

        <SplitLayout
          ratio="2/3-1/3"
          left={
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Card className="bg-elevated border-border-default">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                      <GraduationCap className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary">B.Sc. (Hons.) Electrical Engineering</h3>
                      <p className="text-accent font-medium">COMSATS University Islamabad, Lahore Campus</p>
                      <p className="text-secondary text-sm mt-1">September 2017 – August 2021 · EQF Level 6</p>
                    </div>
                  </div>

                  <p className="text-secondary leading-relaxed mb-6 text-sm">
                    A comprehensive four-year program in Electrical Engineering covering power systems, RF and telecommunications, IoT integration, microcontroller programming, and systems failure analysis. The program&apos;s rigorous constraints-based thinking — designing for power limitations, hardware faults, and strict tolerances — directly translates into how production software is architected: for resilience, efficiency, and predictable failure modes.
                  </p>

                  <div className="border-t border-border-default pt-6">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Final Year Project (FYP)</h4>
                    <div className="bg-base rounded-xl p-5 border border-border-default">
                      <div className="flex items-start gap-3 mb-3">
                        <Award className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-primary text-sm">LoRaWAN Smart Agriculture Decision Support System</p>
                          <p className="text-xs text-secondary mt-0.5">Lead Developer & Hardware Architect</p>
                        </div>
                      </div>
                      <p className="text-secondary text-sm leading-relaxed mb-3">
                        End-to-end IoT infrastructure using LoRaWAN to monitor agricultural metrics in real-time over long distances with minimal power consumption, feeding a central decision support system for crop yield optimization.
                      </p>
                      <div className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        Top Innovative FYP of the Year — IGNITE & HEC (2021)
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border-default pt-6 mt-6">
                    <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Research Publication</h4>
                    <div className="flex items-start gap-3">
                      <BookOpen className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-secondary">
                          <span className="text-primary font-medium">Arshad J., Aziz M., et al.</span>{" "}
                          &quot;Implementation of a LoRaWAN Based Smart Agriculture Decision Support System.&quot;
                        </p>
                        <p className="text-sm text-secondary mt-1">
                          <span className="italic">MDPI Sustainability</span>, 2022; 14(2):827. DOI: 10.3390/su14020827 ·{" "}
                          <span className="text-accent font-medium">Impact Factor: 3.125</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          }
          right={
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="space-y-4"
            >
              <Card className="bg-elevated border-border-default">
                <CardContent className="p-6">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-4">Skills Acquired</h4>
                  <ul className="space-y-2">
                    {[
                      "Circuit Design & Microcontroller Programming",
                      "LoRaWAN Protocol & RF Communications",
                      "Sensor Data Pipeline Engineering",
                      "Systems Engineering & Failure Analysis",
                      "Electrical Power Systems",
                    ].map((skill) => (
                      <li key={skill} className="flex items-center gap-2 text-sm text-secondary">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-elevated border-border-default">
                <CardContent className="p-6">
                  <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">Professional Registration</h4>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-primary text-sm">Registered Engineer (ENGR.)</p>
                      <p className="text-xs text-secondary mt-0.5">Pakistan Engineering Council (PEC) · 2021 · Active</p>
                      <p className="text-xs text-secondary mt-2 leading-relaxed">
                        Formal national-level recognition. Mandated continuous professional development maintained annually.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
                <p className="text-sm text-secondary leading-relaxed italic">
                  &quot;The rigorous constraints of embedded systems — power limits, hardware faults, strict tolerances — directly translate into the ability to build fault-tolerant enterprise architectures.&quot;
                </p>
              </div>
            </motion.div>
          }
        />
      </Container>
    </Section>
  );
}

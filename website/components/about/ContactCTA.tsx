"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ResumeDownload } from "@/components/ui/ResumeDownload";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

export function ContactCTA() {
  return (
    <Section className="bg-base pb-32">
      <Container>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="bg-elevated border border-border-default rounded-3xl p-10 md:p-20 relative overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent pointer-events-none" />
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
            <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
              Ready to build something that works in production?
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
              Whether you need a Clinical RAG system, a scalable SaaS platform, a real-time voice AI pipeline, or a technical architecture review — the conversation starts here.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <ResumeDownload />
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="primary"
                  className="px-8 font-bold gap-2"
                >
                  Start a Conversation <MessageCircle className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Server, Database, Cloud, Globe, GitBranch } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export function Stack() {
  return (
    <Section className="bg-elevated border-y border-border-default">
      <Container>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16"
        >
          <Badge variant="outline" className="mb-4">Stack</Badge>
          <h2 className="text-3xl md:text-5xl font-bold text-primary">Technical Arsenal</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { category: "Backend Core", icon: Server, items: ["Python", "Go", "Node.js", "FastAPI", "Express"] },
            { category: "AI & Data", icon: Database, items: ["PyTorch", "LangChain", "Pinecone", "Milvus", "OpenAI API"] },
            { category: "Cloud & DevOps", icon: Cloud, items: ["AWS", "GCP", "Docker", "Kubernetes", "GitHub Actions"] },
            { category: "Databases", icon: Database, items: ["PostgreSQL", "Redis", "MongoDB", "Elasticsearch"] },
            { category: "Frontend", icon: Globe, items: ["React", "Next.js", "TypeScript", "Tailwind CSS"] },
            { category: "Architecture", icon: GitBranch, items: ["Microservices", "Event-Driven", "REST", "GraphQL", "WebSockets"] }
          ].map((stack, i) => (
            <motion.div 
              key={stack.category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-base p-8 rounded-xl border border-border-default"
            >
              <div className="flex items-center gap-3 mb-6">
                <stack.icon className="w-5 h-5 text-accent" />
                <h3 className="text-xl font-bold text-primary">{stack.category}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {stack.items.map(item => (
                  <Badge key={item} variant="outline" className="bg-elevated">{item}</Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* eslint-disable */
// @ts-nocheck
import React from "react";
import { cn } from "@/lib/utils";

// React Icons
import {
  SiPython,
  SiFastapi,
  SiNextdotjs,
  SiTypescript,
  SiPostgresql,
  SiSupabase,
  SiCloudflare,
  SiVercel,
} from "react-icons/si";
import { Network, BrainCircuit, Database } from "lucide-react";

const techStack = [
  // Left side (avoiding center)
  { name: "Python", icon: <SiPython />, delay: "0s", x: "10%", y: "15%" },
  { name: "LangGraph", icon: <Network />, delay: "1.2s", x: "8%", y: "45%" },
  { name: "Groq", icon: <BrainCircuit />, delay: "2.5s", x: "12%", y: "75%" },
  { name: "Supabase", icon: <SiSupabase />, delay: "3.2s", x: "20%", y: "25%" },
  { name: "TypeScript", icon: <SiTypescript />, delay: "1.5s", x: "15%", y: "85%" },
  // Right side (avoiding center)
  { name: "FastAPI", icon: <SiFastapi />, delay: "0.5s", x: "85%", y: "25%" },
  { name: "Next.js", icon: <SiNextdotjs />, delay: "0.8s", x: "82%", y: "65%" },
  { name: "PostgreSQL", icon: <SiPostgresql />, delay: "2.1s", x: "78%", y: "85%" },
  { name: "Jina AI", icon: <Database />, delay: "1.8s", x: "88%", y: "10%" },
  { name: "Vercel", icon: <SiVercel />, delay: "2.8s", x: "92%", y: "45%" },
  { name: "Cloudflare", icon: <SiCloudflare />, delay: "0.3s", x: "75%", y: "5%" },
];

export function FloatingTechPills() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden h-full w-full opacity-10 blur-sm mix-blend-screen select-none aria-hidden">
      {techStack.map((tech, i) => (
        <div
          key={tech.name}
          className="absolute hidden md:flex animate-float-slow will-change-transform"
          style={{
            left: tech.x,
            top: tech.y,
            animationDelay: tech.delay,
          }}
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-elevated/20 border border-border-default/20 rounded-full shadow-none text-xs font-medium text-secondary/50 pointer-events-none cursor-default group">
            <div className="w-3 h-3 flex items-center justify-center opacity-50">
              {tech.icon}
            </div>
            {tech.name}
          </div>
        </div>
      ))}
    </div>
  );
}

import * as React from "react";
import { Workflow, Database, Server, GitMerge } from "lucide-react";

export interface DiagramPlaceholderProps {
  type: "mermaid" | "c4" | "sequence" | "infrastructure" | "database" | "api";
  title?: string;
  description?: string;
}

export function DiagramPlaceholder({ type, title, description }: DiagramPlaceholderProps) {
  const getConfig = () => {
    switch (type) {
      case "c4":
        return { icon: <Workflow className="w-8 h-8" />, label: "C4 Architecture Diagram" };
      case "database":
        return { icon: <Database className="w-8 h-8" />, label: "Database Schema (ERD)" };
      case "infrastructure":
        return { icon: <Server className="w-8 h-8" />, label: "Infrastructure Topology" };
      case "api":
      case "sequence":
        return { icon: <GitMerge className="w-8 h-8" />, label: "Sequence / Flow Diagram" };
      default:
        return { icon: <Workflow className="w-8 h-8" />, label: "Architecture Diagram" };
    }
  };

  const config = getConfig();

  return (
    <div className="w-full bg-elevated border border-border-default border-dashed rounded-xl p-8 md:p-16 flex flex-col items-center justify-center text-center my-8">
      <div className="w-16 h-16 rounded-2xl bg-base border border-border-default flex items-center justify-center text-secondary mb-4 shadow-sm">
        {config.icon}
      </div>
      <h4 className="text-lg font-bold text-primary mb-2">
        {title || config.label}
      </h4>
      <p className="text-sm text-secondary max-w-md mx-auto">
        {description || "Information Required: Visual architecture diagrams are currently being updated for this case study to ensure compliance and accuracy."}
      </p>
    </div>
  );
}

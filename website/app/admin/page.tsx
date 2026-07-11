import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Users, Database, FileText, RefreshCw, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Contacts", value: "142", icon: Users, trend: "+12%" },
    { title: "Qualified Leads", value: "24", icon: Users, trend: "+5%" },
    { title: "RAG Vectors", value: "12,450", icon: Database, trend: "+1,200" },
    { title: "Indexed Documents", value: "45", icon: FileText, trend: "+2" },
    { title: "AI Conversations", value: "892", icon: MessageSquare, trend: "+145" },
    { title: "Blog Sync Status", value: "Healthy", icon: RefreshCw, trend: "Synced 2h ago" },
  ];

  return (
    <>
      <AdminHeader title="System Dashboard" />
      <div className="p-6 md:p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 border border-border-default rounded-xl bg-elevated shadow-sm hover:border-accent/40 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-secondary uppercase tracking-wider">{stat.title}</h3>
                <stat.icon className="w-4 h-4 text-secondary group-hover:text-accent transition-colors" />
              </div>
              <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">{stat.trend}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 border border-border-default rounded-xl bg-elevated shadow-sm">
            <h3 className="text-sm font-bold text-primary mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-accent mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm text-primary font-medium">New Contact: Enterprise Architecture Review</p>
                  <p className="text-xs text-secondary">from CTO at TechCorp • 10 mins ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                <div>
                  <p className="text-sm text-primary font-medium">RAG Sync: High Concurrency Systems</p>
                  <p className="text-xs text-secondary">Embedded 45 chunks • 2 hours ago</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border border-border-default rounded-xl bg-elevated shadow-sm">
            <h3 className="text-sm font-bold text-primary mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Groq API (GPT OSS 120B)</span>
                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Jina Embeddings</span>
                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded">Operational</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-secondary">Supabase pgvector</span>
                <span className="text-xs font-bold px-2 py-1 bg-green-500/10 text-green-500 rounded">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

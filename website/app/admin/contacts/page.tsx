"use client";
import * as React from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDataTable } from "@/components/admin/AdminDataTable";

export default function ContactsPage() {
  const columns = [
    { key: "name", header: "Name" },
    { key: "company", header: "Company" },
    { key: "status", header: "Status", render: (val: string) => (
      <span className="px-2 py-1 bg-accent/10 text-accent text-xs font-bold rounded uppercase tracking-wider">{val}</span>
    )},
    { key: "score", header: "Lead Score" },
    { key: "date", header: "Date" },
  ];

  const data = [
    { name: "John Doe", company: "Acme Corp", status: "new", score: 85, date: "2024-03-20" },
    { name: "Jane Smith", company: "TechFlow", status: "qualified", score: 92, date: "2024-03-19" },
    { name: "Robert Johnson", company: "DataScale", status: "contacted", score: 45, date: "2024-03-18" },
  ];

  return (
    <>
      <AdminHeader title="Contacts Management" />
      <div className="p-6 md:p-8">
        <AdminDataTable columns={columns} data={data} />
      </div>
    </>
  );
}

/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreVertical, Download } from "lucide-react";

interface Column {
  key: string;
  header: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface AdminDataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function AdminDataTable({ columns, data, onRowClick }: AdminDataTableProps) {
  return (
    <div className="bg-elevated border border-border-default rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-border-default flex items-center justify-between bg-base/50">
        <div className="flex items-center gap-2">
          <button className="text-xs font-medium px-3 py-1.5 bg-base border border-border-default rounded-md hover:border-accent transition-colors">Filter</button>
          <button className="text-xs font-medium px-3 py-1.5 bg-base border border-border-default rounded-md hover:border-accent transition-colors">Sort</button>
        </div>
        <button className="text-xs font-medium px-3 py-1.5 text-secondary hover:text-primary transition-colors flex items-center gap-1.5">
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-secondary uppercase bg-base/80 border-b border-border-default">
            <tr>
              <th className="px-6 py-3 w-10">
                <input type="checkbox" className="rounded border-border-default text-accent focus:ring-accent" />
              </th>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-3 font-bold tracking-wider">{col.header}</th>
              ))}
              <th className="px-6 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-default">
            {data.map((row, i) => (
              <tr 
                key={i} 
                className="hover:bg-base/50 transition-colors group cursor-pointer"
                onClick={() => onRowClick && onRowClick(row)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded border-border-default text-accent focus:ring-accent" />
                </td>
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 text-primary">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <button className="p-1 text-secondary opacity-0 group-hover:opacity-100 hover:text-primary transition-all rounded">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-border-default flex items-center justify-between bg-base/50">
        <span className="text-xs text-secondary">Showing 1 to {data.length} of {data.length} entries</span>
        <div className="flex items-center gap-1">
          <button className="p-1.5 text-secondary hover:text-primary hover:bg-elevated rounded border border-transparent hover:border-border-default transition-all" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-secondary hover:text-primary hover:bg-elevated rounded border border-transparent hover:border-border-default transition-all">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

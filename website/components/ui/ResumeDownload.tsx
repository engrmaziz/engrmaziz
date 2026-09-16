/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { FileText, Download } from "lucide-react";
import { Toast } from "./Toast";
import { downloadResume } from "@/lib/download-resume";

export function ResumeDownload() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    setToastOpen(false);
    try {
      downloadResume();
    } catch {
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-elevated border border-border-default rounded-xl p-6 shadow-sm w-full max-w-2xl mx-auto mb-16 hud-corners">
        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
          <FileText className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h4 className="font-bold text-primary">Download Resume</h4>
          <p className="text-sm text-secondary">PDF · Musharraf Aziz · Applied AI/ML</p>
        </div>
        <Button
          onClick={handleDownload}
          isLoading={isLoading}
          leftIcon={!isLoading ? <Download className="w-4 h-4" /> : undefined}
          disabled={isLoading}
          className="cursor-pointer"
        >
          {isLoading ? "Preparing..." : "Download PDF"}
        </Button>
      </div>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Could not retrieve the latest resume. Please try again later."
        type="error"
      />
    </>
  );
}

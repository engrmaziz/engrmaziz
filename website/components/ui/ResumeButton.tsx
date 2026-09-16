/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Download } from "lucide-react";
import { Toast } from "./Toast";
import { downloadResume } from "@/lib/download-resume";

export function ResumeButton() {
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
      <Button
        size="lg"
        variant="secondary"
        onClick={handleDownload}
        isLoading={isLoading}
        leftIcon={!isLoading ? <Download className="w-4 h-4" /> : undefined}
        disabled={isLoading}
        className="cursor-pointer px-8 font-bold gap-2"
      >
        {isLoading ? "Preparing..." : "Download Resume"}
      </Button>

      <Toast
        isOpen={toastOpen}
        onClose={() => setToastOpen(false)}
        message="Could not retrieve the latest resume. Please try again later."
        type="error"
      />
    </>
  );
}

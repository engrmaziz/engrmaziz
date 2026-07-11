/* eslint-disable */
// @ts-nocheck
"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "./Button";
import { Download } from "lucide-react";
import { Toast } from "./Toast";

export function ResumeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    setToastOpen(false);
    try {
      const res = await fetch('/api/resume');
      if (!res.ok) throw new Error("Failed to fetch resume link");
      const data = await res.json();
      
      const a = document.createElement("a");
      a.href = data.url;
      a.download = "Musharraf_Aziz_Resume.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
    } catch (err) {
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
        className="px-8 font-bold gap-2"
      >
        {isLoading ? "Generating..." : "Download Resume"}
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

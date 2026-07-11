"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from 'next-themes';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'inherit',
});

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const { theme } = useTheme();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'light' ? 'default' : 'dark',
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      try {
        if (chart && ref.current) {
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvgCode(svg);
        }
      } catch (error) {
        console.error('Mermaid rendering failed', error);
      }
    };

    renderChart();
  }, [chart, theme]);

  return (
    <div 
      className="mermaid-container w-full overflow-x-auto bg-base p-6 rounded-xl border border-border-default shadow-inner flex justify-center"
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
}

"use client";

import React, { useEffect, useRef, useState, useId } from 'react';
import { useTheme } from 'next-themes';

interface MermaidProps {
  chart: string;
}

export function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgCode, setSvgCode] = useState<string>('');
  const [hasError, setHasError] = useState<boolean | string>(false);
  const { theme } = useTheme();
  const id = useId().replace(/:/g, ''); // Ensure safe ID characters

  useEffect(() => {
    let isMounted = true;

    const renderChart = async () => {
      try {
        if (!chart) return;
        
        setHasError(false);
        const mermaid = (await import('mermaid')).default;
        
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'light' ? 'default' : 'dark',
          securityLevel: 'loose',
        });

        // Use a unique ID for this render pass to prevent React StrictMode clashes
        const renderId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // mermaid.render returns an object with { svg, bindFunctions }
        const { svg } = await mermaid.render(renderId, chart);
        
        if (isMounted) {
          setSvgCode(svg);
        }
      } catch (error: any) {
        if (process.env.NODE_ENV !== 'production') {
          console.error('Mermaid rendering failed', error);
          console.error('Failed chart:', chart);
        }
        if (isMounted) {
          setHasError(error?.message || String(error));
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart, theme, id]);

  if (hasError) {
    return (
      <div className="w-full bg-elevated p-6 rounded-xl border border-border-default border-dashed flex justify-center text-secondary text-sm">
        Unable to render diagram. {typeof hasError === 'string' ? hasError : ''}
      </div>
    );
  }

  // Prevents layout shift by providing a minimum height while waiting for SVG
  return (
    <div 
      className="mermaid-container w-full overflow-x-auto bg-base p-6 rounded-xl border border-border-default shadow-inner flex justify-center min-h-[150px]"
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: svgCode }}
    />
  );
}

import React from 'react';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  className?: string;
}

export function Marquee({
  children,
  direction = 'left',
  className = '',
}: MarqueeProps) {
  const animationClass = direction === 'left' ? 'animate-marquee' : 'animate-marquee-reverse';
  
  return (
    <div 
      className={`flex w-full overflow-hidden group ${className} motion-reduce:overflow-auto`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <div 
        className={`flex shrink-0 min-w-full gap-8 items-center pr-8 motion-safe:group-hover:[animation-play-state:paused] motion-reduce:animate-none will-change-transform ${animationClass}`}
      >
        {children}
      </div>
      <div 
        aria-hidden="true" 
        className={`flex shrink-0 min-w-full gap-8 items-center pr-8 motion-safe:group-hover:[animation-play-state:paused] motion-reduce:hidden will-change-transform ${animationClass}`}
      >
        {children}
      </div>
    </div>
  );
}

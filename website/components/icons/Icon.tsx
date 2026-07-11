import * as React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface IconProps extends React.SVGAttributes<SVGElement> {
  icon: LucideIcon;
  size?: "sm" | "md" | "lg" | "xl" | number;
  className?: string;
}

export function Icon({ icon: IconComponent, size = "md", className, ...props }: IconProps) {
  const sizeMap = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  };

  const pxSize = typeof size === "number" ? size : sizeMap[size];

  return (
    <IconComponent
      size={pxSize}
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}

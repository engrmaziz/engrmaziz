import Image from "next/image";
import { cn } from "@/lib/utils";
import lightLogo from "@/public/images/maklight.webp";
import darkLogo from "@/public/images/makdark.webp";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", priority = false, className }: BrandLogoProps) {
  // Height mapping based on official branding requirements
  const sizeClasses = {
    sm: "h-10 md:h-12",
    md: "h-[52px] md:h-[65px]",
    lg: "h-[60px] md:h-[80px]",
  };

  const altText = "Musharraf Aziz — AI Engineer, Full-Stack Developer & Enterprise AI Solutions";

  return (
    <div className={cn("relative flex items-center", sizeClasses[size], className)}>
      <Image
        src={lightLogo}
        alt={altText}
        priority={priority}
        className="w-auto h-full object-contain dark:hidden"
      />
      <Image
        src={darkLogo}
        alt={altText}
        priority={priority}
        className="w-auto h-full object-contain hidden dark:block"
      />
    </div>
  );
}

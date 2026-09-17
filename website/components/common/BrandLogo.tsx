import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  size?: "sm" | "md" | "lg";
  priority?: boolean;
  className?: string;
}

export function BrandLogo({ size = "md", priority = false, className }: BrandLogoProps) {
  const sizeClasses = {
    sm: "h-10 md:h-12",
    md: "h-[52px] md:h-[65px]",
    lg: "h-[60px] md:h-[80px]",
  };

  const altText = "Musharraf Aziz — AI Engineer, Full-Stack Developer & Enterprise AI Solutions";

  return (
    <div className={cn("relative flex items-center", sizeClasses[size], className)}>
      <Image
        src="/images/maklight.webp"
        alt={altText}
        width={320}
        height={80}
        priority={priority}
        className="h-full w-auto object-contain dark:hidden"
      />
      <Image
        src="/images/makdark.webp"
        alt={altText}
        width={320}
        height={80}
        priority={priority}
        className="hidden h-full w-auto object-contain dark:block"
      />
    </div>
  );
}

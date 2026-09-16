"use client";

import Image from "next/image";
import { resolveServiceImage } from "@/lib/service-media";
import { cn } from "@/lib/utils";

type ServiceMediaProps = {
  slug: string;
  kind: "hero" | "tech";
  alt: string;
  className?: string;
};

export function ServiceMedia({ slug, kind, alt, className }: ServiceMediaProps) {
  const src = resolveServiceImage(slug, kind);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl border border-border-default bg-base shadow-lg",
        "aspect-[16/10] min-h-[200px] sm:min-h-[240px] lg:min-h-[320px]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 48vw"
        className="object-contain object-center p-2 sm:p-3"
        priority={kind === "hero"}
      />
    </div>
  );
}

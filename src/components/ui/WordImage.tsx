"use client";

import { cn } from "@/lib/utils";

const SIZES = {
  sm: "size-9 text-[19px] rounded-xl",
  md: "size-12 text-[25px] rounded-2xl",
  lg: "size-16 text-[34px] rounded-2xl",
  xl: "size-24 text-[52px] rounded-3xl",
};

/**
 * Lug'at yozuvining rasmi (emoji).
 * Offline ishlaydi va hech qanday tarmoq so'rovi talab qilmaydi.
 */
export function WordImage({
  emoji,
  alt,
  size = "md",
  className,
}: {
  emoji: string;
  /** Ekran o'quvchilar uchun izoh (odatda o'zbekcha ma'nosi) */
  alt?: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={alt || "rasm"}
      className={cn(
        "grid shrink-0 place-items-center border border-line",
        "bg-gradient-to-br from-purple/10 via-panel2 to-cyan/10",
        "leading-none select-none",
        SIZES[size],
        className,
      )}
    >
      {emoji}
    </span>
  );
}

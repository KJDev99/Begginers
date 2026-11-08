"use client";

import { Volume2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { speak } from "@/lib/speech";
import { cn } from "@/lib/utils";

type Props = {
  /** O'qilishi kerak bo'lgan koreyscha matn */
  text: string;
  className?: string;
  size?: "sm" | "md";
  label?: string;
};

/** Koreyscha matnni ovoz chiqarib o'qish tugmasi. */
export function AudioButton({ text, className, size = "md", label }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <button
      type="button"
      aria-label={label ?? `Tinglash: ${text}`}
      title="Tinglash"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        if (!speak(text)) {
          toast.error("Brauzer ovozni qo‘llamaydi");
          return;
        }
        setPlaying(true);
        window.setTimeout(() => setPlaying(false), 900);
      }}
      className={cn(
        "inline-grid shrink-0 place-items-center rounded-full border border-line",
        "bg-panel2 text-cyan transition-all duration-150",
        "hover:border-cyan hover:bg-cyan/10 active:scale-90",
        size === "sm" ? "size-7" : "size-9",
        playing && "border-cyan bg-cyan/15 scale-105",
        className,
      )}
    >
      <Volume2
        className={cn(size === "sm" ? "size-3.5" : "size-4", playing && "animate-pulse")}
        strokeWidth={2.2}
      />
    </button>
  );
}

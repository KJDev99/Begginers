"use client";

import { cn } from "@/lib/utils";

type ChipProps = {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  /** O'ngdagi hisoblagich */
  count?: number;
  className?: string;
};

export function Chip({
  active,
  onClick,
  children,
  count,
  className,
}: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5",
        "text-[13px] font-semibold whitespace-nowrap transition-all duration-150",
        active
          ? "border-cyan/60 bg-cyan/15 text-cyan"
          : "border-line bg-panel2 text-muted hover:border-cyan/40 hover:text-text",
        className,
      )}
    >
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "rounded-full px-1.5 py-px text-[10px] font-bold tabular-nums",
            active ? "bg-cyan/20 text-cyan" : "bg-hover text-muted",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export function ChipRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}

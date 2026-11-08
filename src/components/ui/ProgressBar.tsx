import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  className,
  barClassName,
  label,
}: {
  /** 0–100 */
  value: number;
  className?: string;
  barClassName?: string;
  label?: string;
}) {
  const safe = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(safe)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-line",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-purple to-cyan",
          "transition-[width] duration-500 ease-out",
          barClassName,
        )}
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}

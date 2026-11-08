import { cn } from "@/lib/utils";

export function SectionHead({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-[22px] leading-tight font-extrabold tracking-tight sm:text-[26px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-muted sm:text-[15px]">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex flex-wrap gap-2">{action}</div>}
    </div>
  );
}

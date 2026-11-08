import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return <div className={cn("skeleton", className)} style={style} />;
}

/** Bo'lim sarlavhasi uchun skeleton. */
export function SectionHeadSkeleton() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-2.5">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <Skeleton className="h-10 w-40 rounded-xl" />
    </div>
  );
}

/** Filtr tugmalari qatori uchun skeleton. */
export function ChipsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="mb-5 flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>
  );
}

/** Kartochkalar to'ri uchun skeleton. */
export function CardGridSkeleton({
  count = 8,
  className = "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4",
  itemClassName = "h-32 rounded-2xl",
}: {
  count?: number;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className={itemClassName}
          style={{ animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

/** Ro'yxat qatorlari uchun skeleton. */
export function ListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-[72px] rounded-2xl"
          style={{ animationDelay: `${i * 45}ms` }}
        />
      ))}
    </div>
  );
}

/** Statistika kartochkalari uchun skeleton. */
export function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-28 rounded-2xl"
          style={{ animationDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}

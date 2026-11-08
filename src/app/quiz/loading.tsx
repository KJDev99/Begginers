import { SectionHeadSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <Skeleton className="mb-6 h-[70px] rounded-2xl" />
      <div className="mx-auto max-w-2xl space-y-4 rounded-3xl border border-line bg-panel p-6 sm:p-8">
        <Skeleton className="h-1.5 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mx-auto h-10 w-2/3" />
        <div className="space-y-2.5 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-14 rounded-2xl"
              style={{ animationDelay: `${i * 70}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

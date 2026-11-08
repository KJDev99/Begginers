import { SectionHeadSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function AddContentLoading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <div className="mx-auto max-w-2xl">
        <div className="mb-5 grid grid-cols-3 gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[66px] rounded-xl" />
          ))}
        </div>
        <Skeleton className="mb-5 h-[62px] rounded-2xl" />
        <div className="space-y-4 rounded-2xl border border-line bg-panel p-5 sm:p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-11 rounded-xl" />
            </div>
          ))}
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

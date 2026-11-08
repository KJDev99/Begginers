import { SectionHeadSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl">
      <Skeleton className="mb-4 h-9 w-28 rounded-xl" />
      <SectionHeadSkeleton />
      <Skeleton className="mb-6 h-[86px] rounded-2xl" />
      <Skeleton className="h-[300px] rounded-3xl" />
    </div>
  );
}

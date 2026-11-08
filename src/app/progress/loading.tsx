import {
  CardGridSkeleton,
  SectionHeadSkeleton,
  Skeleton,
  StatsSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-[150px] rounded-2xl sm:col-span-2" />
        <Skeleton className="h-[150px] rounded-2xl" />
      </div>
      <StatsSkeleton />
      <Skeleton className="mb-8 h-56 rounded-2xl" />
      <Skeleton className="mb-4 h-4 w-32" />
      <CardGridSkeleton
        count={8}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        itemClassName="h-28 rounded-2xl"
      />
    </div>
  );
}

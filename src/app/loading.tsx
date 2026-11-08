import {
  CardGridSkeleton,
  SectionHeadSkeleton,
  Skeleton,
  StatsSkeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="space-y-9">
      <Skeleton className="h-[320px] rounded-3xl sm:h-[300px]" />
      <StatsSkeleton />
      <div>
        <SectionHeadSkeleton />
        <CardGridSkeleton
          count={3}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          itemClassName="h-56 rounded-3xl"
        />
      </div>
    </div>
  );
}

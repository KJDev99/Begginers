import {
  CardGridSkeleton,
  ChipsSkeleton,
  SectionHeadSkeleton,
  Skeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <ChipsSkeleton />
      <Skeleton className="mb-5 h-12 rounded-2xl" />
      <Skeleton className="mb-6 h-[86px] rounded-[40px]" />
      <Skeleton className="mb-4 h-5 w-64" />
      <CardGridSkeleton
        count={12}
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
        itemClassName="h-12 rounded-xl"
      />
    </div>
  );
}

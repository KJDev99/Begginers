import {
  ChipsSkeleton,
  ListSkeleton,
  SectionHeadSkeleton,
  Skeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <ChipsSkeleton />
      <ChipsSkeleton count={7} />
      <Skeleton className="mb-5 h-12 rounded-2xl" />
      <ListSkeleton />
    </div>
  );
}

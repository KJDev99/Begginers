import {
  CardGridSkeleton,
  SectionHeadSkeleton,
  Skeleton,
} from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <Skeleton className="mb-8 h-24 rounded-2xl" />
      <div className="space-y-8">
        {[14, 5, 10, 11].map((n, i) => (
          <div key={i}>
            <Skeleton className="mb-4 h-4 w-44" />
            <CardGridSkeleton
              count={n}
              className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7"
              itemClassName="h-[118px] rounded-2xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

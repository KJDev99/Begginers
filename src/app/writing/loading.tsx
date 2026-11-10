import { SectionHeadSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div>
      <SectionHeadSkeleton />
      <Skeleton className="mb-6 h-24 rounded-2xl" />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Skeleton className="order-2 h-72 rounded-2xl lg:order-1" />
        <Skeleton className="order-1 h-[520px] rounded-3xl lg:order-2" />
      </div>
    </div>
  );
}

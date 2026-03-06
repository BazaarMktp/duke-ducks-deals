import { Skeleton } from "@/components/ui/skeleton";

interface MarketplaceItemSkeletonProps {
  count?: number;
}

const SingleSkeleton = () => (
  <div className="bg-card rounded-xl overflow-hidden border border-border/40">
    <div className="aspect-square relative overflow-hidden">
      <Skeleton className="w-full h-full absolute inset-0" />
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
    </div>
    <div className="p-3 space-y-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

const MarketplaceItemSkeleton = ({ count = 8 }: MarketplaceItemSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
};

export default MarketplaceItemSkeleton;

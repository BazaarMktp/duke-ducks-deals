
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MarketplaceItemSkeletonProps {
  count?: number;
}

const SingleSkeleton = () => (
  <Card className="overflow-hidden">
    <CardContent className="p-0 h-full flex flex-col">
      {/* Image skeleton with shimmer */}
      <div className="h-40 sm:h-56 relative overflow-hidden bg-muted">
        <Skeleton className="w-full h-full absolute inset-0" />
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-muted-foreground/10 to-transparent" />
      </div>
      
      <div className="p-2 sm:p-4 flex-1 flex flex-col">
        {/* Badge skeleton */}
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-5 w-12" />
        </div>
        
        {/* Title skeleton */}
        <Skeleton className="h-5 w-3/4 mb-2" />
        
        {/* Seller skeleton */}
        <Skeleton className="h-4 w-1/2 mb-3" />
        
        {/* Description skeleton */}
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-3" />
        
        {/* Price and badge row */}
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        {/* Action buttons skeleton */}
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-9 w-9" />
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const MarketplaceItemSkeleton = ({ count = 8 }: MarketplaceItemSkeletonProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SingleSkeleton key={index} />
      ))}
    </div>
  );
};

export default MarketplaceItemSkeleton;

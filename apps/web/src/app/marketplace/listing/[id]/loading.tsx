import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function ListingDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-32" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      <LoadingSpinner text="Loading listing details..." />
    </div>
  );
}

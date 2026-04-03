import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/shared/loading-spinner";

export default function DashboardDetailLoading() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>

      <LoadingSpinner text="Loading dashboard..." />

      <Skeleton className="h-full min-h-[60vh] w-full rounded-xl" />
    </div>
  );
}

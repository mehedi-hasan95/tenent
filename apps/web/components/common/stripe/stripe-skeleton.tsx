import { Skeleton } from "@workspace/ui/components/skeleton"

export const StripeSkeleton = () => {
  return (
    <div className="w-full rounded-2xl border bg-background p-5 shadow-sm">
      <Skeleton className="mb-6 h-6 w-40" />
      <Skeleton className="mb-3 h-5 w-20" />
      <div className="mb-3 flex items-center rounded-lg border p-4">
        <Skeleton className="mr-4 h-5 w-5 rounded-sm" />
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="mb-3 flex items-center justify-between rounded-lg border p-4">
        <div className="flex items-center">
          <Skeleton className="mr-4 h-5 w-5 rounded-sm" />
          <Skeleton className="h-5 w-28" />
        </div>

        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="mb-5 flex items-start rounded-lg border p-4">
        <Skeleton className="mr-4 h-6 w-6 rounded" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-28" />
        </div>
      </div>

      {/* Footer */}
      <Skeleton className="h-5 w-36" />
    </div>
  )
}

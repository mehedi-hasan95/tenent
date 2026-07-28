"use client"
import { useInterceptionObserver } from "@/hooks/infinity-scroll/use-infinity-scroll-observer"
import { Button } from "@workspace/ui/components/button"
import { useEffect } from "react"

interface InfinityScrollProps {
  isManual?: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
  finishText?: string
}
export const InfinityScroll = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isManual = false,
  finishText = "All product are loaded",
}: InfinityScrollProps) => {
  const { targetRef, isIntersecting } = useInterceptionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  })
  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isIntersecting, isManual])
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        <div ref={targetRef} className="h-1" />
        {hasNextPage ? (
          <Button
            variant={"secondary"}
            disabled={!hasNextPage || isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        ) : (
          <p>{finishText}</p>
        )}
      </div>
    </div>
  )
}

// interface InfinityScrollProps {
//   isManual?: boolean
//   hasNextPage: boolean
//   isFetchingNextPage: boolean
//   fetchNextPage: () => void
//   finishText?: string
// }

// export const InfinityScroll = ({
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage,
//   isManual = false,
//   finishText = "All product are loaded",
// }: InfinityScrollProps) => {
//   const { targetRef, isIntersecting } = useInterceptionObserver(0.5, "100px")
//   const isFetchingRef = useRef(false)

//   const handleFetchNext = () => {
//     if (isFetchingRef.current || !hasNextPage) return
//     isFetchingRef.current = true
//     fetchNextPage()
//   }

//   useEffect(() => {
//     if (isIntersecting && hasNextPage && !isFetchingNextPage && !isManual) {
//       handleFetchNext()
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [hasNextPage, isFetchingNextPage, isIntersecting, isManual])

//   useEffect(() => {
//     if (!isFetchingNextPage) {
//       isFetchingRef.current = false
//     }
//   }, [isFetchingNextPage])

//   return (
//     <div>
//       <div className="flex flex-col items-center justify-center gap-4 p-4">
//         <div ref={targetRef} className="h-1" />
//         {hasNextPage ? (
//           <Button
//             variant={"secondary"}
//             disabled={!hasNextPage || isFetchingNextPage}
//             onClick={handleFetchNext}
//           >
//             {isFetchingNextPage ? "Loading..." : "Load More"}
//           </Button>
//         ) : (
//           <p>{finishText}</p>
//         )}
//       </div>
//     </div>
//   )
// }

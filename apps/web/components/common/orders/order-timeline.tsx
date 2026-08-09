import { ORDER_STATUS_TYPE } from "@workspace/validators/types/orders.types"

interface TimelineStep {
  status: ORDER_STATUS_TYPE
  label: string
  icon: string
}

const TIMELINE_STEPS: TimelineStep[] = [
  { status: "PROCESSING", label: "Processing", icon: "⏳" },
  { status: "SHIPPED", label: "Shipped", icon: "🚚" },
  { status: "DELIVERED", label: "Delivered", icon: "✓" },
]

interface OrderTimelineProps {
  currentStatus: ORDER_STATUS_TYPE
}

export function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  // Cancelled and refunded orders don't follow the normal timeline
  if (currentStatus === "CANCELLED" || currentStatus === "REFUNDED") {
    return (
      <div className="py-4">
        <div className="text-center">
          <div className="mb-2 text-2xl">
            {currentStatus === "CANCELLED" ? "❌" : "↩"}
          </div>
          <p className="text-lg font-semibold">
            {currentStatus === "CANCELLED"
              ? "Order Cancelled"
              : "Order Refunded"}
          </p>
        </div>
      </div>
    )
  }

  const currentStatusIndex = TIMELINE_STEPS.findIndex(
    (step) => step.status === currentStatus
  )

  return (
    <div className="py-6">
      <div className="relative flex items-center justify-between">
        {/* Connecting bars */}
        {TIMELINE_STEPS.map((_, index) => {
          if (index === TIMELINE_STEPS.length - 1) return null

          const isCompleted = index < currentStatusIndex

          return (
            <div
              key={`bar-${index}`}
              className={`absolute top-6 mx-5 h-1 ${
                isCompleted ? "bg-green-500" : "bg-gray-200"
              }`}
              style={{
                left: `${index * (100 / (TIMELINE_STEPS.length - 1))}%`,
                right: `${(1 - (index + 1) / (TIMELINE_STEPS.length - 1)) * 100}%`,
              }}
            />
          )
        })}

        {/* Timeline items */}
        {TIMELINE_STEPS.map((step, index) => (
          <div
            key={step.status}
            className="relative z-10 flex flex-col items-center"
          >
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${
                index <= currentStatusIndex
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.icon}
            </div>
            <p
              className={`mt-2 text-sm font-medium ${
                index <= currentStatusIndex ? "text-green-600" : "text-gray-500"
              }`}
            >
              {step.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

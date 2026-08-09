"use client"

import { useGetSession } from "@/hooks/auth/use-auth"
import { getGreeting } from "@/lib/lib"
import { cn } from "@workspace/ui/lib/utils"

interface Props {
  className?: string
}
export const GreetingMessage = ({ className }: Props) => {
  const { user } = useGetSession()
  return (
    <h2 className={cn("text-xl", className)}>
      {getGreeting()}, {user?.name}
    </h2>
  )
}

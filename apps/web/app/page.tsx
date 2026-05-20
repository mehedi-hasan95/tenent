"use client"
import { getSessionAction } from "@/api/auth/auth-server-action"
import { NavBar } from "@/components/common/navbar"
import { useQuery } from "@tanstack/react-query"

export default function Page() {
  const { data } = useQuery({
    queryKey: ["session"],
    queryFn: getSessionAction,
  })
  return (
    <div className="relative flex min-h-svh flex-col px-6">
      <NavBar />
      {JSON.stringify(data, null, 2)}
    </div>
  )
}

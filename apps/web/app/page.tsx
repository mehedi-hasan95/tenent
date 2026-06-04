"use client"
import { NavBar } from "@/components/common/nav/navbar"
import { useGetSession } from "@/hooks/auth/use-auth"

export default function Page() {
  const { user } = useGetSession()
  return (
    <div className="relative flex min-h-svh flex-col px-6">
      <NavBar />
      {JSON.stringify(user, null, 2)}
    </div>
  )
}

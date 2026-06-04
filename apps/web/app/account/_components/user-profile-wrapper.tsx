"use client"

import { UserProfilePreview } from "./user-profile-preview"
import { UpdateUserTabs } from "./update-user-tabs"
import { useGetSession } from "@/hooks/auth/use-auth"
import { redirect } from "next/navigation"
import { useIsProfileEditableStore } from "@/store/useVerifyPasswordModalStore"

export const UserProfileWrapper = () => {
  const { isOpen } = useIsProfileEditableStore()
  const { user } = useGetSession()
  if (!user) {
    redirect("/")
  }
  return (
    <div className="w-full px-4 py-6">
      {isOpen ? <UpdateUserTabs /> : <UserProfilePreview />}
    </div>
  )
}

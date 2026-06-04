import { Logo } from "@/components/common/logo"
import { UserProfileWrapper } from "./_components/user-profile-wrapper"

const Page = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4">
      <Logo className="rounded-2xl border p-5 hover:bg-accent" />
      <UserProfileWrapper />
    </div>
  )
}

export default Page

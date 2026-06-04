import { Logo } from "@/components/common/logo"
import { ForgotPasswordForm } from "./_components/forgot-password-form"

const Page = async () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-10">
      <Logo className="rounded-2xl border p-5 hover:bg-accent" />
      <ForgotPasswordForm />
    </div>
  )
}

export default Page

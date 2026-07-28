import { Footer } from "@/components/common/footer"
import { NavBar } from "@/components/common/nav/navbar"
import { Separator } from "@workspace/ui/components/separator"

interface Props {
  children: React.ReactNode
}
const Page = async ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col justify-between space-y-5">
      <div>
        <NavBar className="p-5" />
        <Separator />
      </div>
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  )
}

export default Page

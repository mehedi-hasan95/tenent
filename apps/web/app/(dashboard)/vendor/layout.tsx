import { DynamicBreadcrumbs } from "@/components/common/dynamic-breadcrumbs"
import { Separator } from "@workspace/ui/components/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { VendorSidebar } from "./_components/vendor-sidebar"
import { getQueryClient } from "@/lib/lib"
import { getCategoriesAction } from "@/api/categories/categories-action"

interface Props {
  children: React.ReactNode
}
const Page = async ({ children }: Props) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["categories", "true"],
    queryFn: () => getCategoriesAction("true"),
  })
  return (
    <SidebarProvider>
      <VendorSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <DynamicBreadcrumbs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page

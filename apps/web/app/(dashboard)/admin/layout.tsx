import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@workspace/ui/components/sidebar"
import { AdminSidebar } from "./_components/admin-sidebar"
import { Separator } from "@workspace/ui/components/separator"
import { DynamicBreadcrumbs } from "@/components/common/dynamic-breadcrumbs"
import { getQueryClient } from "@/lib/lib"
import { getCategoriesAction } from "@/api/categories/categories-action"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { getSubCategoriesAction } from "@/api/categories/subcategories-action"

interface Props {
  children: React.ReactNode
}
const Page = async ({ children }: Props) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["categories"],
    queryFn: getCategoriesAction,
  })
  await queryClient.prefetchQuery({
    queryKey: ["sub-categories", "true"],
    queryFn: () => getSubCategoriesAction("true"),
  })
  return (
    <SidebarProvider>
      <AdminSidebar />
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <HydrationBoundary state={dehydrate(queryClient)}>
            {children}
          </HydrationBoundary>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default Page

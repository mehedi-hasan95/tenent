"use client"
import { SidebarLogo } from "@/app/(dashboard)/_components/sidebar-logo"
import { SidebarNav } from "@/app/(dashboard)/_components/sidebar-nav"
import { SidebarNavUser } from "@/app/(dashboard)/_components/sidebar-nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { USER_OVERVIEW } from "./user-sidebar-menus"

export const UserSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav title="OVERVIEW" data={USER_OVERVIEW} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

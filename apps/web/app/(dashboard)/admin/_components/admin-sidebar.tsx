"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@workspace/ui/components/sidebar"
import { SidebarLogo } from "../../_components/sidebar-logo"
import { SidebarNav } from "../../_components/sidebar-nav"
import { SidebarNavUser } from "../../_components/sidebar-nav-user"
import {
  ADMIN_ACT,
  ADMIN_COMMERCE,
  ADMIN_OVERVIEW,
} from "./admin-sidebar-menus"

export const AdminSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav title="OVERVIEW" data={ADMIN_OVERVIEW} />
        <SidebarNav title="Categories" data={ADMIN_ACT} />
        <SidebarNav title="COMMERCE" data={ADMIN_COMMERCE} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

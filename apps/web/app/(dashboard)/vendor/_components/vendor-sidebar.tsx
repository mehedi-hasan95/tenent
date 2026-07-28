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
  VENDOR_ACT,
  VENDOR_COMMERCE,
  VENDOR_OVERVIEW,
} from "./vendor-sidebar-menus"

export const VendorSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav title="OVERVIEW" data={VENDOR_OVERVIEW} />
        <SidebarNav title="Products" data={VENDOR_ACT} />
        <SidebarNav title="COMMERCE" data={VENDOR_COMMERCE} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarNavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

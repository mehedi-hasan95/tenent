"use client"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"

export const SidebarLogo = () => {
  return (
    <Link href="/">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <span className="text-lg font-bold text-white md:text-xl">T</span>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Tenant</span>
              <span className="truncate text-xs">Multi-Tenant</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </Link>
  )
}

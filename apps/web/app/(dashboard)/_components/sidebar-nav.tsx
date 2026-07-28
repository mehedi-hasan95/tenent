"use client"

import { LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleTrigger,
} from "@workspace/ui/components/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@workspace/ui/lib/utils"
import { IconType } from "react-icons"

interface Props {
  title?: string
  data: { name: string; slug: string; icon?: LucideIcon | IconType }[]
}
export const SidebarNav = ({ data, title }: Props) => {
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible asChild className="group/collapsible">
          <SidebarMenuItem>
            {data.map((item, i) => (
              <CollapsibleTrigger asChild key={i}>
                <Link href={item.slug}>
                  <SidebarMenuButton
                    tooltip={item.name}
                    isActive={pathname === item.slug}
                    className={cn(
                      "cursor-pointer",
                      pathname === item.slug &&
                        "rounded-l-none border-l-4 border-blue-500 dark:bg-blue-900/50! dark:text-white!"
                    )}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </SidebarMenuButton>
                </Link>
              </CollapsibleTrigger>
            ))}
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}

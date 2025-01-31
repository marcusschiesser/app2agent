"use client";

import { NavUser } from "@/app/(auth)/components/NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Download, Headset, Settings2, PlugIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Logo from "../../../components/Logo";

const sidebarGroups = [
  {
    label: "Apps",
    items: [
      {
        name: "Settings",
        url: "/admin/settings",
        icon: Settings2,
      },
    ],
  },
  {
    label: "Integration",
    items: [
      {
        name: "Javascript Plugin",
        url: "/admin/integration/script",
        icon: PlugIcon,
      },
      {
        name: "Browser Extension",
        url: "/admin/integration/extension",
        icon: Download,
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarHeader />
      <SidebarContent>
        {sidebarGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function AppSidebarHeader() {
  const { open } = useSidebar();
  return (
    <SidebarHeader>
      <Link href="/">
        {open ? <Logo /> : <Headset className="text-blue-900 mx-auto" />}
      </Link>
    </SidebarHeader>
  );
}

"use client";

import { NavUser } from "@/components/NavUser";
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
import { Headset, Settings2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import Logo from "./Logo";

const sidebarItems = [
	{
		name: "Settings",
		url: "/admin/settings",
		icon: Settings2,
	},
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const pathname = usePathname();
	return (
		<Sidebar collapsible="icon" {...props}>
			<AppSidebarHeader />
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarMenu>
						{sidebarItems.map((item) => (
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
			<Link href="/">{open ? <Logo /> : <Headset className="text-blue-900 mx-auto" />}</Link>
		</SidebarHeader>
	);
}

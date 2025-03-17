"use client";

import * as React from "react";
import { Bot, GalleryVerticalEnd, SquareTerminal } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

// This is sample data.
const data = {
  teams: [
    {
      name: "Dubai Used Furniture Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "blogs",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "create new",
          url: "/dashboard/create-new",
        },
        {
          title: "view all",
          url: "/dashboard/list-blog",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "add new",
          url: "/dashboard/category/create-new",
        },
        {
          title: "list all",
          url: "/dashboard/category",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession({ required: true });
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {status === "loading" ? (
          <p>Loading...</p>
        ) : session?.user ? (
          <NavUser
            user={{
              name: session.user.name || "Unknown",
              email: session.user.email || "No email",
              avatar: session.user.image || "/next.svg",
            }}
          />
        ) : (
          <p>No user found</p>
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

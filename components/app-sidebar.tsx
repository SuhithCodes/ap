"use client"

import * as React from "react"
import {
  BarChart3,
  BookOpen,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  School,
  Send,
  Settings2,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Sarah Chen",
    email: "sarah.chen@district.edu",
    avatar: "/avatars/sarah.jpg",
  },
  navMain: [
    {
      title: "Analytics",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: "Graduation Rates",
          url: "/dashboard",
        },
        {
          title: "Attendance",
          url: "#",
        },
        {
          title: "FAFSA Completion",
          url: "#",
        },
        {
          title: "Assessment Scores",
          url: "#",
        },
      ],
    },
    {
      title: "AI Assistant",
      url: "#",
      icon: Sparkles,
      items: [
        {
          title: "New Conversation",
          url: "/dashboard",
        },
        {
          title: "History",
          url: "#",
        },
        {
          title: "Saved Insights",
          url: "#",
        },
      ],
    },
    {
      title: "Reports",
      url: "#",
      icon: BarChart3,
      items: [
        {
          title: "Annual Summary",
          url: "#",
        },
        {
          title: "Trend Analysis",
          url: "#",
        },
        {
          title: "Comparative Reports",
          url: "#",
        },
        {
          title: "Export Center",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Data Sources",
          url: "#",
        },
        {
          title: "Notifications",
          url: "#",
        },
        {
          title: "Team Access",
          url: "#",
        },
        {
          title: "Preferences",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "High Schools",
      url: "#",
      icon: School,
    },
    {
      name: "Middle Schools",
      url: "#",
      icon: School,
    },
    {
      name: "District Overview",
      url: "#",
      icon: TrendingUp,
    },
    {
      name: "Demographics",
      url: "#",
      icon: Users,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 dark:bg-slate-100">
                  <GraduationCap className="size-4 text-white dark:text-slate-900" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EduInsight</span>
                  <span className="truncate text-xs text-muted-foreground">
                    AI-Powered Analytics
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

'use client'
import { BarChart3, Calendar, ClipboardList, CreditCard, DollarSign, FileText, Shield, TrendingUp, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Menu items.
const navigation = [
  { name: 'RCM Dashboard', href: '/', icon: BarChart3 },
  { name: 'Patient Registration', href: '/patients', icon: Users },
  { name: 'Insurance Management', href: '/insurance', icon: Shield },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'CPT/ICD Codes', href: '/codes', icon: FileText },
  { name: 'Claims', href: '/claims', icon: ClipboardList },
  { name: 'ERA Viewer', href: '/era', icon: DollarSign },
  { name: 'Payment Posting', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: TrendingUp },
];

export function AppSidebar() {
  const path = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-background/70 relative">
        <SidebarHeader className="p-4 border-b border-border h-[70px]">
          
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent className="px-3">
            <SidebarMenu className="space-y-1">
              {navigation.map((item) => (
                <SidebarMenuItem className="hover:scale-[101%] transition-all duration-75" key={item.name}>
                  <SidebarMenuButton asChild tooltip={item.name}>
                    <a href={item.href} className={` ${path === item.href ? 'text-muted-foreground rounded-none bg-sidebar-accent/40' : 'text-chart-3'} group flex items-center rounded-none`}>
                      <item.icon/>
                      <span>{item.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
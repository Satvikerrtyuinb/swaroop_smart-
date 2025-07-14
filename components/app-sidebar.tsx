"use client"

import { BarChart3, Lightbulb, MapPin, Upload, Database, TrendingUp, Smartphone } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { useLanguage } from "@/components/language-provider"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
    description: "Overview & Analytics",
  },
  {
    title: "Insights",
    url: "/insights",
    icon: Lightbulb,
    description: "Category Analysis",
  },
  {
    title: "Hub Network",
    url: "/map",
    icon: MapPin,
    description: "Processing Centers",
  },
  {
    title: "Advanced Analytics",
    url: "/advanced-analytics",
    icon: TrendingUp,
    description: "Business Intelligence",
  },
  {
    title: "Data Management",
    url: "/upload",
    icon: Upload,
    description: "Import & Export",
  },
  {
    title: "Data Explorer",
    url: "/data-explorer",
    icon: Database,
    description: "Browse Data",
  },
  {
    title: "Worker Interface",
    url: "/worker",
    icon: Smartphone,
    description: "Mobile Processing",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-lg">
            <Image
              src="/images/smartreturns-logo.png"
              alt="SmartReturns Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              SmartReturns
            </h2>
            <p className="text-xs text-gray-500">Sustainability Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 font-medium px-2 py-2">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link
                      href={item.url}
                      className={`flex flex-col items-start gap-1 px-3 py-3 rounded-lg transition-all duration-200 ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border border-green-200 shadow-sm"
                          : "hover:bg-gray-50 text-gray-700 hover:text-green-600 hover:shadow-sm"
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <span className="text-xs text-gray-500 ml-7">{item.description}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        <div className="relative overflow-hidden text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="absolute inset-0 opacity-10">
            <Image src="/images/circular-economy.png" alt="Circular Economy" fill className="object-cover" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-700">ESG Impact</p>
            <p className="text-xs text-gray-500">Building Circular Economy</p>
            <p className="text-xs text-green-600 font-medium mt-1">Zero Waste by 2030</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

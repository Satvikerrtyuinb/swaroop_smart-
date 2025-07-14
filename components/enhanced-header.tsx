"use client"

import { useState } from "react"
import { Search, Bell, User, Globe, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function EnhancedHeader() {
  const { language, setLanguage } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">SmartReturns</h1>
          <p className="text-xs text-gray-500">Sustainability Platform</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search returns, products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "EN" : "हिं"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setLanguage("en")}>🇺🇸 English</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage("hi")}>🇮🇳 हिंदी</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">3</Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80">
            <div className="p-3 space-y-2">
              <div className="p-2 bg-green-50 rounded border border-green-200">
                <p className="font-medium text-green-800 text-sm">High-value return processed</p>
                <p className="text-xs text-green-600">₹35,000 Samsung TV - Mumbai Hub</p>
              </div>
              <div className="p-2 bg-blue-50 rounded border border-blue-200">
                <p className="font-medium text-blue-800 text-sm">AI recommendation ready</p>
                <p className="text-xs text-blue-600">Batch processing optimization available</p>
              </div>
              <div className="p-2 bg-orange-50 rounded border border-orange-200">
                <p className="font-medium text-orange-800 text-sm">Sustainability milestone</p>
                <p className="text-xs text-orange-600">1000kg CO₂ saved this week!</p>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <div className="p-3 border-b">
              <p className="font-medium">Rajesh Kumar</p>
              <p className="text-sm text-gray-500">Operations Manager</p>
            </div>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

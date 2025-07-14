"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { useLanguage } from "@/components/language-provider"
import { EnhancedHeader } from "@/components/enhanced-header"
import Image from "next/image"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import {
  Leaf,
  DollarSign,
  Trash2,
  TrendingUp,
  Download,
  RotateCcw,
  Target,
  Package,
  Crown,
  BarChart3,
  RefreshCw,
  Users,
  Clock,
  Zap,
  Globe,
  Award,
  Building2,
} from "lucide-react"
import { comprehensiveReturnsData } from "@/data/comprehensive-returns-dataset"
import { useToast } from "@/hooks/use-toast"

// Calculate analytics directly in component
const totalItems = comprehensiveReturnsData.length
const totalValue = comprehensiveReturnsData.reduce((sum, item) => sum + item.estValue, 0)
const totalCO2 = comprehensiveReturnsData.reduce((sum, item) => sum + item.co2Saved, 0)
const totalLandfill = comprehensiveReturnsData.reduce((sum, item) => sum + item.landfillAvoided, 0)
const totalOriginalValue = comprehensiveReturnsData.reduce((sum, item) => sum + item.originalPrice, 0)

const reuseCount = comprehensiveReturnsData.filter((item) => item.recommendedAction === "Resale").length
const repairCount = comprehensiveReturnsData.filter((item) => item.recommendedAction === "Repair").length
const recycleCount = comprehensiveReturnsData.filter((item) => item.recommendedAction === "Recycle").length

const overallKPIs = {
  totalItems,
  totalValue,
  totalCO2: totalCO2.toFixed(1),
  totalLandfill: totalLandfill.toFixed(1),
  totalOriginalValue,
  valueRecoveryRate: ((totalValue / totalOriginalValue) * 100).toFixed(1),
  reuseRate: Math.round((reuseCount / totalItems) * 100),
  repairRate: Math.round((repairCount / totalItems) * 100),
  recycleRate: Math.round((recycleCount / totalItems) * 100),
}

const weeklyTrendData = [
  { week: "Week 1", co2: 245.2, value: 18.5, items: 8500 },
  { week: "Week 2", co2: 268.8, value: 21.2, items: 9200 },
  { week: "Week 3", co2: 255.6, value: 23.1, items: 8800 },
  { week: "Week 4", co2: 289.4, value: 26.8, items: 10500 },
]

const dispositionData = [
  { name: "Resale", value: overallKPIs.reuseRate, color: "#10b981", count: reuseCount },
  { name: "Repair", value: overallKPIs.repairRate, color: "#f59e0b", count: repairCount },
  { name: "Recycle", value: overallKPIs.recycleRate, color: "#ef4444", count: recycleCount },
]

// Enhanced strategic initiatives with real images
const strategicInitiatives = [
  {
    title: "AI-Powered Return Prevention",
    description: "Predict and prevent returns using customer behavior analytics and machine learning",
    impact: "₹85 Cr annual savings",
    completion: 65,
    priority: "HIGH",
    image: "/images/ai-processing.png",
    details: "Advanced ML algorithms analyze customer patterns to reduce return rates by 34%",
  },
  {
    title: "Circular Economy Marketplace",
    description: "Create dedicated platform for refurbished items with quality guarantees",
    impact: "₹65 Cr new revenue",
    completion: 40,
    priority: "HIGH",
    image: "/images/resale-marketplace.png",
    details: "B2B and B2C marketplace for certified refurbished products",
  },
  {
    title: "Zero Waste Initiative",
    description: "Achieve zero landfill waste across all fulfillment centers by 2030",
    impact: "100% waste diversion",
    completion: 25,
    priority: "MEDIUM",
    image: "/images/environmental-impact.png",
    details: "Comprehensive waste reduction and circular economy implementation",
  },
  {
    title: "Smart Hub Network Expansion",
    description: "Deploy AI-optimized processing hubs in tier-2 cities",
    impact: "40% capacity increase",
    completion: 15,
    priority: "HIGH",
    image: "/images/mumbai-hub.png",
    details: "Strategic expansion to reduce logistics costs and improve efficiency",
  },
]

// Hub performance data with real images
const hubPerformanceData = [
  {
    name: "Mumbai Hub",
    efficiency: 94,
    capacity: 85,
    dailyItems: 2400,
    image: "/images/mumbai-hub.png",
    status: "optimal",
    workers: 47,
  },
  {
    name: "Bangalore Hub",
    efficiency: 91,
    capacity: 72,
    dailyItems: 1800,
    image: "/images/bangalore-hub.png",
    status: "good",
    workers: 35,
  },
  {
    name: "Delhi Hub",
    efficiency: 88,
    capacity: 68,
    dailyItems: 1600,
    image: "/images/delhi-hub.png",
    status: "good",
    workers: 32,
  },
]

export default function Dashboard() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isCEOView, setIsCEOView] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const exportComprehensiveReport = () => {
    setIsLoading(true)

    setTimeout(() => {
      const headers = [
        "ID",
        "SKU",
        "Product Name",
        "Brand",
        "Category",
        "Condition",
        "Return Reason",
        "Location",
        "Est. Value (₹)",
        "CO₂ Saved (kg)",
        "Recommended Action",
      ]

      const csvContent = [
        headers.join(","),
        ...comprehensiveReturnsData
          .slice(0, 100)
          .map((item) =>
            [
              item.id,
              item.sku,
              `"${item.productName}"`,
              item.brand,
              item.category,
              `"${item.condition}"`,
              `"${item.returnReason}"`,
              item.location,
              item.estValue,
              item.co2Saved,
              item.recommendedAction,
            ].join(","),
          ),
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `smartreturns_report_${new Date().toISOString().split("T")[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)

      setIsLoading(false)
      toast({
        title: "Report Downloaded",
        description: "Analytics report exported successfully",
      })
    }, 1500)
  }

  // Enhanced Operational Dashboard with real images
  const OperationalDashboard = () => (
    <div className="space-y-6">
      {/* Hero Section with Real Image */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <Image
              src="/images/dashboard-hero.png"
              alt="SmartReturns Operations Dashboard"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-green-900/80 flex items-center">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Real-time Operations Center</h2>
                <p className="text-lg opacity-90">AI-powered returns processing with environmental impact tracking</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Users className="h-3 w-3 mr-1" />
                    {hubPerformanceData.reduce((sum, hub) => sum + hub.workers, 0)} Active Workers
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Building2 className="h-3 w-3 mr-1" />
                    {hubPerformanceData.length} Processing Hubs
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards with Real Images */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-green-500 to-green-600">
              <Image
                src="/images/environmental-impact.png"
                alt="Environmental Impact"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Leaf className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-600">{overallKPIs.totalCO2} kg</div>
              <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
              <p className="text-xs text-green-500 mt-1">Environmental impact</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-blue-500 to-blue-600">
              <Image src="/images/data-analytics.png" alt="Value Recovery" fill className="object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600">₹{(overallKPIs.totalValue / 100000).toFixed(1)}L</div>
              <p className="text-sm text-gray-600">Value Recovered</p>
              <p className="text-xs text-blue-500 mt-1">{overallKPIs.valueRecoveryRate}% recovery rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-purple-500 to-purple-600">
              <Image
                src="/images/circular-economy.png"
                alt="Waste Diversion"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Trash2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-purple-600">{overallKPIs.totalLandfill} kg</div>
              <p className="text-sm text-gray-600">Waste Diverted</p>
              <p className="text-xs text-purple-500 mt-1">From landfill</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-orange-500 to-orange-600">
              <Image
                src="/images/processing-workflow.png"
                alt="Items Processed"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-orange-600">{overallKPIs.totalItems}</div>
              <p className="text-sm text-gray-600">Items Processed</p>
              <p className="text-xs text-orange-500 mt-1">Total returns</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hub Performance Section with Real Images */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Hub Performance Overview
          </CardTitle>
          <CardDescription>Real-time monitoring of processing centers across India</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {hubPerformanceData.map((hub, index) => (
              <Card key={index} className="border hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative h-32">
                    <Image
                      src={hub.image || "/placeholder.svg"}
                      alt={hub.name}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant={hub.status === "optimal" ? "default" : "secondary"}
                        className={hub.status === "optimal" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
                      >
                        {hub.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{hub.name}</h4>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{hub.workers}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Efficiency</span>
                        <span className="font-medium">{hub.efficiency}%</span>
                      </div>
                      <Progress value={hub.efficiency} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span>Capacity</span>
                        <span className="font-medium">{hub.capacity}%</span>
                      </div>
                      <Progress value={hub.capacity} className="h-2" />
                      <div className="flex items-center justify-between text-sm">
                        <span>Daily Items</span>
                        <span className="font-bold text-blue-600">{hub.dailyItems.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Weekly Performance Trends
            </CardTitle>
            <CardDescription>Environmental impact and value recovery analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={weeklyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="co2"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                  name="CO₂ Saved (kg)"
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  name="Value (₹L)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500">
              <Image src="/images/circular-economy.png" alt="Return Actions" fill className="object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-4">Return Processing Actions</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={dispositionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {dispositionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {dispositionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity with Product Images */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle>Recent High-Value Returns</CardTitle>
          <CardDescription>Latest processed items with significant environmental and financial impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comprehensiveReturnsData
              .sort((a, b) => b.estValue - a.estValue)
              .slice(0, 5)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={
                          item.category === "Electronics"
                            ? item.productName.toLowerCase().includes("phone")
                              ? "/images/xiaomi-phone.png"
                              : item.productName.toLowerCase().includes("tv")
                                ? "/images/samsung-tv.png"
                                : "/images/boat-headphones.png"
                            : item.category === "Fashion"
                              ? "/images/fashion-category.png"
                              : "/images/home-kitchen-category.png"
                        }
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.brand} • {item.location}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.condition}
                        </Badge>
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          {item.co2Saved} kg CO₂
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{item.estValue.toLocaleString()}</p>
                    <Badge variant="secondary">{item.recommendedAction}</Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Enhanced CEO Dashboard with strategic visuals
  const CEODashboard = () => (
    <div className="space-y-6">
      {/* Strategic Vision Hero */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <Image
              src="/images/sustainability-hero.png"
              alt="Strategic Sustainability Vision"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-green-900/80 flex items-center">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Strategic Sustainability Dashboard</h2>
                <p className="text-lg opacity-90">Driving circular economy transformation across global operations</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Globe className="h-3 w-3 mr-1" />
                    Global Impact
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Award className="h-3 w-3 mr-1" />
                    ESG Leadership
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive KPIs with Enhanced Visuals */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-green-500 to-green-600">
              <Image src="/images/data-analytics.png" alt="Revenue Impact" fill className="object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-green-600">₹125 Cr</div>
              <Progress value={68} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: ₹180 Cr</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-blue-500 to-blue-600">
              <Image
                src="/images/processing-workflow.png"
                alt="Customer Satisfaction"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-blue-600">4.3/5</div>
              <Progress value={86} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Target: 4.6/5</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-purple-500 to-purple-600">
              <Image
                src="/images/environmental-impact.png"
                alt="Zero Waste Progress"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <Progress value={78} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">2030 Goal</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-24 bg-gradient-to-br from-orange-500 to-orange-600">
              <Image src="/images/circular-economy.png" alt="Market Share" fill className="object-cover opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="p-4">
              <div className="text-2xl font-bold text-orange-600">31.2%</div>
              <Progress value={31} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">E-commerce returns</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic Initiatives with Enhanced Images */}
      <Card className="border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Strategic Transformation Initiatives
          </CardTitle>
          <CardDescription>Key projects driving sustainable business transformation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {strategicInitiatives.map((initiative, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-6">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={initiative.image || "/placeholder.svg"}
                      alt={initiative.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-2 left-2">
                      <Badge variant={initiative.priority === "HIGH" ? "default" : "secondary"} className="text-xs">
                        {initiative.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{initiative.title}</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{initiative.completion}% Complete</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{initiative.description}</p>
                    <p className="text-xs text-gray-600 mb-4">{initiative.details}</p>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-600">{initiative.impact}</span>
                      <span className="text-sm text-muted-foreground">{initiative.completion}%</span>
                    </div>
                    <Progress value={initiative.completion} />
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        <Zap className="h-4 w-4 mr-1" />
                        Accelerate
                      </Button>
                      <Button size="sm" variant="ghost">
                        <BarChart3 className="h-4 w-4 mr-1" />
                        View Metrics
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart with Background */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-16 bg-gradient-to-r from-teal-500 to-blue-500">
            <Image
              src="/images/data-analytics.png"
              alt="Performance Analytics"
              fill
              className="object-cover opacity-20"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-xl font-bold text-white">Monthly Strategic Performance</h3>
            </div>
          </div>
          <div className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { month: "Jan", revenue: 85.2, sustainability: 72, efficiency: 88 },
                  { month: "Feb", revenue: 92.1, sustainability: 75, efficiency: 91 },
                  { month: "Mar", revenue: 98.7, sustainability: 78, efficiency: 94 },
                  { month: "Apr", revenue: 105.3, sustainability: 82, efficiency: 96 },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (₹Cr)" />
                <Bar dataKey="sustainability" fill="#3b82f6" name="Sustainability Score" />
                <Bar dataKey="efficiency" fill="#f59e0b" name="Operational Efficiency" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isCEOView ? "Strategic Dashboard" : "Operations Dashboard"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isCEOView
                ? "Executive overview of sustainability transformation and strategic initiatives"
                : "Real-time analysis of returns processing, hub performance, and environmental impact"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Operations</span>
              <Switch checked={isCEOView} onCheckedChange={setIsCEOView} />
              <span className="text-sm font-medium">Strategic</span>
              <Crown className="h-4 w-4 text-purple-600" />
            </div>
            <Button onClick={exportComprehensiveReport} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Dynamic Content Based on View Mode */}
        {isCEOView ? <CEODashboard /> : <OperationalDashboard />}

        {/* Enhanced Impact Summary with Images */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-32 bg-gradient-to-r from-green-600 to-blue-600">
              <Image
                src="/images/environmental-impact.png"
                alt="Environmental Impact"
                fill
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2 justify-center">
                    <Leaf className="h-6 w-6" />
                    Comprehensive Environmental Impact Summary
                  </h3>
                  <p className="text-sm opacity-90">Overall sustainability metrics and circular economy impact</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="text-center p-4 bg-green-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image src="/images/environmental-impact.png" alt="CO2 Savings" fill className="object-contain" />
                  </div>
                  <p className="text-2xl font-bold text-green-600">{overallKPIs.totalCO2} kg</p>
                  <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image src="/images/data-analytics.png" alt="Value Recovery" fill className="object-contain" />
                  </div>
                  <p className="text-2xl font-bold text-blue-600">₹{(overallKPIs.totalValue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-gray-600">Value Recovered</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image src="/images/circular-economy.png" alt="Waste Diversion" fill className="object-contain" />
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{overallKPIs.totalLandfill} kg</p>
                  <p className="text-sm text-gray-600">Waste Diverted</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg hover:shadow-md transition-shadow">
                  <div className="relative w-12 h-12 mx-auto mb-2">
                    <Image
                      src="/images/processing-workflow.png"
                      alt="Items Processed"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{overallKPIs.totalItems}</p>
                  <p className="text-sm text-gray-600">Items Processed</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

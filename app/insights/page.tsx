"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  DollarSign,
  Leaf,
  Package,
  Users,
  Zap,
  Lightbulb,
  BarChart3,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  Trash2,
} from "lucide-react"
import { comprehensiveReturnsData } from "@/data/comprehensive-returns-dataset"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Pre-calculate some aggregate data for the overview
const totalReturns = comprehensiveReturnsData.length
const totalValueRecovered = comprehensiveReturnsData.reduce((sum, item) => sum + item.estValue, 0)
const totalCO2Saved = comprehensiveReturnsData.reduce((sum, item) => sum + item.co2Saved, 0)
const totalLandfillAvoided = comprehensiveReturnsData.reduce((sum, item) => sum + item.landfillAvoided, 0)

const categoryDistribution = comprehensiveReturnsData.reduce(
  (acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  },
  {} as Record<string, number>,
)

const categoryChartData = Object.entries(categoryDistribution).map(([name, value]) => ({
  name,
  value,
  color:
    name === "Electronics"
      ? "#ef4444"
      : name === "Fashion"
        ? "#3b82f6"
        : name === "Home & Kitchen"
          ? "#10b981"
          : "#f59e0b", // Other
}))

const returnReasonDistribution = comprehensiveReturnsData.reduce(
  (acc, item) => {
    acc[item.returnReason] = (acc[item.returnReason] || 0) + 1
    return acc
  },
  {} as Record<string, number>,
)

const topReturnReasons = Object.entries(returnReasonDistribution)
  .sort(([, a], [, b]) => b - a)
  .slice(0, 5)
  .map(([name, count]) => ({ name, count }))

const monthlyTrendData = [
  { month: "Jan", returns: 1200, value: 1.2, co2: 250 },
  { month: "Feb", returns: 1500, value: 1.5, co2: 300 },
  { month: "Mar", returns: 1350, value: 1.3, co2: 280 },
  { month: "Apr", returns: 1600, value: 1.6, co2: 320 },
  { month: "May", returns: 1750, value: 1.8, co2: 350 },
  { month: "Jun", returns: 1900, value: 2.0, co2: 380 },
]

const dispositionTrendData = [
  { month: "Jan", resale: 60, repair: 20, recycle: 20 },
  { month: "Feb", resale: 62, repair: 18, recycle: 20 },
  { month: "Mar", resale: 65, repair: 15, recycle: 20 },
  { month: "Apr", resale: 63, repair: 17, recycle: 20 },
  { month: "May", resale: 66, repair: 16, recycle: 18 },
  { month: "Jun", resale: 68, repair: 15, recycle: 17 },
]

// Enhanced Insight Categories with images
const insightCategories = [
  {
    name: "Product Performance",
    description: "Analyze return rates, common defects, and product lifecycle.",
    icon: Package,
    link: "/insights/product-performance",
    image: "/images/electronics-category.png",
  },
  {
    name: "Customer Behavior",
    description: "Understand return reasons, customer segments, and loyalty.",
    icon: Users,
    link: "/insights/customer-behavior",
    image: "/images/fashion-category.png",
  },
  {
    name: "Operational Efficiency",
    description: "Optimize processing times, hub performance, and logistics.",
    icon: Zap,
    link: "/insights/operational-efficiency",
    image: "/images/processing-workflow.png",
  },
  {
    name: "Sustainability Impact",
    description: "Track CO₂ savings, waste diversion, and circular economy metrics.",
    icon: Leaf,
    link: "/insights/sustainability-impact",
    image: "/images/environmental-impact.png",
  },
  {
    name: "Financial Recovery",
    description: "Monitor value recovery rates, cost of returns, and revenue impact.",
    icon: DollarSign,
    link: "/insights/financial-recovery",
    image: "/images/data-analytics.png",
  },
  {
    name: "Market Trends",
    description: "Identify emerging return patterns and market shifts.",
    icon: TrendingUp,
    link: "/insights/market-trends",
    image: "/images/resale-marketplace.png",
  },
]

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-50 via-blue-50 to-green-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <Image src="/images/data-analytics.png" alt="AI Insights" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-green-900/80 flex items-center">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">AI-Powered Insights & Analytics</h2>
                <p className="text-lg opacity-90">Unlock actionable intelligence from your returns data</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Actionable Intelligence
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <BarChart3 className="h-3 w-3 mr-1" />
                    Data-Driven Decisions
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Tab Interface */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Insights Dashboard
          </CardTitle>
          <CardDescription>Comprehensive analytics and actionable intelligence</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gradient-to-r from-blue-50 to-green-50 p-1 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg font-medium"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="categories" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Package className="h-4 w-4 mr-2" />
                Categories
              </TabsTrigger>
              <TabsTrigger 
                value="trends" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-purple-600 transition-all duration-200 rounded-lg font-medium"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Trends
              </TabsTrigger>
              <TabsTrigger 
                value="insights" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overview KPIs */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-24 bg-gradient-to-br from-blue-500 to-blue-600">
                      <Image
                        src="/images/processing-workflow.png"
                        alt="Total Returns"
                        fill
                        className="object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-blue-600">{totalReturns.toLocaleString()}</div>
                      <p className="text-sm text-gray-600">Total Returns Processed</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-24 bg-gradient-to-br from-green-500 to-green-600">
                      <Image src="/images/data-analytics.png" alt="Value Recovered" fill className="object-cover opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <DollarSign className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-green-600">₹{(totalValueRecovered / 100000).toFixed(1)}L</div>
                      <p className="text-sm text-gray-600">Value Recovered</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-24 bg-gradient-to-br from-purple-500 to-purple-600">
                      <Image src="/images/environmental-impact.png" alt="CO2 Saved" fill className="object-cover opacity-20" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Leaf className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-purple-600">{totalCO2Saved.toFixed(1)} kg</div>
                      <p className="text-sm text-gray-600">CO₂ Saved</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-24 bg-gradient-to-br from-orange-500 to-orange-600">
                      <Image
                        src="/images/circular-economy.png"
                        alt="Landfill Avoided"
                        fill
                        className="object-cover opacity-20"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Trash2 className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="text-2xl font-bold text-orange-600">{totalLandfillAvoided.toFixed(1)} kg</div>
                      <p className="text-sm text-gray-600">Landfill Avoided</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Return Reasons */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Top 5 Return Reasons
                  </CardTitle>
                  <CardDescription>Identify and address the most frequent reasons for returns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topReturnReasons.map((reason, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-lg font-bold w-8 h-8 rounded-full flex items-center justify-center">
                            {index + 1}
                          </Badge>
                          <p className="font-medium">{reason.name}</p>
                        </div>
                        <span className="font-bold text-red-600">{reason.count} returns</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              {/* Insight Categories */}
              <div className="grid gap-6 md:grid-cols-3">
                {insightCategories.map((category, index) => (
                  <Link href={category.link} key={index}>
                    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer overflow-hidden border-0 shadow-lg">
                      <CardContent className="p-0">
                        <div className="relative h-40">
                          <Image
                            src={category.image || "/placeholder.svg"}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-4 left-4 flex items-center gap-3 text-white">
                            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                              <category.icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold">{category.name}</h3>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                          <Button
                            variant="ghost"
                            className="w-full justify-between text-blue-600 group-hover:text-blue-700 group-hover:bg-blue-50"
                          >
                            Explore Insights
                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {/* Key Trends and Distribution Charts */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      Monthly Returns & Value Trend
                    </CardTitle>
                    <CardDescription>Overview of returns volume and recovered value over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" orientation="left" stroke="#10b981" />
                        <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
                        <Tooltip />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="returns"
                          stroke="#10b981"
                          name="Returns Count"
                          activeDot={{ r: 8 }}
                          strokeWidth={3}
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="value"
                          stroke="#3b82f6"
                          name="Value (₹L)"
                          activeDot={{ r: 8 }}
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Return Category Distribution
                    </CardTitle>
                    <CardDescription>Breakdown of returns by product category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      {categoryChartData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-sm">
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2 border-0 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5 text-purple-600" />
                      Disposition Trend Over Time
                    </CardTitle>
                    <CardDescription>Evolution of recommended actions for returned items</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={dispositionTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="resale" stackId="a" fill="#10b981" name="Resale (%)" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="repair" stackId="a" fill="#f59e0b" name="Repair (%)" />
                        <Bar dataKey="recycle" stackId="a" fill="#ef4444" name="Recycle (%)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      AI-Powered Recommendations
                    </CardTitle>
                    <CardDescription>Machine learning insights for optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Size Guide Enhancement</h4>
                        <p className="text-sm text-gray-600 mb-3">Implement AR try-on to reduce size-related returns by 35%</p>
                        <Badge className="bg-blue-100 text-blue-800">High Impact</Badge>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Quality Control AI</h4>
                        <p className="text-sm text-gray-600 mb-3">Deploy computer vision for defect detection</p>
                        <Badge className="bg-green-100 text-green-800">Medium Impact</Badge>
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-purple-200">
                        <h4 className="font-semibold text-purple-800 mb-2">Predictive Analytics</h4>
                        <p className="text-sm text-gray-600 mb-3">Forecast return patterns for inventory planning</p>
                        <Badge className="bg-purple-100 text-purple-800">Strategic</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-green-600" />
                      Sustainability Impact
                    </CardTitle>
                    <CardDescription>Environmental benefits and circular economy metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-white rounded-lg border border-green-200">
                        <div className="text-3xl font-bold text-green-600 mb-1">{totalCO2Saved.toFixed(1)} kg</div>
                        <p className="text-sm text-gray-600">CO₂ Emissions Saved</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
                        <div className="text-3xl font-bold text-blue-600 mb-1">{totalLandfillAvoided.toFixed(1)} kg</div>
                        <p className="text-sm text-gray-600">Waste Diverted from Landfill</p>
                      </div>
                      <div className="text-center p-4 bg-white rounded-lg border border-purple-200">
                        <div className="text-3xl font-bold text-purple-600 mb-1">78%</div>
                        <p className="text-sm text-gray-600">Circular Economy Score</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

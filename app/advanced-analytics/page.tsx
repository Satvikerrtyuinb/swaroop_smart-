"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ResponsiveContainer,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  TrendingUp,
  Brain,
  Package,
  AlertTriangle,
  Target,
  DollarSign,
  Users,
  Clock,
  Send,
  Download,
  MapPin,
  Shirt,
  TrendingDown,
  ArrowRight,
  BarChart3,
  PieChartIcon,
  Activity,
  Leaf,
  Building2,
  AlertCircle,
  CheckCircle,
  Eye,
  FileText,
  Mail,
  Bell,
  CalendarIcon,
  Globe,
  Recycle,
  TreePine,
  Gauge,
  Cpu,
  Shield,
  Briefcase,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Enhanced data for predictions and analytics
const weeklyReturnData = [
  { week: "Week 1", actual: 1250, predicted: 1280, electronics: 450, fashion: 520, home: 280 },
  { week: "Week 2", actual: 1180, predicted: 1200, electronics: 420, fashion: 480, home: 280 },
  { week: "Week 3", actual: 1320, predicted: 1350, electronics: 480, fashion: 550, home: 290 },
  { week: "Week 4", actual: 1100, predicted: 1150, electronics: 380, fashion: 450, home: 270 },
  { week: "Week 5", predicted: 1380, electronics: 500, fashion: 580, home: 300 },
  { week: "Week 6", predicted: 1450, electronics: 520, fashion: 610, home: 320 },
  { week: "Week 7", predicted: 1520, electronics: 550, fashion: 640, home: 330 },
  { week: "Week 8", predicted: 1600, electronics: 580, fashion: 680, home: 340 },
]

const resalePriceData = [
  { category: "Electronics", currentPrice: 8500, predictedPrice: 9200, confidence: 94, trend: "up" },
  { category: "Fashion", currentPrice: 1200, predictedPrice: 1350, confidence: 87, trend: "up" },
  { category: "Home & Kitchen", currentPrice: 3200, predictedPrice: 3100, confidence: 91, trend: "down" },
  { category: "Sports", currentPrice: 2800, predictedPrice: 3000, confidence: 89, trend: "up" },
  { category: "Books", currentPrice: 450, predictedPrice: 420, confidence: 85, trend: "down" },
]

const hubCapacityData = [
  { hub: "Mumbai", current: 85, predicted: 95, capacity: 100, status: "warning" },
  { hub: "Bangalore", current: 65, predicted: 78, capacity: 100, status: "good" },
  { hub: "Delhi", current: 45, predicted: 62, capacity: 100, status: "good" },
  { hub: "Chennai", current: 72, predicted: 88, capacity: 100, status: "warning" },
  { hub: "Pune", current: 38, predicted: 45, capacity: 100, status: "underutilized" },
]

const emissionSavingsData = [
  { month: "Jan", actual: 2.3, projected: 2.5, landfillDiverted: 1200 },
  { month: "Feb", actual: 2.8, projected: 3.1, landfillDiverted: 1450 },
  { month: "Mar", actual: 3.2, projected: 3.4, landfillDiverted: 1680 },
  { month: "Apr", actual: 2.9, projected: 3.8, landfillDiverted: 1820 },
  { month: "May", projected: 4.2, landfillDiverted: 2100 },
  { month: "Jun", projected: 4.8, landfillDiverted: 2350 },
]

const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Mumbai Hub Capacity Alert",
    message: "Hub utilization will reach 95% by next week. Immediate action required.",
    timestamp: "2 minutes ago",
    category: "capacity",
  },
  {
    id: 2,
    type: "warning",
    title: "Electronics Return Spike",
    message: "iPhone 15 returns expected to increase 34% due to iOS update issues.",
    timestamp: "15 minutes ago",
    category: "prediction",
  },
  {
    id: 3,
    type: "info",
    title: "Cost Optimization Opportunity",
    message: "Implementing AI routing could save ₹180K monthly in Mumbai hub.",
    timestamp: "1 hour ago",
    category: "optimization",
  },
  {
    id: 4,
    type: "critical",
    title: "Processing Delay Risk",
    message: "Fashion category processing time increased 23% - investigate bottleneck.",
    timestamp: "2 hours ago",
    category: "delay",
  },
]

// Forecasts & Foresight Component
function ForecastsAndForesight() {
  const [selectedMetric, setSelectedMetric] = useState("returns")
  const [timeframe, setTimeframe] = useState("8weeks")

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Label>Forecast Metric</Label>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="returns">Return Volume</SelectItem>
                <SelectItem value="resale">Resale Prices</SelectItem>
                <SelectItem value="capacity">Hub Capacity</SelectItem>
                <SelectItem value="processing">Processing Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Time Horizon</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4weeks">4 Weeks</SelectItem>
                <SelectItem value="8weeks">8 Weeks</SelectItem>
                <SelectItem value="12weeks">12 Weeks</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            94% Accuracy
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Week-by-week Return Volume Graph */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Weekly Return Volume Forecast
          </CardTitle>
          <CardDescription>Predicted return volumes with category breakdown and confidence intervals</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={weeklyReturnData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e0e0e0",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="electronics"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
                name="Electronics"
              />
              <Area
                type="monotone"
                dataKey="fashion"
                stackId="1"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
                name="Fashion"
              />
              <Area
                type="monotone"
                dataKey="home"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
                name="Home & Kitchen"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray="5 5"
                name="AI Prediction"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Expected Resale Price vs Category */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Resale Price Predictions by Category
          </CardTitle>
          <CardDescription>AI-powered price forecasting with market trend analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resalePriceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    {item.category === "Electronics" && <Cpu className="h-6 w-6 text-blue-600" />}
                    {item.category === "Fashion" && <Shirt className="h-6 w-6 text-pink-600" />}
                    {item.category === "Home & Kitchen" && <Building2 className="h-6 w-6 text-green-600" />}
                    {item.category === "Sports" && <Target className="h-6 w-6 text-orange-600" />}
                    {item.category === "Books" && <FileText className="h-6 w-6 text-purple-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold">{item.category}</h4>
                    <p className="text-sm text-gray-500">{item.confidence}% confidence</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">₹{item.currentPrice.toLocaleString()}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="text-lg font-bold text-green-600">₹{item.predictedPrice.toLocaleString()}</span>
                    {item.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {item.trend === "up" ? "+" : ""}
                    {(((item.predictedPrice - item.currentPrice) / item.currentPrice) * 100).toFixed(1)}% change
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hub Capacity Load Predictor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            Hub Capacity Load Predictor
          </CardTitle>
          <CardDescription>Real-time capacity monitoring with predictive load balancing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hubCapacityData.map((hub, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold">{hub.hub} Hub</span>
                    <Badge
                      variant={
                        hub.status === "warning" ? "destructive" : hub.status === "good" ? "secondary" : "outline"
                      }
                    >
                      {hub.status}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Current → Predicted</p>
                    <p className="font-bold">
                      {hub.current}% → {hub.predicted}%
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Load</span>
                    <span>{hub.current}%</span>
                  </div>
                  <Progress value={hub.current} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Predicted Load (Next Week)</span>
                    <span>{hub.predicted}%</span>
                  </div>
                  <Progress value={hub.predicted} className="h-2" />
                </div>
                {hub.predicted > 90 && (
                  <Alert className="mt-3">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Capacity will exceed 90%. Consider load balancing or temporary expansion.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// AI Insights Component
function AIInsights() {
  const [selectedInsight, setSelectedInsight] = useState("sku")

  const skuIssues = [
    {
      sku: "IPH-15-PRO-128",
      issue: "High return rate due to iOS 17.2 battery issues",
      impact: "34% increase in returns expected",
      recommendation: "Contact Apple support, prepare dedicated processing line",
      severity: "critical",
      affectedUnits: 450,
    },
    {
      sku: "SAM-TV-55-4K",
      issue: "Screen flickering reported in 15% of units",
      impact: "Quality control issue affecting resale value",
      recommendation: "Implement enhanced testing protocol",
      severity: "warning",
      affectedUnits: 89,
    },
    {
      sku: "NKE-AIR-MAX-90",
      issue: "Size inconsistency across production batches",
      impact: "67% of returns are size-related",
      recommendation: "Update size chart, implement AR try-on",
      severity: "warning",
      affectedUnits: 234,
    },
  ]

  const processingDelays = [
    {
      hub: "Mumbai",
      delay: "Fashion processing 23% slower",
      cause: "Increased photo documentation requirements",
      impact: "2.3 days additional processing time",
      solution: "Optimize photo capture workflow",
    },
    {
      hub: "Bangalore",
      delay: "Electronics testing bottleneck",
      cause: "Limited testing equipment capacity",
      impact: "1.8 days delay for electronics",
      solution: "Add 2 additional testing stations",
    },
  ]

  const bottleneckAlerts = [
    {
      area: "Photo Capture Station",
      utilization: 95,
      bottleneck: "Queue building up during peak hours",
      impact: "15-minute average wait time",
      solution: "Add mobile photo capture units",
    },
    {
      area: "Quality Check",
      utilization: 88,
      bottleneck: "Manual inspection taking longer",
      impact: "Processing speed reduced by 12%",
      solution: "Implement AI-assisted quality checks",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Insight Type Selector */}
      <div className="flex items-center gap-4">
        <Label>Insight Type</Label>
        <Select value={selectedInsight} onValueChange={setSelectedInsight}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sku">SKU Issues</SelectItem>
            <SelectItem value="delays">Processing Delays</SelectItem>
            <SelectItem value="bottlenecks">Bottleneck Alerts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* SKU Issues */}
      {selectedInsight === "sku" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              SKU-Level Issue Detection
            </CardTitle>
            <CardDescription>
              AI-powered analysis of product-specific return patterns and quality issues
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skuIssues.map((issue, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        {issue.sku}
                      </Badge>
                      <Badge
                        variant={issue.severity === "critical" ? "destructive" : "secondary"}
                        className="capitalize"
                      >
                        {issue.severity}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">{issue.affectedUnits} units affected</span>
                  </div>
                  <div className="grid gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-1">Issue Detected</h5>
                      <p className="text-red-700 text-sm">{issue.issue}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-800 mb-1">Business Impact</h5>
                      <p className="text-orange-700 text-sm">{issue.impact}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-1">AI Recommendation</h5>
                      <p className="text-blue-700 text-sm">{issue.recommendation}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Take Action
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Delays */}
      {selectedInsight === "delays" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Processing Delay Analysis
            </CardTitle>
            <CardDescription>Real-time monitoring of processing bottlenecks and efficiency metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {processingDelays.map((delay, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {delay.hub} Hub
                    </h4>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                      Delay Detected
                    </Badge>
                  </div>
                  <div className="grid gap-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h5 className="font-semibold text-yellow-800 mb-1">Delay Issue</h5>
                      <p className="text-yellow-700 text-sm">{delay.delay}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-1">Root Cause</h5>
                      <p className="text-red-700 text-sm">{delay.cause}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-800 mb-1">Impact</h5>
                      <p className="text-orange-700 text-sm">{delay.impact}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h5 className="font-semibold text-green-800 mb-1">Recommended Solution</h5>
                      <p className="text-green-700 text-sm">{delay.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottleneck Alerts */}
      {selectedInsight === "bottlenecks" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Operational Bottleneck Detection
            </CardTitle>
            <CardDescription>
              AI-powered identification of workflow bottlenecks and optimization opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bottleneckAlerts.map((bottleneck, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{bottleneck.area}</h4>
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-red-500" />
                      <span className="font-bold text-red-600">{bottleneck.utilization}%</span>
                    </div>
                  </div>
                  <Progress value={bottleneck.utilization} className="h-3" />
                  <div className="grid gap-3">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-1">Bottleneck</h5>
                      <p className="text-red-700 text-sm">{bottleneck.bottleneck}</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <h5 className="font-semibold text-orange-800 mb-1">Impact</h5>
                      <p className="text-orange-700 text-sm">{bottleneck.impact}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h5 className="font-semibold text-blue-800 mb-1">Optimization Solution</h5>
                      <p className="text-blue-700 text-sm">{bottleneck.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ESG & CO₂ Impact Component
function ESGAndCO2Impact() {
  const [selectedView, setSelectedView] = useState("emissions")

  const esgMetrics = {
    totalCO2Saved: 24.7,
    landfillDiverted: 8450,
    circularEconomyValue: 2.3,
    sustainabilityScore: 87,
  }

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

  const landfillDiversionData = [
    { name: "Resold", value: 65, color: "#10b981" },
    { name: "Repaired", value: 20, color: "#3b82f6" },
    { name: "Recycled", value: 12, color: "#f59e0b" },
    { name: "Disposed", value: 3, color: "#ef4444" },
  ]

  return (
    <div className="space-y-6">
      {/* ESG Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <TreePine className="h-12 w-12 mx-auto text-green-600 mb-4" />
            <p className="text-3xl font-bold text-green-600">{esgMetrics.totalCO2Saved} kg</p>
            <p className="text-sm text-green-700">CO₂ Emissions Saved</p>
            <p className="text-xs text-green-600 mt-1">This Month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <Recycle className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <p className="text-3xl font-bold text-blue-600">{esgMetrics.landfillDiverted.toLocaleString()}</p>
            <p className="text-sm text-blue-700">Items Diverted</p>
            <p className="text-xs text-blue-600 mt-1">From Landfill</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 mx-auto text-purple-600 mb-4" />
            <p className="text-3xl font-bold text-purple-600">₹{esgMetrics.circularEconomyValue}M</p>
            <p className="text-sm text-purple-700">Circular Economy</p>
            <p className="text-xs text-purple-600 mt-1">Value Created</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <Shield className="h-12 w-12 mx-auto text-orange-600 mb-4" />
            <p className="text-3xl font-bold text-orange-600">{esgMetrics.sustainabilityScore}/100</p>
            <p className="text-sm text-orange-700">Sustainability</p>
            <p className="text-xs text-orange-600 mt-1">Score</p>
          </CardContent>
        </Card>
      </div>

      {/* View Selector */}
      <div className="flex items-center gap-4">
        <Label>ESG View</Label>
        <Select value={selectedView} onValueChange={setSelectedView}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="emissions">Emission Savings</SelectItem>
            <SelectItem value="diversion">Landfill Diversion</SelectItem>
            <SelectItem value="circular">Circular Economy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Emission Savings Projection */}
      {selectedView === "emissions" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-green-600" />
              CO₂ Emission Savings Projection
            </CardTitle>
            <CardDescription>Current and forecasted environmental impact with trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={emissionSavingsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e0e0e0",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="actual"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Actual CO₂ Saved (kg)"
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                  strokeDasharray="5 5"
                  name="Projected CO₂ Saved (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">Environmental Impact Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-700">
                    <strong>Total CO₂ Saved:</strong> {esgMetrics.totalCO2Saved} kg this month
                  </p>
                  <p className="text-green-700">
                    <strong>Equivalent to:</strong> 54 trees planted or 108 km of car travel avoided
                  </p>
                </div>
                <div>
                  <p className="text-green-700">
                    <strong>Projected Annual:</strong> 296 kg CO₂ savings
                  </p>
                  <p className="text-green-700">
                    <strong>Carbon Footprint:</strong> 23% reduction vs traditional disposal
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Landfill Diversion */}
      {selectedView === "diversion" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
                Landfill Diversion Breakdown
              </CardTitle>
              <CardDescription>How returned items are processed to avoid landfill disposal</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={landfillDiversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {landfillDiversionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Monthly Diversion Trends
              </CardTitle>
              <CardDescription>Items successfully diverted from landfill over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={emissionSavingsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="landfillDiverted" fill="#10b981" name="Items Diverted" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Circular Economy Impact */}
      {selectedView === "circular" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Recycle className="h-5 w-5 text-green-600" />
              Circular Economy Value Creation
            </CardTitle>
            <CardDescription>
              Economic and environmental value generated through circular business models
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
                  <p className="text-2xl font-bold text-green-600">₹2.3M</p>
                  <p className="text-sm text-green-700">Value Recovered</p>
                  <p className="text-xs text-green-600">This Quarter</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                  <p className="text-2xl font-bold text-blue-600">8,450</p>
                  <p className="text-sm text-blue-700">Items Reprocessed</p>
                  <p className="text-xs text-blue-600">Into New Value</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Globe className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                  <p className="text-2xl font-bold text-purple-600">97%</p>
                  <p className="text-sm text-purple-700">Circularity Rate</p>
                  <p className="text-xs text-purple-600">Waste to Value</p>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-4">Circular Economy Impact Metrics</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Resource Conservation</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• 2,340 kg of raw materials saved</li>
                      <li>• 15,600 liters of water conserved</li>
                      <li>• 890 kWh of energy avoided</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2">Economic Benefits</h5>
                    <ul className="text-sm space-y-1 text-gray-600">
                      <li>• ₹1.8M in resale revenue generated</li>
                      <li>• ₹450K in repair service income</li>
                      <li>• ₹50K in recycling material sales</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Executive Assistant Component
function ExecutiveAssistant() {
  const [query, setQuery] = useState("")
  const [conversations, setConversations] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedReport, setSelectedReport] = useState("weekly")
  const scrollAreaRef = useRef(null)
  const { toast } = useToast()

  const executiveInsights = [
    {
      title: "Weekly Performance Summary",
      type: "performance",
      data: {
        returnVolume: { current: 4850, change: -12 },
        processingEfficiency: { current: 94, change: 8 },
        costPerItem: { current: 145, change: -23 },
        customerSatisfaction: { current: 4.6, change: 0.3 },
      },
      keyHighlights: [
        "Return volume decreased 12% week-over-week",
        "Processing efficiency improved to 94%",
        "Cost per item reduced by ₹43 through AI optimization",
        "Customer satisfaction reached 4.6/5 rating",
      ],
    },
  ]

  const processExecutiveQuery = async (userQuery) => {
    setIsAnalyzing(true)

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: userQuery,
      timestamp: new Date().toLocaleTimeString(),
    }

    setConversations((prev) => [...prev, userMessage])

    setTimeout(() => {
      let aiResponse

      if (userQuery.toLowerCase().includes("summary") || userQuery.toLowerCase().includes("report")) {
        aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content: generateExecutiveSummary(),
          timestamp: new Date().toLocaleTimeString(),
          charts: generateExecutiveCharts(),
          actions: [
            "Export detailed report",
            "Schedule weekly briefing",
            "Set up alerts for key metrics",
            "Share with leadership team",
          ],
        }
      } else if (userQuery.toLowerCase().includes("forecast") || userQuery.toLowerCase().includes("predict")) {
        aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content: generateForecastResponse(),
          timestamp: new Date().toLocaleTimeString(),
          charts: generateForecastCharts(),
          actions: ["View detailed forecasts", "Adjust capacity planning", "Update budget projections"],
        }
      } else {
        aiResponse = {
          id: Date.now() + 1,
          type: "ai",
          content: generateGeneralExecutiveResponse(userQuery),
          timestamp: new Date().toLocaleTimeString(),
          actions: ["Get more details", "Schedule follow-up", "Export analysis"],
        }
      }

      setConversations((prev) => [...prev, aiResponse])
      setIsAnalyzing(false)

      toast({
        title: "Executive Analysis Complete",
        description: "Strategic insights and recommendations generated",
      })
    }, 2000)
  }

  const generateExecutiveSummary = () => {
    return `**Executive Summary - Week Ending ${new Date().toLocaleDateString()}**

**Key Performance Indicators:**
• Return Volume: 4,850 items (-12% WoW)
• Processing Efficiency: 94% (+8% improvement)
• Cost per Item: ₹145 (-₹43 reduction)
• Customer Satisfaction: 4.6/5 (+0.3 improvement)

**Strategic Highlights:**
1. **Operational Excellence**: AI-driven routing reduced processing costs by 23%
2. **Customer Experience**: Self-service portal increased satisfaction scores
3. **Sustainability Impact**: 24.7 kg CO₂ saved, 8,450 items diverted from landfill
4. **Revenue Recovery**: ₹2.3M in resale value generated this quarter

**Risk Alerts:**
• Mumbai hub approaching 95% capacity - expansion needed
• Electronics return spike expected due to iOS update issues

**Recommendations:**
1. Implement temporary capacity expansion in Mumbai
2. Prepare dedicated iPhone processing workflow
3. Scale AI optimization to all hubs for cost reduction`
  }

  const generateForecastResponse = () => {
    return `**Strategic Forecast Analysis**

**8-Week Return Volume Prediction:**
• Expected 15% increase in electronics returns
• Fashion category stabilizing at current levels
• Home & Kitchen showing seasonal decline

**Financial Projections:**
• Processing cost reduction: ₹180K monthly savings potential
• Resale revenue forecast: ₹3.2M next quarter
• ROI on AI investments: 340% within 6 months

**Capacity Planning:**
• Mumbai hub requires 20% expansion by month-end
• Bangalore hub can absorb 15% additional load
• Delhi hub underutilized - opportunity for load balancing

**Strategic Opportunities:**
1. B2B processing services could generate ₹2.1M annually
2. Refurbishment program expansion potential: ₹3.5M
3. Sustainability partnerships with brands for ESG goals`
  }

  const generateGeneralExecutiveResponse = (query) => {
    return `I've analyzed your query regarding "${query}" and here are the key strategic insights:

**Current Status:**
Our smart returns system is performing above industry benchmarks with 94% processing efficiency and 4.6/5 customer satisfaction.

**Strategic Impact:**
The AI-powered optimization has delivered measurable results in cost reduction and operational efficiency.

**Next Steps:**
I recommend focusing on capacity expansion and scaling successful AI implementations across all hubs.

Would you like me to provide detailed analysis on any specific aspect?`
  }

  const generateExecutiveCharts = () => {
    return [
      {
        title: "Weekly KPI Trends",
        type: "line",
        data: weeklyReturnData.slice(0, 4),
      },
      {
        title: "Cost Reduction Impact",
        type: "bar",
        data: [
          { category: "Processing", before: 220, after: 145 },
          { category: "Storage", before: 85, after: 65 },
          { category: "Transport", before: 120, after: 95 },
        ],
      },
    ]
  }

  const generateForecastCharts = () => {
    return [
      {
        title: "Return Volume Forecast",
        type: "area",
        data: weeklyReturnData,
      },
    ]
  }

  const handleSendMessage = () => {
    if (!query.trim()) return
    processExecutiveQuery(query)
    setQuery("")
  }

  const exportReport = () => {
    toast({
      title: "Report Exported",
      description: "Executive summary has been exported to PDF and sent to your email",
    })
  }

  const scheduleReport = () => {
    toast({
      title: "Report Scheduled",
      description: "Weekly executive briefing scheduled for every Monday at 9 AM",
    })
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [conversations])

  return (
    <div className="space-y-6">
      {/* Executive Dashboard Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-600">4,850</p>
            <p className="text-sm text-blue-700">Returns This Week</p>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              -12% WoW
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-600">94%</p>
            <p className="text-sm text-green-700">Processing Efficiency</p>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              +8% Improved
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6 text-center">
            <DollarSign className="h-8 w-8 mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-600">₹145</p>
            <p className="text-sm text-purple-700">Cost per Item</p>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              -₹43 Saved
            </Badge>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-orange-600">4.6/5</p>
            <p className="text-sm text-orange-700">Customer Satisfaction</p>
            <Badge variant="secondary" className="mt-1 bg-green-100 text-green-700">
              +0.3 Rating
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <Bell className="h-5 w-5" />
            Critical Alerts Requiring Executive Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertsData
              .filter((alert) => alert.type === "critical")
              .map((alert) => (
                <Alert key={alert.id} className="border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{alert.title}</strong>
                        <p className="text-sm mt-1">{alert.message}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant="destructive">Critical</Badge>
                        <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Executive Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            Executive AI Assistant
          </CardTitle>
          <CardDescription>
            Strategic insights, forecasts, and executive-level analysis with exportable reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Chat Area */}
          <Card className="h-96 bg-gray-50">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Briefcase className="h-12 w-12 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-600">Executive Intelligence Ready</h3>
                    <p className="text-sm text-gray-500">
                      Ask for strategic insights, forecasts, or executive summaries
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversations.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg p-4 ${
                          message.type === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-200 text-gray-800"
                        }`}
                      >
                        {message.type === "ai" && (
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-600">Executive Assistant</span>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{message.content}</div>

                        {message.type === "ai" && message.actions && (
                          <div className="mt-4 space-y-2">
                            <p className="text-sm font-medium text-gray-600">Quick Actions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.actions.map((action, idx) => (
                                <Button key={idx} variant="outline" size="sm" className="text-xs bg-transparent">
                                  {action}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {message.type === "user" && (
                          <div className="text-xs text-blue-200 mt-2">{message.timestamp}</div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isAnalyzing && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-[85%]">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4 animate-pulse text-blue-600" />
                          <span className="text-sm">Analyzing strategic data...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </Card>

          {/* Input Area */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask for executive summary, forecasts, strategic insights, or specific KPI analysis..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="min-h-[60px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isAnalyzing || !query.trim()} className="px-6">
                {isAnalyzing ? <Brain className="h-4 w-4 animate-pulse" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {/* Executive Quick Actions */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Executive Quick Actions:</Label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Generate weekly executive summary",
                  "Show quarterly forecast analysis",
                  "Analyze cost optimization opportunities",
                  "Review critical alerts and risks",
                  "ESG and sustainability impact report",
                  "Competitive benchmarking analysis",
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => setQuery(suggestion)}
                    className="text-xs"
                  >
                    <Briefcase className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>

            {/* Report Controls */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                <Label className="text-sm">Report Type:</Label>
                <Select value={selectedReport} onValueChange={setSelectedReport}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={scheduleReport}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Email Team
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdvancedAnalyticsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">AI Advanced Analytics & Prediction Engine</h1>
          <p className="text-gray-600 text-lg mt-2">
            Strategic intelligence platform with forecasting, insights, and executive decision support
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Live Data
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI Powered
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="forecasts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white rounded-lg p-1 shadow-sm">
          <TabsTrigger value="forecasts" className="rounded-md">
            <BarChart3 className="h-4 w-4 mr-2" />
            Forecasts & Foresight
          </TabsTrigger>
          <TabsTrigger value="insights" className="rounded-md">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="esg" className="rounded-md">
            <Leaf className="h-4 w-4 mr-2" />
            ESG & CO₂ Impact
          </TabsTrigger>
          <TabsTrigger value="executive" className="rounded-md">
            <Briefcase className="h-4 w-4 mr-2" />
            Executive Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="space-y-6">
          <ForecastsAndForesight />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsights />
        </TabsContent>

        <TabsContent value="esg" className="space-y-6">
          <ESGAndCO2Impact />
        </TabsContent>

        <TabsContent value="executive" className="space-y-6">
          <ExecutiveAssistant />
        </TabsContent>
      </Tabs>
    </div>
  )
}

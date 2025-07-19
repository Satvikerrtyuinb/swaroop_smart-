"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
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
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts"
import {
  TrendingUp,
  Brain,
  Target,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Lightbulb,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import Image from "next/image"
import { ExecutiveAIAssistant } from "@/components/executive-ai-assistant"

// Mock advanced analytics data
const predictiveData = [
  { month: "Jul", predicted: 1850, actual: 1780, confidence: 92 },
  { month: "Aug", predicted: 1920, actual: 1890, confidence: 89 },
  { month: "Sep", predicted: 2100, actual: null, confidence: 87 },
  { month: "Oct", predicted: 2250, actual: null, confidence: 85 },
  { month: "Nov", predicted: 2400, actual: null, confidence: 83 },
  { month: "Dec", predicted: 2800, actual: null, confidence: 81 },
]

const cohortData = [
  { week: "Week 1", electronics: 45, fashion: 32, appliances: 18 },
  { week: "Week 2", electronics: 52, fashion: 28, appliances: 22 },
  { week: "Week 3", electronics: 48, fashion: 35, appliances: 25 },
  { week: "Week 4", electronics: 58, fashion: 42, appliances: 28 },
]

const anomalyData = [
  { date: "2024-06-01", returns: 45, anomaly: false },
  { date: "2024-06-02", returns: 52, anomaly: false },
  { date: "2024-06-03", returns: 48, anomaly: false },
  { date: "2024-06-04", returns: 125, anomaly: true },
  { date: "2024-06-05", returns: 51, anomaly: false },
  { date: "2024-06-06", returns: 47, anomaly: false },
  { date: "2024-06-07", returns: 89, anomaly: true },
]

const customerSegmentData = [
  { segment: "High Value", count: 156, avgReturn: 3200, retention: 85 },
  { segment: "Frequent Buyers", count: 234, avgReturn: 1800, retention: 72 },
  { segment: "Price Sensitive", count: 189, avgReturn: 950, retention: 58 },
  { segment: "Occasional", count: 98, avgReturn: 1200, retention: 45 },
]

const riskScoreData = [
  { category: "Electronics", riskScore: 75, volume: 450, impact: "High" },
  { category: "Fashion", riskScore: 45, volume: 320, impact: "Medium" },
  { category: "Appliances", riskScore: 85, volume: 180, impact: "Critical" },
  { category: "Books", riskScore: 25, volume: 90, impact: "Low" },
]

export default function AdvancedAnalyticsPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("predictive")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateAdvancedReport = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Advanced Report Generated",
        description: "Comprehensive analytics report with ML insights has been created",
      })
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* Hero Section */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative h-48 md:h-64">
            <Image src="/images/ai-processing.png" alt="Advanced Analytics" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 to-purple-900/80 flex items-center">
              <div className="p-8 text-white">
                <h2 className="text-3xl font-bold mb-2">Advanced Analytics & Machine Learning</h2>
                <p className="text-lg opacity-90">Predictive insights and intelligent automation for returns optimization</p>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Brain className="h-3 w-3 mr-1" />
                    ML-Powered
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    <Target className="h-3 w-3 mr-1" />
                    Predictive Analytics
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
            <Brain className="h-5 w-5 text-purple-600" />
            Advanced Analytics Suite
          </CardTitle>
          <CardDescription>Machine learning models and predictive intelligence</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 p-1 rounded-xl">
              <TabsTrigger 
                value="predictive" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-indigo-600 transition-all duration-200 rounded-lg font-medium"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Predictive
              </TabsTrigger>
              <TabsTrigger 
                value="cohort" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-blue-600 transition-all duration-200 rounded-lg font-medium"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Cohort
              </TabsTrigger>
              <TabsTrigger 
                value="anomaly" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-red-600 transition-all duration-200 rounded-lg font-medium"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Anomaly
              </TabsTrigger>
              <TabsTrigger 
                value="segments" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-green-600 transition-all duration-200 rounded-lg font-medium"
              >
                <PieChartIcon className="h-4 w-4 mr-2" />
                Segments
              </TabsTrigger>
              <TabsTrigger 
                value="risk" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-md data-[state=active]:text-orange-600 transition-all duration-200 rounded-lg font-medium"
              >
                <Zap className="h-4 w-4 mr-2" />
                Risk Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="predictive" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      Return Volume Prediction
                    </CardTitle>
                    <CardDescription>ML-powered forecasting with confidence intervals</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={predictiveData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          name="Actual Returns" 
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#6366f1" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          name="Predicted Returns" 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-purple-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      Model Performance
                    </CardTitle>
                    <CardDescription>Accuracy metrics and confidence scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-white rounded-lg border border-indigo-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Prediction Accuracy</span>
                          <span className="text-indigo-600 font-bold">94.2%</span>
                        </div>
                        <Progress value={94.2} className="h-3" />
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-blue-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Model Confidence</span>
                          <span className="text-blue-600 font-bold">87.5%</span>
                        </div>
                        <Progress value={87.5} className="h-3" />
                      </div>
                      <div className="p-4 bg-white rounded-lg border border-green-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Data Quality Score</span>
                          <span className="text-green-600 font-bold">91.8%</span>
                        </div>
                        <Progress value={91.8} className="h-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Predictive Insights
                  </CardTitle>
                  <CardDescription>AI-generated recommendations based on forecasting models</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Seasonal Spike Alert</h4>
                      <p className="text-sm text-gray-600 mb-3">Returns expected to increase 45% in December</p>
                      <Badge className="bg-blue-100 text-blue-800">Action Required</Badge>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Capacity Planning</h4>
                      <p className="text-sm text-gray-600 mb-3">Increase processing capacity by 30% for Q4</p>
                      <Badge className="bg-green-100 text-green-800">Strategic</Badge>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Inventory Optimization</h4>
                      <p className="text-sm text-gray-600 mb-3">Focus on electronics for higher value recovery</p>
                      <Badge className="bg-purple-100 text-purple-800">Optimization</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cohort" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Cohort Analysis
                  </CardTitle>
                  <CardDescription>Weekly return patterns by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={cohortData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="electronics" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="fashion" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="appliances" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomaly" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Anomaly Detection
                  </CardTitle>
                  <CardDescription>AI-powered detection of unusual return patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart data={anomalyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Scatter 
                        dataKey="returns" 
                        fill={(entry) => entry.anomaly ? "#ef4444" : "#10b981"}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-semibold text-red-800">Anomalies Detected</span>
                      </div>
                      <p className="text-sm text-gray-600">2 unusual spikes detected in the last week</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-800">Normal Patterns</span>
                      </div>
                      <p className="text-sm text-gray-600">5 days showing expected return volumes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="segments" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-green-600" />
                    Customer Segmentation
                  </CardTitle>
                  <CardDescription>ML-based customer behavior analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 lg:grid-cols-2">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={customerSegmentData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="count"
                          label={({ segment, count }) => `${segment}: ${count}`}
                        >
                          {customerSegmentData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-4">
                      {customerSegmentData.map((segment, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">{segment.segment}</h4>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-600">Count</p>
                              <p className="font-bold">{segment.count}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Avg Return</p>
                              <p className="font-bold">₹{segment.avgReturn}</p>
                            </div>
                            <div>
                              <p className="text-gray-600">Retention</p>
                              <p className="font-bold">{segment.retention}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-orange-600" />
                    Risk Assessment Matrix
                  </CardTitle>
                  <CardDescription>Category-wise risk analysis and impact assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {riskScoreData.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{item.category}</h4>
                          <Badge 
                            variant={
                              item.impact === "Critical" ? "destructive" : 
                              item.impact === "High" ? "default" : 
                              item.impact === "Medium" ? "secondary" : "outline"
                            }
                          >
                            {item.impact} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3">
                          <div>
                            <p className="text-sm text-gray-600">Risk Score</p>
                            <p className="text-lg font-bold text-orange-600">{item.riskScore}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Volume</p>
                            <p className="text-lg font-bold">{item.volume}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Impact Level</p>
                            <p className="text-lg font-bold">{item.impact}</p>
                          </div>
                        </div>
                        <Progress value={item.riskScore} className="h-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Executive AI Assistant */}
          <div className="mt-8">
            <ExecutiveAIAssistant />
          </div>

          <div className="flex justify-center mt-8">
            <Button onClick={generateAdvancedReport} disabled={isGenerating} size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating Advanced Report...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate ML Analytics Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
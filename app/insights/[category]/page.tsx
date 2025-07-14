"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, TrendingUp, AlertTriangle, Target, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts"
import { useToast } from "@/hooks/use-toast"

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryInsightsPage({ params }: CategoryPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [timeRange, setTimeRange] = useState("3months")

  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1)

  // Mock detailed data for the category
  const categoryData = {
    electronics: {
      totalReturns: 156,
      avgValue: 2850,
      avgCO2: 3.2,
      topReasons: [
        { reason: "Defective on arrival", count: 45, percentage: 28.8 },
        { reason: "Changed mind", count: 38, percentage: 24.4 },
        { reason: "Wrong item received", count: 32, percentage: 20.5 },
        { reason: "Better price found", count: 25, percentage: 16.0 },
        { reason: "Compatibility issues", count: 16, percentage: 10.3 },
      ],
      monthlyTrend: [
        { month: "Jan", returns: 25, value: 71250, co2: 80 },
        { month: "Feb", returns: 28, value: 79800, co2: 89.6 },
        { month: "Mar", returns: 32, value: 91200, co2: 102.4 },
        { month: "Apr", returns: 29, value: 82650, co2: 92.8 },
        { month: "May", returns: 35, value: 99750, co2: 112 },
        { month: "Jun", returns: 38, value: 108300, co2: 121.6 },
      ],
      recommendations: [
        {
          title: "Improve Product Descriptions",
          description:
            "24% of returns are due to wrong expectations. Enhanced descriptions could reduce returns by 15%.",
          priority: "High",
          impact: "₹42,750 potential savings",
        },
        {
          title: "Quality Control Enhancement",
          description: "29% of returns are defective items. Stricter QC could reduce defective returns by 60%.",
          priority: "Critical",
          impact: "₹77,175 potential savings",
        },
        {
          title: "Compatibility Checker Tool",
          description: "Add compatibility verification during purchase to reduce compatibility-related returns.",
          priority: "Medium",
          impact: "₹22,800 potential savings",
        },
      ],
    },
    clothing: {
      totalReturns: 203,
      avgValue: 1250,
      avgCO2: 1.8,
      topReasons: [
        { reason: "Wrong size", count: 89, percentage: 43.8 },
        { reason: "Color different than expected", count: 45, percentage: 22.2 },
        { reason: "Poor quality", count: 32, percentage: 15.8 },
        { reason: "Doesn't fit as expected", count: 25, percentage: 12.3 },
        { reason: "Changed mind", count: 12, percentage: 5.9 },
      ],
      monthlyTrend: [
        { month: "Jan", returns: 28, value: 35000, co2: 50.4 },
        { month: "Feb", returns: 32, value: 40000, co2: 57.6 },
        { month: "Mar", returns: 38, value: 47500, co2: 68.4 },
        { month: "Apr", returns: 35, value: 43750, co2: 63 },
        { month: "May", returns: 42, value: 52500, co2: 75.6 },
        { month: "Jun", returns: 45, value: 56250, co2: 81 },
      ],
      recommendations: [
        {
          title: "Size Guide Enhancement",
          description:
            "44% of returns are size-related. AR try-on and detailed size guides could reduce returns by 35%.",
          priority: "Critical",
          impact: "₹98,875 potential savings",
        },
        {
          title: "Color Accuracy Improvement",
          description: "22% of returns due to color mismatch. Better photography and color calibration needed.",
          priority: "High",
          impact: "₹28,125 potential savings",
        },
        {
          title: "Fabric Quality Standards",
          description: "Implement stricter fabric quality checks to reduce quality-related returns.",
          priority: "Medium",
          impact: "₹20,000 potential savings",
        },
      ],
    },
    appliances: {
      totalReturns: 87,
      avgValue: 4200,
      avgCO2: 5.8,
      topReasons: [
        { reason: "Installation issues", count: 28, percentage: 32.2 },
        { reason: "Defective product", count: 22, percentage: 25.3 },
        { reason: "Wrong model ordered", count: 18, percentage: 20.7 },
        { reason: "Size doesn't fit space", count: 12, percentage: 13.8 },
        { reason: "Performance below expectations", count: 7, percentage: 8.0 },
      ],
      monthlyTrend: [
        { month: "Jan", returns: 12, value: 50400, co2: 69.6 },
        { month: "Feb", returns: 14, value: 58800, co2: 81.2 },
        { month: "Mar", returns: 16, value: 67200, co2: 92.8 },
        { month: "Apr", returns: 15, value: 63000, co2: 87 },
        { month: "May", returns: 18, value: 75600, co2: 104.4 },
        { month: "Jun", returns: 20, value: 84000, co2: 116 },
      ],
      recommendations: [
        {
          title: "Pre-Installation Consultation",
          description: "32% of returns are installation-related. Offer mandatory pre-installation consultation.",
          priority: "Critical",
          impact: "₹117,600 potential savings",
        },
        {
          title: "Space Measurement Tool",
          description: "14% of returns due to size issues. Provide AR measurement tools for space planning.",
          priority: "High",
          impact: "₹23,520 potential savings",
        },
        {
          title: "Enhanced Product Testing",
          description: "Improve quality testing to reduce defective product returns by 50%.",
          priority: "High",
          impact: "₹46,200 potential savings",
        },
      ],
    },
  }

  const currentData = categoryData[params.category as keyof typeof categoryData] || categoryData.electronics

  const downloadCategoryReport = () => {
    const csvContent = [
      "Category Analysis Report",
      `Category,${categoryName}`,
      `Total Returns,${currentData.totalReturns}`,
      `Average Value,₹${currentData.avgValue}`,
      `Average CO2 Saved,${currentData.avgCO2} kg`,
      "",
      "Top Return Reasons",
      "Reason,Count,Percentage",
      ...currentData.topReasons.map((reason) => `"${reason.reason}",${reason.count},${reason.percentage}%`),
      "",
      "Monthly Trends",
      "Month,Returns,Value,CO2 Saved",
      ...currentData.monthlyTrend.map((month) => `${month.month},${month.returns},₹${month.value},${month.co2} kg`),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${categoryName}_analysis_report.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Report Downloaded",
      description: `${categoryName} analysis report has been exported`,
    })
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{categoryName} Analysis</h1>
            <p className="text-gray-600">Detailed insights and recommendations</p>
          </div>
        </div>
        <Button onClick={downloadCategoryReport}>
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{currentData.totalReturns}</div>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Value</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{currentData.avgValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per return item</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
            <AlertTriangle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentData.avgCO2} kg</div>
            <p className="text-xs text-muted-foreground">Average per item</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Return Reasons Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Top Return Reasons</CardTitle>
            <CardDescription>Root cause analysis for {categoryName.toLowerCase()} returns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={currentData.topReasons}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="reason" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Return volume and value trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={currentData.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={2} name="Returns" />
                <Line type="monotone" dataKey="co2" stroke="#3b82f6" strokeWidth={2} name="CO₂ Saved (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            AI-Powered Recommendations
          </CardTitle>
          <CardDescription>Data-driven strategies to reduce returns and improve sustainability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentData.recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{rec.title}</h4>
                  <Badge
                    variant={
                      rec.priority === "Critical" ? "destructive" : rec.priority === "High" ? "default" : "secondary"
                    }
                  >
                    {rec.priority} Priority
                  </Badge>
                </div>
                <p className="text-gray-600">{rec.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium">{rec.impact}</span>
                  <Button size="sm">
                    <Target className="mr-2 h-4 w-4" />
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Return Reasons Breakdown</CardTitle>
          <CardDescription>
            Detailed analysis of why customers return {categoryName.toLowerCase()} items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {currentData.topReasons.map((reason, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <p className="font-medium">{reason.reason}</p>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${reason.percentage}%` }}></div>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold">{reason.count} returns</p>
                  <p className="text-sm text-gray-500">{reason.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

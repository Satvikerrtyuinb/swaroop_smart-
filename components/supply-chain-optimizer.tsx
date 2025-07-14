"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Truck, Package, Leaf, MapPin, RotateCcw } from "lucide-react"

interface OptimizationResult {
  action: string
  location: string
  timeReduction: number
  co2Savings: number
  costImpact: number
  confidence: number
}

export function SupplyChainOptimizer() {
  const [optimizations, setOptimizations] = useState<OptimizationResult[]>([])
  const [isOptimizing, setIsOptimizing] = useState(false)

  const runOptimization = async () => {
    setIsOptimizing(true)

    // Simulate supply chain optimization algorithms
    setTimeout(() => {
      const mockOptimizations: OptimizationResult[] = [
        {
          action: "Inventory Reinjection",
          location: "Mumbai FC → Pune Store",
          timeReduction: 6,
          co2Savings: 4.2,
          costImpact: -850,
          confidence: 94,
        },
        {
          action: "RTM Warranty Tracking",
          location: "Electronics Vendor Chargeback",
          timeReduction: 0,
          co2Savings: 0,
          costImpact: -2400,
          confidence: 98,
        },
        {
          action: "Green Route Selection",
          location: "Chennai → Bangalore Hub",
          timeReduction: 2,
          co2Savings: 12.8,
          costImpact: -320,
          confidence: 87,
        },
      ]

      setOptimizations(mockOptimizations)
      setIsOptimizing(false)
    }, 2500)
  }

  const totalSavings = optimizations.reduce((sum, opt) => sum + Math.abs(opt.costImpact), 0)
  const totalCO2 = optimizations.reduce((sum, opt) => sum + opt.co2Savings, 0)
  const totalTime = optimizations.reduce((sum, opt) => sum + opt.timeReduction, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RotateCcw className="h-5 w-5 text-blue-600" />
          Supply Chain Optimization Module
        </CardTitle>
        <CardDescription>AI-powered logistics optimization for returns processing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {optimizations.length === 0 ? (
          <div className="text-center py-8">
            <Button onClick={runOptimization} disabled={isOptimizing} size="lg">
              {isOptimizing ? (
                <>
                  <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                  Optimizing Supply Chain...
                </>
              ) : (
                <>
                  <Truck className="h-4 w-4 mr-2" />
                  Run Optimization Analysis
                </>
              )}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Analyze inventory reinjection, RTM tracking, and green routing opportunities
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <p className="text-2xl font-bold text-green-600">₹{totalSavings.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Cost Savings</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalCO2.toFixed(1)} kg</p>
                <p className="text-xs text-muted-foreground">CO₂ Reduced</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{totalTime} days</p>
                <p className="text-xs text-muted-foreground">Time Saved</p>
              </div>
            </div>

            {/* Optimization Results */}
            <div className="space-y-3">
              {optimizations.map((opt, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium flex items-center gap-2">
                        {opt.action === "Inventory Reinjection" && <Package className="h-4 w-4 text-blue-500" />}
                        {opt.action === "RTM Warranty Tracking" && <RotateCcw className="h-4 w-4 text-purple-500" />}
                        {opt.action === "Green Route Selection" && <Leaf className="h-4 w-4 text-green-500" />}
                        {opt.action}
                      </h5>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {opt.location}
                      </p>
                    </div>
                    <Badge variant="outline">{opt.confidence}% confidence</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cost Impact</p>
                      <p className="font-medium text-green-600">₹{Math.abs(opt.costImpact).toLocaleString()} saved</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Time Reduction</p>
                      <p className="font-medium">{opt.timeReduction} days</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CO₂ Savings</p>
                      <p className="font-medium text-green-600">{opt.co2Savings} kg</p>
                    </div>
                  </div>

                  <Progress value={opt.confidence} className="h-2" />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Implement All Optimizations
              </Button>
              <Button variant="outline" onClick={runOptimization}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

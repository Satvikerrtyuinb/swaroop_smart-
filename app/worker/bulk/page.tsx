"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { Package, CheckCircle, Clock, AlertCircle, Printer, Download } from "lucide-react"

interface BulkItem {
  id: string
  sku: string
  name: string
  condition: string
  recommendation: string
  value: number
  status: "pending" | "processed" | "error"
}

export default function BulkProcessingPage() {
  const { toast } = useToast()
  const [items, setItems] = useState<BulkItem[]>([
    {
      id: "1",
      sku: "MXR-KT22",
      name: "Mixer Grinder KT22",
      condition: "Lightly Used",
      recommendation: "Resell - Flipkart 2GUD",
      value: 1000,
      status: "processed",
    },
    {
      id: "2",
      sku: "BT-EB01",
      name: "Bluetooth Earbuds",
      condition: "New",
      recommendation: "Resell - Flipkart",
      value: 840,
      status: "processed",
    },
    {
      id: "3",
      sku: "SM-A54",
      name: "Samsung Galaxy A54",
      condition: "Damaged",
      recommendation: "Repair - Delhi Center",
      value: 5000,
      status: "pending",
    },
  ])

  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const processedCount = items.filter((item) => item.status === "processed").length
  const totalValue = items.reduce((sum, item) => sum + item.value, 0)

  const processAllItems = () => {
    setIsProcessing(true)
    setProgress(0)

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsProcessing(false)
          setItems((prev) => prev.map((item) => ({ ...item, status: "processed" })))
          toast({
            title: "Bulk Processing Complete",
            description: `${items.length} items processed successfully`,
          })
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const printAllLabels = () => {
    toast({
      title: "Printing Labels",
      description: `${items.length} labels sent to printer`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Bulk Processing</h1>
        <p className="text-gray-600">Process multiple returns efficiently</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">{items.length}</div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{processedCount}</div>
                <div className="text-sm text-gray-600">Processed</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">₹</span>
              </div>
              <div>
                <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Batch Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button onClick={processAllItems} disabled={isProcessing} className="flex-1">
              {isProcessing ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Package className="h-4 w-4 mr-2" />
                  Process All Items
                </>
              )}
            </Button>

            <Button onClick={printAllLabels} variant="outline" disabled={processedCount === 0}>
              <Printer className="h-4 w-4 mr-2" />
              Print Labels ({processedCount})
            </Button>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing items...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Items Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-600" />
                  </div>

                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                    <p className="text-sm text-gray-600">Condition: {item.condition}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-green-600">₹{item.value.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">{item.recommendation}</div>

                  <div className="mt-2">
                    {item.status === "processed" && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Processed
                      </Badge>
                    )}
                    {item.status === "pending" && (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                    {item.status === "error" && (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Error
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/language-provider"
import { useToast } from "@/hooks/use-toast"
import { Scan, Package, Lightbulb, Leaf, DollarSign, Trash2, QrCode, MapPin } from "lucide-react"

interface ReturnItem {
  sku: string
  productName: string
  condition: string
  reason: string
  location: string
  date: string
}

interface AIRecommendation {
  disposition: string
  confidence: number
  valueRecovered: number
  co2Saved: number
  landfillAvoided: number
  reasoning: string
}

export default function ReturnsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [returnItem, setReturnItem] = useState<ReturnItem>({
    sku: "",
    productName: "",
    condition: "",
    reason: "",
    location: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  const handleScanBarcode = () => {
    const mockProducts = [
      { sku: "ELX123", name: "Bluetooth Earbuds" },
      { sku: "APP456", name: "Cotton Kurti" },
      { sku: "HMA789", name: "Mixer Grinder" },
      { sku: "ELX987", name: "Smartphone (Refurbished)" },
      { sku: "APP222", name: "Denim Jeans" },
    ]
    const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]

    setReturnItem((prev) => ({
      ...prev,
      sku: randomProduct.sku,
      productName: randomProduct.name,
    }))

    toast({
      title: "Barcode Scanned",
      description: `Product identified: ${randomProduct.name}`,
    })
  }

  const conditionOptions = ["New", "Lightly Used", "Good", "Fair", "Poor", "Defective"]
  const reasonOptions = [
    "Didn't like",
    "Wrong size",
    "Defective",
    "Changed mind",
    "Doesn't fit",
    "Damaged in delivery",
    "Better price found",
    "Quality issues",
  ]

  const generateAIRecommendation = () => {
    if (!returnItem.sku || !returnItem.condition || !returnItem.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in SKU, condition, and reason to get AI recommendation",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    setTimeout(() => {
      let recommendedDisposition = "Reuse"
      let confidence = 85
      let valueRecovered = Math.floor(Math.random() * 30000) + 5000
      const co2Saved = Math.floor(Math.random() * 15) + 5
      const landfillAvoided = Math.floor(Math.random() * 10) + 2
      let reasoning = "Standard processing recommended"

      if (returnItem.condition === "New") {
        recommendedDisposition = "Reuse"
        confidence = 95
        valueRecovered = Math.floor(Math.random() * 40000) + 15000
        reasoning = "Excellent condition - direct resale recommended"
      } else if (returnItem.condition === "Fair" || returnItem.condition === "Good") {
        recommendedDisposition = "Reuse"
        confidence = 88
        valueRecovered = Math.floor(Math.random() * 25000) + 8000
        reasoning = "Good condition - suitable for refurbished marketplace"
      } else if (returnItem.condition === "Poor" || returnItem.condition === "Defective") {
        recommendedDisposition = "Recycle"
        confidence = 90
        valueRecovered = Math.floor(Math.random() * 2000) + 500
        reasoning = "Beyond economical repair - extract materials for recycling"
      }

      setAiRecommendation({
        disposition: recommendedDisposition,
        confidence,
        valueRecovered,
        co2Saved,
        landfillAvoided,
        reasoning,
      })
      setIsProcessing(false)
    }, 2000)
  }

  const generateLabel = () => {
    if (!aiRecommendation) {
      toast({
        title: "No Recommendation",
        description: "Please generate AI recommendation first",
        variant: "destructive",
      })
      return
    }

    setShowLabel(true)
    toast({
      title: "Smart Label Generated",
      description: "QR code label is ready for printing",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!returnItem.sku || !returnItem.productName || !returnItem.condition || !returnItem.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Return Processed Successfully",
      description: `Return ${returnItem.sku} has been processed and added to the system`,
    })

    setReturnItem({
      sku: "",
      productName: "",
      condition: "",
      reason: "",
      location: "",
      date: new Date().toISOString().split("T")[0],
    })
    setAiRecommendation(null)
    setShowLabel(false)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("return.title")}</h1>
        <p className="text-gray-600">Process returns with AI-powered sustainability recommendations</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Return Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Return Information
            </CardTitle>
            <CardDescription>Scan barcode or enter product details manually</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder={t("return.sku")}
                  value={returnItem.sku}
                  onChange={(e) => setReturnItem((prev) => ({ ...prev, sku: e.target.value }))}
                  className="flex-1"
                />
                <Button type="button" onClick={handleScanBarcode} variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  {t("return.scanBarcode")}
                </Button>
              </div>

              <div>
                <Label htmlFor="productName">{t("return.productName")}</Label>
                <Input
                  id="productName"
                  value={returnItem.productName}
                  onChange={(e) => setReturnItem((prev) => ({ ...prev, productName: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="condition">{t("return.condition")}</Label>
                  <Select onValueChange={(value) => setReturnItem((prev) => ({ ...prev, condition: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="reason">{t("return.reason")}</Label>
                  <Select onValueChange={(value) => setReturnItem((prev) => ({ ...prev, reason: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {reasonOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">{t("return.location")}</Label>
                  <Input
                    id="location"
                    placeholder="City, State"
                    value={returnItem.location}
                    onChange={(e) => setReturnItem((prev) => ({ ...prev, location: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="date">{t("return.date")}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={returnItem.date}
                    onChange={(e) => setReturnItem((prev) => ({ ...prev, date: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" onClick={generateAIRecommendation} disabled={isProcessing}>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  {isProcessing ? "Processing..." : "Get AI Recommendation"}
                </Button>
                <Button type="submit" className="w-full">
                  <Package className="h-4 w-4 mr-2" />
                  Process Return
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        {aiRecommendation && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                {t("ai.recommendation")}
              </CardTitle>
              <CardDescription>AI-powered sustainability analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{t("ai.disposition")}:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {aiRecommendation.disposition}
                </Badge>
              </div>

              <div className="text-sm text-gray-600">
                <strong>Confidence:</strong> {aiRecommendation.confidence}%
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <DollarSign className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold">₹{aiRecommendation.valueRecovered.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Value Recovered</div>
                </div>
                <div className="text-center">
                  <Leaf className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold">{aiRecommendation.co2Saved} kg</div>
                  <div className="text-xs text-gray-500">CO₂ Saved</div>
                </div>
                <div className="text-center">
                  <Trash2 className="h-6 w-6 mx-auto text-green-600 mb-1" />
                  <div className="text-lg font-bold">{aiRecommendation.landfillAvoided} kg</div>
                  <div className="text-xs text-gray-500">Landfill Avoided</div>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded border">
                <p className="text-sm">{aiRecommendation.reasoning}</p>
              </div>

              <Button onClick={generateLabel} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                {t("ai.generateLabel")}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* QR Label Preview */}
        {showLabel && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Smart QR Label
              </CardTitle>
              <CardDescription>Print this label for the return item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 p-6 rounded bg-white text-black">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">SmartReturns</h3>
                    <p className="text-sm">Return ID: RT{Math.floor(Math.random() * 10000)}</p>
                  </div>
                  <div className="w-20 h-20 bg-gray-200 flex items-center justify-center">
                    <QrCode className="h-12 w-12" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Product:</strong> {returnItem.productName}
                  </div>
                  <div>
                    <strong>SKU:</strong> {returnItem.sku}
                  </div>
                  <div>
                    <strong>Disposition:</strong> {aiRecommendation?.disposition}
                  </div>
                  <div>
                    <strong>Location:</strong> {returnItem.location}
                  </div>
                </div>

                <div className="mt-4 p-2 bg-green-50 rounded flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Nearest Hub: Mumbai Processing Center (12.5 km)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Clock, Truck, Leaf } from "lucide-react"

interface PricePrediction {
  platform: string
  predictedPrice: number
  confidence: number
  timeToSale: number
  co2Impact: number
  reasoning: string
}

interface PricePredictorProps {
  sku: string
  condition: string
  category: string
  originalPrice: number
}

export function DynamicPricePredictor({ sku, condition, category, originalPrice }: PricePredictorProps) {
  const [predictions, setPredictions] = useState<PricePrediction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generatePredictions = async () => {
    setIsLoading(true)

    // Simulate AI model prediction
    setTimeout(() => {
      const mockPredictions: PricePrediction[] = [
        {
          platform: "Flipkart 2GUD",
          predictedPrice: Math.floor(originalPrice * 0.65),
          confidence: 92,
          timeToSale: 2,
          co2Impact: 2.3,
          reasoning: "High demand for refurbished electronics, good condition rating",
        },
        {
          platform: "Amazon Renewed",
          predictedPrice: Math.floor(originalPrice * 0.58),
          confidence: 87,
          timeToSale: 4,
          co2Impact: 2.1,
          reasoning: "Competitive pricing needed, longer listing time expected",
        },
        {
          platform: "Walmart Marketplace",
          predictedPrice: Math.floor(originalPrice * 0.72),
          confidence: 95,
          timeToSale: 1,
          co2Impact: 2.5,
          reasoning: "Internal platform advantage, faster processing",
        },
      ]

      setPredictions(mockPredictions.sort((a, b) => b.predictedPrice - a.predictedPrice))
      setIsLoading(false)
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Dynamic Resale Price Predictor
        </CardTitle>
        <CardDescription>AI-powered marketplace routing and value optimization</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">SKU</p>
            <p className="font-medium">{sku}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Condition</p>
            <Badge variant="outline">{condition}</Badge>
          </div>
          <div>
            <p className="text-muted-foreground">Original Price</p>
            <p className="font-medium">₹{originalPrice.toLocaleString()}</p>
          </div>
        </div>

        {predictions.length === 0 ? (
          <Button onClick={generatePredictions} disabled={isLoading} className="w-full">
            {isLoading ? "Analyzing Market Data..." : "Generate Price Predictions"}
          </Button>
        ) : (
          <div className="space-y-3">
            {predictions.map((prediction, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={index === 0 ? "default" : "secondary"}>{prediction.platform}</Badge>
                    {index === 0 && <Badge variant="outline">Recommended</Badge>}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">₹{prediction.predictedPrice.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{prediction.confidence}% confidence</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>{prediction.timeToSale} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Leaf className="h-4 w-4 text-green-500" />
                    <span>{prediction.co2Impact} kg CO₂</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                    <span>{((prediction.predictedPrice / originalPrice) * 100).toFixed(0)}% recovery</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground bg-muted p-2 rounded">{prediction.reasoning}</div>

                <Progress value={prediction.confidence} className="h-2" />
              </div>
            ))}

            <Button className="w-full mt-4">
              <Truck className="h-4 w-4 mr-2" />
              Generate Smart Label for {predictions[0].platform}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

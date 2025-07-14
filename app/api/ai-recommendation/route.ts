import { type NextRequest, NextResponse } from "next/server"

interface RecommendationRequest {
  sku: string
  condition: string
  returnReason: string
  category: string
  mrp: number
}

interface AIRecommendation {
  action: "Resell" | "Repair" | "Recycle" | "Donate"
  platform: string
  estimatedValue: number
  co2Saved: number
  hub: string
  eta: string
  confidence: number
  reasoning: string
  binLocation: string
}

// AI recommendation logic
function generateRecommendation(data: RecommendationRequest): AIRecommendation {
  const { condition, returnReason, category, mrp } = data

  // Base recommendation logic
  let action: AIRecommendation["action"] = "Recycle"
  let platform = "N/A"
  let estimatedValue = 0
  let confidence = 85
  let hub = "Recycling Center"
  let binLocation = "RECYCLE"

  // Condition-based logic
  if (condition === "new") {
    action = "Resell"
    estimatedValue = Math.round(mrp * 0.7)
    confidence = 95
    platform = "Flipkart"
    hub = "In-house Warehouse"
    binLocation = "RESELL-A"
  } else if (condition === "lightly-used") {
    action = "Resell"
    estimatedValue = Math.round(mrp * 0.4)
    confidence = 88
    platform = "Flipkart 2GUD"
    hub = "2GUD Processing Center"
    binLocation = "RESELL-B"
  } else if (condition === "damaged" && category === "Electronics") {
    if (mrp > 5000) {
      action = "Repair"
      estimatedValue = Math.round(mrp * 0.25)
      confidence = 75
      platform = "Repair Center"
      hub = "Electronics Repair Hub"
      binLocation = "REPAIR"
    }
  } else if (condition === "not-working") {
    if (category === "Electronics") {
      action = "Recycle"
      hub = "e-Waste Center"
      binLocation = "E-WASTE"
    } else {
      action = "Donate"
      hub = "Donation Center"
      binLocation = "DONATE"
    }
  }

  // Calculate CO2 savings based on action
  let co2Saved = 0
  if (action === "Resell") co2Saved = mrp * 0.002
  else if (action === "Repair") co2Saved = mrp * 0.0015
  else if (action === "Recycle") co2Saved = mrp * 0.001
  else if (action === "Donate") co2Saved = mrp * 0.0018

  const reasoning = generateReasoning(action, condition, returnReason, category)

  return {
    action,
    platform,
    estimatedValue,
    co2Saved: Math.round(co2Saved * 100) / 100,
    hub,
    eta: action === "Resell" ? "1-2 days" : action === "Repair" ? "3-5 days" : "1 day",
    confidence,
    reasoning,
    binLocation,
  }
}

function generateReasoning(action: string, condition: string, reason: string, category: string): string {
  const reasoningMap = {
    Resell: `Item is in ${condition} condition and suitable for resale. ${category} items have good demand in secondary market.`,
    Repair: `Item can be economically repaired. ${category} items retain good value after professional repair.`,
    Recycle: `Item is beyond repair but materials can be recovered responsibly. Environmental compliance ensured.`,
    Donate: `Item has social value despite condition. Partner NGOs can utilize effectively.`,
  }

  return reasoningMap[action as keyof typeof reasoningMap] || "Standard processing recommended."
}

export async function POST(request: NextRequest) {
  try {
    const data: RecommendationRequest = await request.json()

    // Validate required fields
    if (!data.sku || !data.condition || !data.returnReason) {
      return NextResponse.json({ error: "Missing required fields", code: "VALIDATION_ERROR" }, { status: 400 })
    }

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const recommendation = generateRecommendation(data)

    return NextResponse.json({
      success: true,
      recommendation,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Processing failed", code: "AI_ERROR" }, { status: 500 })
  }
}

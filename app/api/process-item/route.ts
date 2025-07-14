import { type NextRequest, NextResponse } from "next/server"

interface ProcessedItem {
  id: string
  sku: string
  productName: string
  condition: string
  returnReason: string
  recommendation: {
    action: string
    platform: string
    estimatedValue: number
    co2Saved: number
    hub: string
    binLocation: string
  }
  workerId: string
  processedAt: string
  labelId: string
  status: "processed" | "pending" | "shipped"
}

// In-memory storage (replace with database in production)
const processedItems: ProcessedItem[] = []
const dailyCounters: Record<string, number> = {}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const processedItem: ProcessedItem = {
      id: `SR-${Date.now()}`,
      sku: data.sku,
      productName: data.productName,
      condition: data.condition,
      returnReason: data.returnReason,
      recommendation: data.recommendation,
      workerId: data.workerId || "WORKER001",
      processedAt: new Date().toISOString(),
      labelId: `LBL-${Date.now()}`,
      status: "processed",
    }

    // Store processed item
    processedItems.push(processedItem)

    // Update daily counter
    const today = new Date().toDateString()
    const workerId = processedItem.workerId
    const counterKey = `${workerId}-${today}`
    dailyCounters[counterKey] = (dailyCounters[counterKey] || 0) + 1

    return NextResponse.json({
      success: true,
      item: processedItem,
      dailyCount: dailyCounters[counterKey],
      label: {
        id: processedItem.labelId,
        qrCode: `SR-${processedItem.id}`,
        destination: processedItem.recommendation.hub,
        binLocation: processedItem.recommendation.binLocation,
        priority: processedItem.recommendation.estimatedValue > 1000 ? "HIGH" : "NORMAL",
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Processing failed", code: "PROCESS_ERROR" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const workerId = searchParams.get("workerId") || "WORKER001"
  const date = searchParams.get("date") || new Date().toDateString()

  const counterKey = `${workerId}-${date}`
  const dailyCount = dailyCounters[counterKey] || 0

  // Get recent items for this worker
  const recentItems = processedItems
    .filter((item) => item.workerId === workerId)
    .slice(-10)
    .reverse()

  return NextResponse.json({
    success: true,
    dailyCount,
    recentItems,
    totalProcessed: processedItems.length,
  })
}

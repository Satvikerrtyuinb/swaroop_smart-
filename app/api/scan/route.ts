import { type NextRequest, NextResponse } from "next/server"

// Simulated product database
const productDatabase = {
  "MX-KT22-BLK": {
    sku: "MX-KT22-BLK",
    name: "Bajaj Mixer Grinder KT22",
    brand: "Bajaj",
    category: "Electronics",
    mrp: 2500,
    imageUrl: "/images/products/mixer-grinder.jpg",
    weight: 2.5,
    dimensions: "30x20x25 cm",
  },
  "BT-EB01-WHT": {
    sku: "BT-EB01-WHT",
    name: "Bluetooth Earbuds Pro",
    brand: "TechSound",
    category: "Electronics",
    mrp: 1499,
    imageUrl: "/images/products/bluetooth-earbuds.jpg",
    weight: 0.1,
    dimensions: "5x5x3 cm",
  },
  "NK-SH42-BLK": {
    sku: "NK-SH42-BLK",
    name: "Nike Air Max Running Shoes",
    brand: "Nike",
    category: "Footwear",
    mrp: 8999,
    imageUrl: "/images/products/nike-shoes.jpg",
    weight: 0.8,
    dimensions: "32x20x12 cm",
  },
  "SM-A54-BLU": {
    sku: "SM-A54-BLU",
    name: "Samsung Galaxy A54 5G",
    brand: "Samsung",
    category: "Electronics",
    mrp: 38999,
    imageUrl: "/images/products/samsung-phone.jpg",
    weight: 0.2,
    dimensions: "16x7.5x0.8 cm",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { barcode, qrCode } = await request.json()

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const productId = barcode || qrCode
    const product = productDatabase[productId as keyof typeof productDatabase]

    if (!product) {
      return NextResponse.json({ error: "Product not found", code: "PRODUCT_NOT_FOUND" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      product,
      scannedAt: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request", code: "INVALID_REQUEST" }, { status: 400 })
  }
}

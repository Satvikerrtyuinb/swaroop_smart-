export interface ReturnItem {
  id: string
  sku: string
  productName: string
  category: string
  condition: string
  returnReason: string
  location: string
  returnDate: string
  estValue: number
  co2Saved: number
  landfillAvoided: number
  recommendedAction: string
  marketplace: string
  imageUrl: string
  customerRating?: number
  originalPrice?: number
}

export const sampleReturnsData: ReturnItem[] = [
  {
    id: "001",
    sku: "ELX123",
    productName: "Bluetooth Earbuds",
    category: "Electronics",
    condition: "Lightly Used",
    returnReason: "Didn't like sound",
    location: "Pune",
    returnDate: "2025-06-10",
    estValue: 900,
    co2Saved: 0.8,
    landfillAvoided: 0.15,
    recommendedAction: "Reuse",
    marketplace: "Flipkart 2GUD",
    imageUrl: "/images/ai-generated/bluetooth-earbuds.jpg",
    customerRating: 4,
    originalPrice: 1499,
  },
  {
    id: "002",
    sku: "APP456",
    productName: "Cotton Kurti",
    category: "Clothing",
    condition: "New",
    returnReason: "Wrong size",
    location: "Jaipur",
    returnDate: "2025-06-14",
    estValue: 500,
    co2Saved: 0.5,
    landfillAvoided: 0.25,
    recommendedAction: "Reuse",
    marketplace: "Walmart Online",
    imageUrl: "/images/ai-generated/cotton-kurti.jpg",
    customerRating: 5,
    originalPrice: 799,
  },
  {
    id: "003",
    sku: "HMA789",
    productName: "Mixer Grinder",
    category: "Appliances",
    condition: "Defective",
    returnReason: "Motor issue",
    location: "Chennai",
    returnDate: "2025-06-15",
    estValue: 0,
    co2Saved: 1.5,
    landfillAvoided: 2.0,
    recommendedAction: "Recycle",
    marketplace: "N/A",
    imageUrl: "/images/ai-generated/mixer-grinder.jpg",
    customerRating: 1,
    originalPrice: 2999,
  },
  {
    id: "004",
    sku: "ELX987",
    productName: "Smartphone (Refurbished)",
    category: "Electronics",
    condition: "Minor Scratch",
    returnReason: "Changed mind",
    location: "Hyderabad",
    returnDate: "2025-06-16",
    estValue: 4500,
    co2Saved: 2.1,
    landfillAvoided: 0.3,
    recommendedAction: "Repair",
    marketplace: "Amazon Renewed",
    imageUrl: "/images/ai-generated/smartphone.jpg",
    customerRating: 4,
    originalPrice: 8999,
  },
  {
    id: "005",
    sku: "APP222",
    productName: "Denim Jeans",
    category: "Clothing",
    condition: "New",
    returnReason: "Doesn't fit",
    location: "Nagpur",
    returnDate: "2025-06-17",
    estValue: 750,
    co2Saved: 0.7,
    landfillAvoided: 0.2,
    recommendedAction: "Reuse",
    marketplace: "Flipkart",
    imageUrl: "/images/ai-generated/denim-jeans.jpg",
    customerRating: 5,
    originalPrice: 1299,
  },
  {
    id: "006",
    sku: "HMA111",
    productName: "Electric Kettle",
    category: "Appliances",
    condition: "Slight Burn",
    returnReason: "Overheating",
    location: "Delhi",
    returnDate: "2025-06-12",
    estValue: 200,
    co2Saved: 1.2,
    landfillAvoided: 0.5,
    recommendedAction: "Repair",
    marketplace: "BigBasket",
    imageUrl: "/images/ai-generated/electric-kettle.jpg",
    customerRating: 2,
    originalPrice: 899,
  },
  {
    id: "007",
    sku: "STA543",
    productName: "Office Chair",
    category: "Furniture",
    condition: "Damaged",
    returnReason: "Broken wheel",
    location: "Bengaluru",
    returnDate: "2025-06-13",
    estValue: 0,
    co2Saved: 3.5,
    landfillAvoided: 5.0,
    recommendedAction: "Recycle",
    marketplace: "N/A",
    imageUrl: "/placeholder.svg?height=100&width=100", // Keeping this as placeholder as it wasn't in the AI generation list
    customerRating: 1,
    originalPrice: 4999,
  },
  {
    id: "008",
    sku: "ELX456",
    productName: "Power Bank",
    category: "Electronics",
    condition: "New",
    returnReason: "Received duplicate",
    location: "Kolkata",
    returnDate: "2025-06-14",
    estValue: 600,
    co2Saved: 0.9,
    landfillAvoided: 0.18,
    recommendedAction: "Reuse",
    marketplace: "Walmart Online",
    imageUrl: "/placeholder.svg?height=100&width=100", // Keeping this as placeholder as it wasn't in the AI generation list
    customerRating: 5,
    originalPrice: 999,
  },
  {
    id: "009",
    sku: "APP999",
    productName: "Silk Saree",
    category: "Clothing",
    condition: "Torn",
    returnReason: "Damaged in delivery",
    location: "Ahmedabad",
    returnDate: "2025-06-10",
    estValue: 100,
    co2Saved: 0.4,
    landfillAvoided: 0.4,
    recommendedAction: "Repair",
    marketplace: "Myntra",
    imageUrl: "/images/ai-generated/silk-saree.jpg",
    customerRating: 2,
    originalPrice: 2499,
  },
  {
    id: "010",
    sku: "TOY321",
    productName: "Remote Car Toy",
    category: "Toys",
    condition: "New",
    returnReason: "Changed mind",
    location: "Mumbai",
    returnDate: "2025-06-11",
    estValue: 350,
    co2Saved: 0.6,
    landfillAvoided: 0.2,
    recommendedAction: "Reuse",
    marketplace: "FirstCry",
    imageUrl: "/placeholder.svg?height=100&width=100", // Keeping this as placeholder as it wasn't in the AI generation list
    customerRating: 4,
    originalPrice: 699,
  },
]

// Analytics helper functions
export const getAnalyticsByCategory = () => {
  const categoryStats = sampleReturnsData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          count: 0,
          totalValue: 0,
          totalCO2: 0,
          totalLandfill: 0,
          conditions: {} as Record<string, number>,
          reasons: {} as Record<string, number>,
        }
      }

      acc[item.category].count++
      acc[item.category].totalValue += item.estValue
      acc[item.category].totalCO2 += item.co2Saved
      acc[item.category].totalLandfill += item.landfillAvoided

      // Track conditions
      acc[item.category].conditions[item.condition] = (acc[item.category].conditions[item.condition] || 0) + 1

      // Track reasons
      acc[item.category].reasons[item.returnReason] = (acc[item.category].reasons[item.returnReason] || 0) + 1

      return acc
    },
    {} as Record<string, any>,
  )

  return categoryStats
}

export const getLocationStats = () => {
  return sampleReturnsData.reduce(
    (acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = {
          count: 0,
          totalCO2: 0,
          totalValue: 0,
        }
      }

      acc[item.location].count++
      acc[item.location].totalCO2 += item.co2Saved
      acc[item.location].totalValue += item.estValue

      return acc
    },
    {} as Record<string, any>,
  )
}

export const getDispositionStats = () => {
  return sampleReturnsData.reduce(
    (acc, item) => {
      if (!acc[item.recommendedAction]) {
        acc[item.recommendedAction] = {
          count: 0,
          totalValue: 0,
          totalCO2: 0,
        }
      }

      acc[item.recommendedAction].count++
      acc[item.recommendedAction].totalValue += item.estValue
      acc[item.recommendedAction].totalCO2 += item.co2Saved

      return acc
    },
    {} as Record<string, any>,
  )
}

// CSV export function
export const generateCSV = () => {
  const headers = [
    "ID",
    "SKU",
    "Product Name",
    "Category",
    "Condition",
    "Return Reason",
    "Location",
    "Return Date",
    "Est. Value (₹)",
    "CO₂ Saved (kg)",
    "Landfill Avoided (kg)",
    "Recommended Action",
    "Marketplace",
    "Customer Rating",
    "Original Price (₹)",
  ]

  const csvContent = [
    headers.join(","),
    ...sampleReturnsData.map((item) =>
      [
        item.id,
        item.sku,
        `"${item.productName}"`,
        item.category,
        `"${item.condition}"`,
        `"${item.returnReason}"`,
        item.location,
        item.returnDate,
        item.estValue,
        item.co2Saved,
        item.landfillAvoided,
        item.recommendedAction,
        `"${item.marketplace}"`,
        item.customerRating || "N/A",
        item.originalPrice || "N/A",
      ].join(","),
    ),
  ].join("\n")

  return csvContent
}

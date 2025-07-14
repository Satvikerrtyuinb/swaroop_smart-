export interface EnhancedReturnItem {
  id: string
  sku: string
  productName: string
  category: string
  city: string
  condition: string
  aiAction: string
  valueRecovered: number
  co2Saved: number
  hub: string
  returnDate: string
  returnReason: string
  imageUrl: string
  customerRating?: number
  originalPrice?: number
}

export const enhancedSampleData: EnhancedReturnItem[] = [
  {
    id: "001",
    sku: "JBL-SPKR-023",
    productName: "JBL Bluetooth Speaker",
    category: "Electronics",
    city: "Pune",
    condition: "Lightly used",
    aiAction: "Resale",
    valueRecovered: 450,
    co2Saved: 2.3,
    hub: "2GUD Aundh",
    returnDate: "2025-06-10",
    returnReason: "Didn't like sound quality",
    imageUrl: "/images/ai-generated/bluetooth-earbuds.jpg",
    customerRating: 4,
    originalPrice: 899,
  },
  {
    id: "002",
    sku: "NKE-1238",
    productName: "Nike Running Shoes",
    category: "Footwear",
    city: "Bengaluru",
    condition: "New",
    aiAction: "Resale",
    valueRecovered: 850,
    co2Saved: 3.1,
    hub: "In-house Koramangala",
    returnDate: "2025-06-11",
    returnReason: "Wrong size",
    imageUrl: "/images/ai-generated/denim-jeans.jpg",
    customerRating: 5,
    originalPrice: 1299,
  },
  {
    id: "003",
    sku: "MIXR-KT22",
    productName: "Kitchen Mixer Grinder",
    category: "Appliances",
    city: "Chennai",
    condition: "Damaged",
    aiAction: "Repair",
    valueRecovered: 200,
    co2Saved: 1.8,
    hub: "Repairs Guindy",
    returnDate: "2025-06-12",
    returnReason: "Motor issue",
    imageUrl: "/images/ai-generated/mixer-grinder.jpg",
    customerRating: 2,
    originalPrice: 2499,
  },
  {
    id: "004",
    sku: "SAR-KRT33",
    productName: "Cotton Kurti",
    category: "Apparel",
    city: "Delhi",
    condition: "New",
    aiAction: "Resale",
    valueRecovered: 350,
    co2Saved: 0.9,
    hub: "In-house Okhla",
    returnDate: "2025-06-13",
    returnReason: "Color mismatch",
    imageUrl: "/images/ai-generated/cotton-kurti.jpg",
    customerRating: 3,
    originalPrice: 699,
  },
  {
    id: "005",
    sku: "IPH-12-B2",
    productName: "iPhone 12 (Defective)",
    category: "Electronics",
    city: "Mumbai",
    condition: "Defective",
    aiAction: "Recycle",
    valueRecovered: 0,
    co2Saved: 4.5,
    hub: "e-Waste Taloja",
    returnDate: "2025-06-14",
    returnReason: "Screen damage",
    imageUrl: "/images/ai-generated/smartphone.jpg",
    customerRating: 1,
    originalPrice: 54999,
  },
  {
    id: "006",
    sku: "PNK-HD95",
    productName: "Pink Bedsheet Set",
    category: "Home Goods",
    city: "Hyderabad",
    condition: "Lightly used",
    aiAction: "Resale",
    valueRecovered: 180,
    co2Saved: 0.7,
    hub: "2GUD Gachibowli",
    returnDate: "2025-06-15",
    returnReason: "Changed mind",
    imageUrl: "/images/ai-generated/silk-saree.jpg",
    customerRating: 4,
    originalPrice: 399,
  },
  {
    id: "007",
    sku: "PLS-1022",
    productName: "Puma Sports Shoes",
    category: "Footwear",
    city: "Jaipur",
    condition: "Repairable",
    aiAction: "Repair",
    valueRecovered: 120,
    co2Saved: 1.2,
    hub: "Repairs Sitapura",
    returnDate: "2025-06-16",
    returnReason: "Sole detachment",
    imageUrl: "/images/ai-generated/denim-jeans.jpg",
    customerRating: 3,
    originalPrice: 1899,
  },
  {
    id: "008",
    sku: "LED-TV42",
    productName: "42-inch LED TV",
    category: "Electronics",
    city: "Lucknow",
    condition: "Damaged",
    aiAction: "Recycle",
    valueRecovered: 0,
    co2Saved: 6.2,
    hub: "e-Waste Kanpur",
    returnDate: "2025-06-17",
    returnReason: "Screen cracked",
    imageUrl: "/images/ai-generated/smartphone.jpg",
    customerRating: 1,
    originalPrice: 24999,
  },
  {
    id: "009",
    sku: "COK-ST28",
    productName: "Stainless Steel Cookware",
    category: "Kitchenware",
    city: "Kochi",
    condition: "New",
    aiAction: "Resale",
    valueRecovered: 90,
    co2Saved: 0.4,
    hub: "In-house Aluva",
    returnDate: "2025-06-18",
    returnReason: "Received duplicate",
    imageUrl: "/images/ai-generated/electric-kettle.jpg",
    customerRating: 5,
    originalPrice: 1299,
  },
  {
    id: "010",
    sku: "SWT-SH12",
    productName: "Cotton Sweatshirt",
    category: "Apparel",
    city: "Nagpur",
    condition: "New",
    aiAction: "Resale",
    valueRecovered: 260,
    co2Saved: 0.8,
    hub: "2GUD Hingna",
    returnDate: "2025-06-19",
    returnReason: "Size too large",
    imageUrl: "/images/ai-generated/cotton-kurti.jpg",
    customerRating: 4,
    originalPrice: 599,
  },
  {
    id: "011",
    sku: "MUG-ST10",
    productName: "Ceramic Mug Set",
    category: "Home Goods",
    city: "Surat",
    condition: "Damaged",
    aiAction: "Recycle",
    valueRecovered: 0,
    co2Saved: 0.3,
    hub: "Recycle Hazira",
    returnDate: "2025-06-20",
    returnReason: "Broken in transit",
    imageUrl: "/images/ai-generated/electric-kettle.jpg",
    customerRating: 2,
    originalPrice: 299,
  },
  {
    id: "012",
    sku: "LAP-DL90",
    productName: "Dell Laptop",
    category: "Electronics",
    city: "Kolkata",
    condition: "Lightly used",
    aiAction: "Resale",
    valueRecovered: 7200,
    co2Saved: 8.7,
    hub: "2GUD Howrah",
    returnDate: "2025-06-21",
    returnReason: "Upgraded to newer model",
    imageUrl: "/images/ai-generated/smartphone.jpg",
    customerRating: 5,
    originalPrice: 45999,
  },
]

// Enhanced analytics functions
export const getCategoryWiseAnalytics = () => {
  const categoryStats = enhancedSampleData.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          items: 0,
          totalValue: 0,
          totalCO2: 0,
          reuse: 0,
          repair: 0,
          recycle: 0,
        }
      }

      acc[item.category].items++
      acc[item.category].totalValue += item.valueRecovered
      acc[item.category].totalCO2 += item.co2Saved

      if (item.aiAction === "Resale") acc[item.category].reuse++
      else if (item.aiAction === "Repair") acc[item.category].repair++
      else if (item.aiAction === "Recycle") acc[item.category].recycle++

      return acc
    },
    {} as Record<string, any>,
  )

  return Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    items: stats.items,
    avgValueRecovered: Math.round(stats.totalValue / stats.items),
    avgCO2Saved: (stats.totalCO2 / stats.items).toFixed(1),
    reusePercent: Math.round((stats.reuse / stats.items) * 100),
    repairPercent: Math.round((stats.repair / stats.items) * 100),
    recyclePercent: Math.round((stats.recycle / stats.items) * 100),
  }))
}

export const getCityWiseStats = () => {
  return enhancedSampleData.reduce(
    (acc, item) => {
      if (!acc[item.city]) {
        acc[item.city] = {
          count: 0,
          totalValue: 0,
          totalCO2: 0,
        }
      }

      acc[item.city].count++
      acc[item.city].totalValue += item.valueRecovered
      acc[item.city].totalCO2 += item.co2Saved

      return acc
    },
    {} as Record<string, any>,
  )
}

export const getOverallKPIs = () => {
  const totalItems = enhancedSampleData.length
  const totalValue = enhancedSampleData.reduce((sum, item) => sum + item.valueRecovered, 0)
  const totalCO2 = enhancedSampleData.reduce((sum, item) => sum + item.co2Saved, 0)
  const reuseCount = enhancedSampleData.filter((item) => item.aiAction === "Resale").length
  const repairCount = enhancedSampleData.filter((item) => item.aiAction === "Repair").length
  const recycleCount = enhancedSampleData.filter((item) => item.aiAction === "Recycle").length

  return {
    totalItems,
    totalValue,
    totalCO2: totalCO2.toFixed(1),
    avgValuePerItem: Math.round(totalValue / totalItems),
    avgCO2PerItem: (totalCO2 / totalItems).toFixed(1),
    landfillDiversionRate: Math.round(((totalItems - recycleCount) / totalItems) * 100),
    reuseRate: Math.round((reuseCount / totalItems) * 100),
    repairRate: Math.round((repairCount / totalItems) * 100),
    recycleRate: Math.round((recycleCount / totalItems) * 100),
  }
}

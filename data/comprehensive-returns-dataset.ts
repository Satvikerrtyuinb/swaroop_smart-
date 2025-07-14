export interface ComprehensiveReturnItem {
  id: string
  sku: string
  productName: string
  brand: string
  category: string
  subcategory: string
  condition: string
  returnReason: string
  location: string
  returnDate: string
  customerAge: number
  customerGender: "Male" | "Female" | "Other"
  purchaseChannel: "Online" | "Store" | "Mobile App"
  estValue: number
  co2Saved: number
  landfillAvoided: number
  recommendedAction: string
  marketplace: string
  imageUrl: string
  customerRating: number
  originalPrice: number
  manufacturingDate: string
  warrantyStatus: "Active" | "Expired" | "N/A"
  repairCost?: number
  resalePrice?: number
  recycleValue?: number
  processingTime: number
  carbonFootprint: number
  materialComposition: string[]
  sustainabilityScore: number
  returnFrequency: number
  seasonality: "High" | "Medium" | "Low"
  marketDemand: "High" | "Medium" | "Low"
}

/* ----------  D A T A  ---------- */
export const comprehensiveReturnsData: ComprehensiveReturnItem[] = [
  /* … items 001 → 025 exactly as sent previously … */

  /* 026 – completed & corrected */
  {
    id: "026",
    sku: "FUNSKOOL-RCCAR-RED",
    productName: "Funskool Remote Control Car Red",
    brand: "Funskool",
    category: "Toys",
    subcategory: "Remote Control",
    condition: "Defective",
    returnReason: "Remote not responding",
    location: "Ranchi",
    returnDate: "2024-11-20",
    customerAge: 8,
    customerGender: "Male",
    purchaseChannel: "Store",
    estValue: 600,
    co2Saved: 1.2,
    landfillAvoided: 0.4,
    recommendedAction: "Repair",
    marketplace: "FirstCry",
    imageUrl: "/placeholder.svg?height=100&width=100",
    customerRating: 2,
    originalPrice: 1499,
    manufacturingDate: "2024-09-15",
    warrantyStatus: "Active",
    repairCost: 200,
    resalePrice: 1000,
    processingTime: 3,
    carbonFootprint: 4.5,
    materialComposition: ["Plastic", "Electronics", "Metal"],
    sustainabilityScore: 60,
    returnFrequency: 15,
    seasonality: "High",
    marketDemand: "Medium",
  },

  /* 027 */
  {
    id: "027",
    sku: "TITAN-WATCH-STEEL-BLK",
    productName: "Titan Neo Splash Watch Black Dial",
    brand: "Titan",
    category: "Fashion",
    subcategory: "Accessories",
    condition: "Minor Scratch",
    returnReason: "Strap scratched during delivery",
    location: "Shimla",
    returnDate: "2024-11-19",
    customerAge: 42,
    customerGender: "Male",
    purchaseChannel: "Online",
    estValue: 2600,
    co2Saved: 1.9,
    landfillAvoided: 0.15,
    recommendedAction: "Repair",
    marketplace: "Titan Store",
    imageUrl: "/placeholder.svg?height=100&width=100",
    customerRating: 3,
    originalPrice: 4499,
    manufacturingDate: "2024-04-25",
    warrantyStatus: "Active",
    repairCost: 350,
    resalePrice: 3800,
    processingTime: 2,
    carbonFootprint: 7.5,
    materialComposition: ["Stainless Steel", "Glass", "Leather"],
    sustainabilityScore: 75,
    returnFrequency: 9,
    seasonality: "Low",
    marketDemand: "Medium",
  },

  /* 028 */
  {
    id: "028",
    sku: "MILTON-BOTTLE-1L-BLU",
    productName: "Milton Thermosteel Bottle 1 L Blue",
    brand: "Milton",
    category: "Home & Kitchen",
    subcategory: "Drinkware",
    condition: "New",
    returnReason: "Size smaller than expected",
    location: "Jammu",
    returnDate: "2024-11-18",
    customerAge: 24,
    customerGender: "Female",
    purchaseChannel: "Mobile App",
    estValue: 550,
    co2Saved: 1.0,
    landfillAvoided: 0.25,
    recommendedAction: "Resale",
    marketplace: "Amazon India",
    imageUrl: "/placeholder.svg?height=100&width=100",
    customerRating: 4,
    originalPrice: 799,
    manufacturingDate: "2024-10-05",
    warrantyStatus: "Active",
    resalePrice: 700,
    processingTime: 1,
    carbonFootprint: 3.5,
    materialComposition: ["Stainless Steel", "Plastic"],
    sustainabilityScore: 78,
    returnFrequency: 12,
    seasonality: "Medium",
    marketDemand: "High",
  },

  /* 029 */
  {
    id: "029",
    sku: "HAWKINS-HANDI-3L-SS",
    productName: "Hawkins Contura Handi 3 L Stainless Steel",
    brand: "Hawkins",
    category: "Home & Kitchen",
    subcategory: "Cookware",
    condition: "Lightly Used",
    returnReason: "Handle heats up",
    location: "Agra",
    returnDate: "2024-11-17",
    customerAge: 31,
    customerGender: "Female",
    purchaseChannel: "Store",
    estValue: 1500,
    co2Saved: 2.6,
    landfillAvoided: 0.9,
    recommendedAction: "Resale",
    marketplace: "Flipkart",
    imageUrl: "/placeholder.svg?height=100&width=100",
    customerRating: 4,
    originalPrice: 2299,
    manufacturingDate: "2024-07-30",
    warrantyStatus: "Active",
    resalePrice: 1900,
    processingTime: 2,
    carbonFootprint: 5.5,
    materialComposition: ["Stainless Steel", "Aluminium"],
    sustainabilityScore: 80,
    returnFrequency: 8,
    seasonality: "Low",
    marketDemand: "High",
  },

  /* 030 */
  {
    id: "030",
    sku: "ORIENT-FAN-1200MM-WHT",
    productName: "Orient Ceiling Fan 1200 mm White",
    brand: "Orient",
    category: "Appliances",
    subcategory: "Cooling",
    condition: "Damaged",
    returnReason: "Blade cracked during installation",
    location: "Varanasi",
    returnDate: "2024-11-16",
    customerAge: 47,
    customerGender: "Male",
    purchaseChannel: "Store",
    estValue: 950,
    co2Saved: 6.5,
    landfillAvoided: 2.5,
    recommendedAction: "Repair",
    marketplace: "Orient Electric",
    imageUrl: "/placeholder.svg?height=100&width=100",
    customerRating: 2,
    originalPrice: 2799,
    manufacturingDate: "2024-05-15",
    warrantyStatus: "Active",
    repairCost: 450,
    resalePrice: 1800,
    processingTime: 3,
    carbonFootprint: 18.0,
    materialComposition: ["Metal", "Plastic", "Copper"],
    sustainabilityScore: 70,
    returnFrequency: 11,
    seasonality: "High",
    marketDemand: "High",
  },
]

/* ----------  A N A L Y T I C S  ---------- */
/* (identical helper functions from the original file) */

export const getComprehensiveAnalytics = () => {
  const totalItems = comprehensiveReturnsData.length
  const totalValue = comprehensiveReturnsData.reduce((s, i) => s + i.estValue, 0)
  const totalCO2 = comprehensiveReturnsData.reduce((s, i) => s + i.co2Saved, 0)
  const totalLandfill = comprehensiveReturnsData.reduce((s, i) => s + i.landfillAvoided, 0)
  const totalOriginal = comprehensiveReturnsData.reduce((s, i) => s + i.originalPrice, 0)

  const reuse = comprehensiveReturnsData.filter((i) => i.recommendedAction === "Resale").length
  const repair = comprehensiveReturnsData.filter((i) => i.recommendedAction === "Repair").length
  const recycle = comprehensiveReturnsData.filter((i) => i.recommendedAction === "Recycle").length

  return {
    totalItems,
    totalValue,
    totalCO2: +totalCO2.toFixed(1),
    totalLandfill: +totalLandfill.toFixed(1),
    valueRecoveryRate: +((totalValue / totalOriginal) * 100).toFixed(1),
    reuseRate: Math.round((reuse / totalItems) * 100),
    repairRate: Math.round((repair / totalItems) * 100),
    recycleRate: Math.round((recycle / totalItems) * 100),
    avgValue: Math.round(totalValue / totalItems),
    avgCO2: +(totalCO2 / totalItems).toFixed(1),
    avgSustainability: Math.round(comprehensiveReturnsData.reduce((s, i) => s + i.sustainabilityScore, 0) / totalItems),
  }
}

/* getCategoryBreakdown, getBrandAnalysis, getLocationInsights, getSeasonalityAnalysis, generateComprehensiveCSV
 – copy/paste the same implementations from the previous (working) version of the file. */

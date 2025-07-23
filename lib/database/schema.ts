// Database Schema Definitions for SmartReturns Backend

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'worker' | 'analyst'
  hubId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Hub {
  id: string
  name: string
  city: string
  state: string
  coordinates: [number, number]
  capacity: number
  currentUtilization: number
  specializations: string[]
  status: 'active' | 'maintenance' | 'offline'
  managerId: string
  createdAt: Date
  updatedAt: Date
}

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  category: string
  subcategory: string
  originalPrice: number
  manufacturingDate: Date
  warrantyPeriod: number
  materialComposition: string[]
  carbonFootprint: number
  createdAt: Date
  updatedAt: Date
}

export interface ReturnItem {
  id: string
  sku: string
  productId: string
  customerId: string
  condition: 'new' | 'lightly-used' | 'good' | 'fair' | 'poor' | 'defective'
  returnReason: string
  returnDate: Date
  location: string
  purchaseChannel: 'online' | 'store' | 'mobile-app'
  customerAge?: number
  customerGender?: 'male' | 'female' | 'other'
  images: string[]
  status: 'received' | 'processing' | 'completed' | 'shipped'
  processedBy?: string
  processedAt?: Date
  hubId?: string
  createdAt: Date
  updatedAt: Date
}

export interface AIRecommendation {
  id: string
  returnItemId: string
  recommendedAction: 'resale' | 'repair' | 'recycle' | 'donate'
  confidence: number
  estimatedValue: number
  co2Saved: number
  landfillAvoided: number
  marketplace?: string
  repairCost?: number
  processingTime: number
  reasoning: string
  modelVersion: string
  createdAt: Date
}

export interface ProcessingWorkflow {
  id: string
  returnItemId: string
  currentStage: 'intake' | 'assessment' | 'ai-analysis' | 'quality-check' | 'disposition' | 'completed'
  stages: WorkflowStage[]
  assignedTo?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  estimatedCompletion: Date
  actualCompletion?: Date
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowStage {
  stage: string
  status: 'pending' | 'in-progress' | 'completed' | 'failed'
  assignedTo?: string
  startedAt?: Date
  completedAt?: Date
  notes?: string
  data?: Record<string, any>
}

export interface QualityCheck {
  id: string
  returnItemId: string
  checkerId: string
  functionalityScore: number
  cosmeticScore: number
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  defects: string[]
  repairRequired: boolean
  repairEstimate?: number
  photos: string[]
  notes: string
  createdAt: Date
}

export interface Disposition {
  id: string
  returnItemId: string
  action: 'resale' | 'repair' | 'recycle' | 'donate'
  marketplace?: string
  finalValue: number
  co2Impact: number
  wasteImpact: number
  completedBy: string
  completedAt: Date
  trackingNumber?: string
  destinationHub?: string
  createdAt: Date
}

export interface ESGMetrics {
  id: string
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'
  startDate: Date
  endDate: Date
  totalItemsProcessed: number
  totalValueRecovered: number
  totalCO2Saved: number
  totalWasteDiverted: number
  resaleRate: number
  repairRate: number
  recycleRate: number
  donationRate: number
  circularityScore: number
  hubId?: string
  createdAt: Date
}

export interface Analytics {
  id: string
  type: 'return-reasons' | 'category-performance' | 'hub-efficiency' | 'seasonal-trends'
  data: Record<string, any>
  insights: string[]
  recommendations: string[]
  generatedAt: Date
  validUntil: Date
}
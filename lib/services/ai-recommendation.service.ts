// AI Recommendation Service - Machine Learning Integration

export interface AIInput {
  sku: string
  condition: string
  returnReason: string
  category: string
  originalPrice: number
  customerAge?: number
  purchaseChannel?: string
  seasonality?: string
  marketDemand?: string
}

export interface AIOutput {
  action: 'resale' | 'repair' | 'recycle' | 'donate'
  confidence: number
  estimatedValue: number
  co2Saved: number
  landfillAvoided: number
  marketplace?: string
  repairCost?: number
  processingTime: number
  reasoning: string
}

export class AIRecommendationService {
  private modelEndpoint: string
  private apiKey: string

  constructor() {
    this.modelEndpoint = process.env.AI_MODEL_ENDPOINT || 'http://localhost:8000/predict'
    this.apiKey = process.env.AI_API_KEY || ''
  }

  /**
   * Get AI recommendation for return item
   */
  async getRecommendation(input: AIInput): Promise<AIOutput> {
    try {
      // Preprocess input data
      const processedInput = await this.preprocessInput(input)
      
      // Call ML model
      const prediction = await this.callMLModel(processedInput)
      
      // Post-process results
      const recommendation = await this.postprocessOutput(prediction, input)
      
      return recommendation
      
    } catch (error) {
      console.error('AI recommendation failed:', error)
      // Fallback to rule-based system
      return this.getRuleBasedRecommendation(input)
    }
  }

  /**
   * Preprocess input for ML model
   */
  private async preprocessInput(input: AIInput): Promise<Record<string, any>> {
    return {
      // Encode categorical variables
      condition_encoded: this.encodeCondition(input.condition),
      category_encoded: this.encodeCategory(input.category),
      reason_encoded: this.encodeReturnReason(input.returnReason),
      
      // Normalize numerical features
      price_normalized: this.normalizePrice(input.originalPrice),
      age_normalized: this.normalizeAge(input.customerAge || 30),
      
      // Feature engineering
      price_category: this.getPriceCategory(input.originalPrice),
      condition_score: this.getConditionScore(input.condition),
      demand_score: this.getDemandScore(input.category, input.seasonality),
      
      // Market context
      market_demand: input.marketDemand || 'medium',
      seasonality: input.seasonality || 'medium',
      purchase_channel: input.purchaseChannel || 'online'
    }
  }

  /**
   * Call ML model endpoint
   */
  private async callMLModel(input: Record<string, any>): Promise<any> {
    const response = await fetch(this.modelEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        features: input,
        model_version: 'v2.1.0'
      })
    })

    if (!response.ok) {
      throw new Error(`ML model request failed: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Post-process ML model output
   */
  private async postprocessOutput(prediction: any, originalInput: AIInput): Promise<AIOutput> {
    const action = this.mapActionFromPrediction(prediction.action_probabilities)
    const confidence = Math.round(prediction.confidence * 100)
    
    // Calculate financial impact
    const estimatedValue = this.calculateEstimatedValue(
      action,
      originalInput.originalPrice,
      originalInput.condition
    )
    
    // Calculate environmental impact
    const co2Saved = this.calculateCO2Impact(action, originalInput.originalPrice)
    const landfillAvoided = this.calculateWasteImpact(action, originalInput.category)
    
    // Determine marketplace
    const marketplace = this.selectOptimalMarketplace(action, originalInput.category, estimatedValue)
    
    // Calculate processing time
    const processingTime = this.estimateProcessingTime(action, originalInput.category)
    
    // Generate reasoning
    const reasoning = this.generateReasoning(action, originalInput, confidence)

    return {
      action,
      confidence,
      estimatedValue,
      co2Saved,
      landfillAvoided,
      marketplace,
      repairCost: action === 'repair' ? this.estimateRepairCost(originalInput) : undefined,
      processingTime,
      reasoning
    }
  }

  /**
   * Fallback rule-based recommendation system
   */
  private getRuleBasedRecommendation(input: AIInput): AIOutput {
    let action: AIOutput['action'] = 'recycle'
    let estimatedValue = 0
    let marketplace = undefined

    // Rule-based logic
    if (input.condition === 'new') {
      action = 'resale'
      estimatedValue = Math.round(input.originalPrice * 0.7)
      marketplace = 'Flipkart'
    } else if (input.condition === 'lightly-used' || input.condition === 'good') {
      action = 'resale'
      estimatedValue = Math.round(input.originalPrice * 0.45)
      marketplace = 'Flipkart 2GUD'
    } else if (input.condition === 'fair' && input.originalPrice > 2000) {
      action = 'repair'
      estimatedValue = Math.round(input.originalPrice * 0.25)
    } else if (input.condition === 'poor' || input.condition === 'defective') {
      action = input.category === 'Electronics' ? 'recycle' : 'donate'
      estimatedValue = 0
    }

    return {
      action,
      confidence: 75, // Lower confidence for rule-based
      estimatedValue,
      co2Saved: this.calculateCO2Impact(action, input.originalPrice),
      landfillAvoided: this.calculateWasteImpact(action, input.category),
      marketplace,
      processingTime: this.estimateProcessingTime(action, input.category),
      reasoning: `Rule-based recommendation: ${input.condition} condition ${input.category} item`
    }
  }

  // Helper methods for encoding and calculations
  private encodeCondition(condition: string): number {
    const mapping = { 'new': 5, 'lightly-used': 4, 'good': 3, 'fair': 2, 'poor': 1, 'defective': 0 }
    return mapping[condition as keyof typeof mapping] || 0
  }

  private encodeCategory(category: string): number {
    const mapping = { 'Electronics': 0, 'Fashion': 1, 'Home & Kitchen': 2, 'Appliances': 3 }
    return mapping[category as keyof typeof mapping] || 0
  }

  private encodeReturnReason(reason: string): number {
    // Simplified encoding - in production, use proper categorical encoding
    return reason.length % 10
  }

  private normalizePrice(price: number): number {
    // Min-max normalization (assuming price range 0-100000)
    return Math.min(price / 100000, 1)
  }

  private normalizeAge(age: number): number {
    // Normalize age (assuming range 18-80)
    return Math.max(0, Math.min((age - 18) / 62, 1))
  }

  private getPriceCategory(price: number): string {
    if (price < 1000) return 'low'
    if (price < 5000) return 'medium'
    if (price < 20000) return 'high'
    return 'premium'
  }

  private getConditionScore(condition: string): number {
    return this.encodeCondition(condition) / 5
  }

  private getDemandScore(category: string, seasonality?: string): number {
    const baseScore = category === 'Electronics' ? 0.8 : category === 'Fashion' ? 0.6 : 0.5
    const seasonalMultiplier = seasonality === 'high' ? 1.2 : seasonality === 'low' ? 0.8 : 1.0
    return Math.min(baseScore * seasonalMultiplier, 1)
  }

  private mapActionFromPrediction(probabilities: Record<string, number>): AIOutput['action'] {
    const maxProb = Math.max(...Object.values(probabilities))
    const action = Object.keys(probabilities).find(key => probabilities[key] === maxProb)
    return (action as AIOutput['action']) || 'recycle'
  }

  private calculateEstimatedValue(action: string, originalPrice: number, condition: string): number {
    const conditionMultiplier = {
      'new': 0.7,
      'lightly-used': 0.45,
      'good': 0.35,
      'fair': 0.25,
      'poor': 0.1,
      'defective': 0
    }

    const actionMultiplier = {
      'resale': 1.0,
      'repair': 0.6,
      'recycle': 0.05,
      'donate': 0
    }

    const conditionFactor = conditionMultiplier[condition as keyof typeof conditionMultiplier] || 0
    const actionFactor = actionMultiplier[action as keyof typeof actionMultiplier] || 0

    return Math.round(originalPrice * conditionFactor * actionFactor)
  }

  private calculateCO2Impact(action: string, originalPrice: number): number {
    const co2PerRupee = {
      'resale': 0.002,
      'repair': 0.0015,
      'recycle': 0.001,
      'donate': 0.0018
    }

    const factor = co2PerRupee[action as keyof typeof co2PerRupee] || 0.001
    return Math.round(originalPrice * factor * 100) / 100
  }

  private calculateWasteImpact(action: string, category: string): number {
    const baseWaste = category === 'Electronics' ? 0.5 : category === 'Appliances' ? 2.0 : 0.3
    const wasteMultiplier = {
      'resale': 0.9,
      'repair': 0.7,
      'recycle': 0.3,
      'donate': 0.8
    }

    const multiplier = wasteMultiplier[action as keyof typeof wasteMultiplier] || 0.5
    return Math.round(baseWaste * multiplier * 100) / 100
  }

  private selectOptimalMarketplace(action: string, category: string, value: number): string | undefined {
    if (action !== 'resale') return undefined

    if (value > 10000) return 'Flipkart'
    if (value > 2000) return 'Flipkart 2GUD'
    if (category === 'Fashion') return 'Myntra'
    return 'Amazon Renewed'
  }

  private estimateProcessingTime(action: string, category: string): number {
    const baseTimes = {
      'resale': 1,
      'repair': 3,
      'recycle': 1,
      'donate': 2
    }

    const categoryMultiplier = category === 'Electronics' ? 1.2 : 1.0
    return Math.round((baseTimes[action as keyof typeof baseTimes] || 2) * categoryMultiplier)
  }

  private estimateRepairCost(input: AIInput): number {
    const baseCost = input.originalPrice * 0.15
    const conditionMultiplier = input.condition === 'fair' ? 1.0 : 1.5
    return Math.round(baseCost * conditionMultiplier)
  }

  private generateReasoning(action: string, input: AIInput, confidence: number): string {
    const reasons = {
      'resale': `Item in ${input.condition} condition suitable for resale. ${input.category} has good market demand.`,
      'repair': `Item can be economically repaired. Repair cost justified by potential resale value.`,
      'recycle': `Item beyond economical repair. Materials can be responsibly recycled.`,
      'donate': `Item has social value despite condition. Partner organizations can utilize effectively.`
    }

    const baseReason = reasons[action as keyof typeof reasons] || 'Standard processing recommended.'
    return `${baseReason} Confidence: ${confidence}%`
  }
}
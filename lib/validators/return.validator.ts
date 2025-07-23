// Return Validation Schemas - Input validation using Zod

import { z } from 'zod'

// Base schemas
export const SkuSchema = z.string()
  .min(3, 'SKU must be at least 3 characters')
  .max(50, 'SKU must not exceed 50 characters')
  .regex(/^[A-Z0-9-_]+$/, 'SKU must contain only uppercase letters, numbers, hyphens, and underscores')

export const ConditionSchema = z.enum([
  'new',
  'lightly-used', 
  'good',
  'fair',
  'poor',
  'defective'
], {
  errorMap: () => ({ message: 'Invalid condition. Must be one of: new, lightly-used, good, fair, poor, defective' })
})

export const CategorySchema = z.enum([
  'Electronics',
  'Fashion',
  'Home & Kitchen',
  'Appliances',
  'Books',
  'Sports',
  'Toys',
  'Beauty',
  'Automotive'
])

export const LocationSchema = z.string()
  .min(2, 'Location must be at least 2 characters')
  .max(100, 'Location must not exceed 100 characters')

// Return creation schema
export const CreateReturnSchema = z.object({
  sku: SkuSchema,
  productName: z.string()
    .min(1, 'Product name is required')
    .max(200, 'Product name must not exceed 200 characters'),
  condition: ConditionSchema,
  returnReason: z.string()
    .min(5, 'Return reason must be at least 5 characters')
    .max(500, 'Return reason must not exceed 500 characters'),
  location: LocationSchema,
  customerId: z.string()
    .uuid('Invalid customer ID format'),
  purchaseChannel: z.enum(['online', 'store', 'mobile-app']).optional(),
  customerAge: z.number()
    .int('Age must be an integer')
    .min(13, 'Customer must be at least 13 years old')
    .max(120, 'Invalid age')
    .optional(),
  customerGender: z.enum(['male', 'female', 'other']).optional(),
  images: z.array(z.string().url('Invalid image URL')).optional(),
  returnDate: z.string()
    .datetime('Invalid date format')
    .optional()
    .transform(val => val ? new Date(val) : new Date()),
  originalPrice: z.number()
    .positive('Original price must be positive')
    .max(10000000, 'Original price seems too high')
    .optional(),
  purchaseDate: z.string()
    .datetime('Invalid purchase date format')
    .optional()
    .transform(val => val ? new Date(val) : undefined),
  warrantyStatus: z.enum(['active', 'expired', 'n/a']).optional(),
  defects: z.array(z.string()).optional(),
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
})

// Return update schema
export const UpdateReturnSchema = z.object({
  status: z.enum(['received', 'processing', 'completed', 'shipped', 'cancelled']).optional(),
  hubId: z.string().uuid('Invalid hub ID').optional(),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
  notes: z.string().max(1000, 'Notes must not exceed 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional()
})

// Quality check schema
export const QualityCheckSchema = z.object({
  returnItemId: z.string().uuid('Invalid return item ID'),
  checkerId: z.string().uuid('Invalid checker ID'),
  functionalityScore: z.number()
    .int('Functionality score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  cosmeticScore: z.number()
    .int('Cosmetic score must be an integer')
    .min(0, 'Score cannot be negative')
    .max(100, 'Score cannot exceed 100'),
  defects: z.array(z.string())
    .max(20, 'Too many defects listed'),
  repairRequired: z.boolean(),
  repairEstimate: z.number()
    .positive('Repair estimate must be positive')
    .optional(),
  photos: z.array(z.string().url('Invalid photo URL'))
    .max(10, 'Maximum 10 photos allowed'),
  notes: z.string()
    .max(2000, 'Notes must not exceed 2000 characters')
    .optional()
})

// Disposition schema
export const DispositionSchema = z.object({
  returnItemId: z.string().uuid('Invalid return item ID'),
  action: z.enum(['resale', 'repair', 'recycle', 'donate']),
  marketplace: z.string()
    .max(100, 'Marketplace name too long')
    .optional(),
  finalValue: z.number()
    .min(0, 'Final value cannot be negative'),
  co2Impact: z.number()
    .min(0, 'CO2 impact cannot be negative'),
  wasteImpact: z.number()
    .min(0, 'Waste impact cannot be negative'),
  completedBy: z.string().uuid('Invalid user ID'),
  trackingNumber: z.string()
    .max(100, 'Tracking number too long')
    .optional(),
  destinationHub: z.string()
    .max(100, 'Destination hub name too long')
    .optional(),
  notes: z.string()
    .max(1000, 'Notes must not exceed 1000 characters')
    .optional()
})

// AI recommendation input schema
export const AIRecommendationInputSchema = z.object({
  sku: SkuSchema,
  condition: ConditionSchema,
  returnReason: z.string().min(1, 'Return reason is required'),
  category: CategorySchema,
  originalPrice: z.number().positive('Original price must be positive'),
  customerAge: z.number().int().min(13).max(120).optional(),
  purchaseChannel: z.enum(['online', 'store', 'mobile-app']).optional(),
  seasonality: z.enum(['high', 'medium', 'low']).optional(),
  marketDemand: z.enum(['high', 'medium', 'low']).optional()
})

// Hub assignment schema
export const HubAssignmentSchema = z.object({
  returnItemId: z.string().uuid('Invalid return item ID'),
  hubId: z.string().uuid('Invalid hub ID'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  estimatedArrival: z.string()
    .datetime('Invalid arrival date format')
    .transform(val => new Date(val)),
  specialInstructions: z.string()
    .max(500, 'Instructions too long')
    .optional()
})

// Analytics query schema
export const AnalyticsQuerySchema = z.object({
  startDate: z.string()
    .datetime('Invalid start date format')
    .transform(val => new Date(val)),
  endDate: z.string()
    .datetime('Invalid end date format')
    .transform(val => new Date(val)),
  hubIds: z.array(z.string().uuid()).optional(),
  categories: z.array(CategorySchema).optional(),
  actions: z.array(z.enum(['resale', 'repair', 'recycle', 'donate'])).optional(),
  groupBy: z.enum(['day', 'week', 'month', 'quarter']).optional()
}).refine(
  data => data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
).refine(
  data => {
    const daysDiff = (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 365
  },
  {
    message: 'Date range cannot exceed 365 days',
    path: ['endDate']
  }
)

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number()
    .int('Page must be an integer')
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.number()
    .int('Limit must be an integer')
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit cannot exceed 100')
    .default(20)
})

// Search and filter schema
export const SearchFilterSchema = z.object({
  search: z.string()
    .max(200, 'Search term too long')
    .optional(),
  status: z.enum(['received', 'processing', 'completed', 'shipped', 'cancelled']).optional(),
  category: CategorySchema.optional(),
  condition: ConditionSchema.optional(),
  hubId: z.string().uuid('Invalid hub ID').optional(),
  assignedTo: z.string().uuid('Invalid user ID').optional(),
  startDate: z.string()
    .datetime('Invalid start date')
    .transform(val => new Date(val))
    .optional(),
  endDate: z.string()
    .datetime('Invalid end date')
    .transform(val => new Date(val))
    .optional(),
  minValue: z.number().min(0).optional(),
  maxValue: z.number().min(0).optional(),
  sortBy: z.enum([
    'createdAt',
    'returnDate', 
    'estValue',
    'co2Saved',
    'status',
    'priority'
  ]).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc')
}).refine(
  data => !data.startDate || !data.endDate || data.endDate > data.startDate,
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
).refine(
  data => !data.minValue || !data.maxValue || data.maxValue > data.minValue,
  {
    message: 'Max value must be greater than min value',
    path: ['maxValue']
  }
)

// Bulk operation schema
export const BulkReturnSchema = z.object({
  returns: z.array(CreateReturnSchema)
    .min(1, 'At least one return is required')
    .max(100, 'Maximum 100 returns per batch'),
  validateOnly: z.boolean().default(false),
  continueOnError: z.boolean().default(false)
})

// Export schema
export const ExportSchema = z.object({
  format: z.enum(['csv', 'xlsx', 'json', 'pdf']),
  filters: SearchFilterSchema.optional(),
  fields: z.array(z.string()).optional(),
  includeImages: z.boolean().default(false),
  compression: z.boolean().default(false)
})

// Validation helper functions
export function validateReturn(data: unknown) {
  return CreateReturnSchema.safeParse(data)
}

export function validateQualityCheck(data: unknown) {
  return QualityCheckSchema.safeParse(data)
}

export function validateDisposition(data: unknown) {
  return DispositionSchema.safeParse(data)
}

export function validateAnalyticsQuery(data: unknown) {
  return AnalyticsQuerySchema.safeParse(data)
}

export function validatePagination(data: unknown) {
  return PaginationSchema.safeParse(data)
}

export function validateSearchFilter(data: unknown) {
  return SearchFilterSchema.safeParse(data)
}

// Custom validation rules
export const CustomValidators = {
  // Check if SKU exists in product catalog
  skuExists: async (sku: string): Promise<boolean> => {
    // Implementation would check database
    return true
  },

  // Check if customer exists
  customerExists: async (customerId: string): Promise<boolean> => {
    // Implementation would check database
    return true
  },

  // Check if hub exists and is active
  hubActive: async (hubId: string): Promise<boolean> => {
    // Implementation would check database
    return true
  },

  // Check if user has permission for hub
  userHubPermission: async (userId: string, hubId: string): Promise<boolean> => {
    // Implementation would check permissions
    return true
  },

  // Validate return reason against common patterns
  validateReturnReason: (reason: string): boolean => {
    const suspiciousPatterns = [
      /test/i,
      /fake/i,
      /dummy/i,
      /^.{1,3}$/ // Too short
    ]

    return !suspiciousPatterns.some(pattern => pattern.test(reason))
  },

  // Check for duplicate returns
  checkDuplicateReturn: async (sku: string, customerId: string, days: number = 7): Promise<boolean> => {
    // Implementation would check for recent returns of same item by same customer
    return false
  }
}

// Validation middleware factory
export function createValidationMiddleware<T>(schema: z.ZodSchema<T>) {
  return (data: unknown): T => {
    const result = schema.safeParse(data)
    
    if (!result.success) {
      throw new ValidationError(
        result.error.errors.map(err => ({
          code: err.code,
          field: err.path.join('.'),
          message: err.message
        }))
      )
    }

    return result.data
  }
}

// Type exports for use in other files
export type CreateReturnInput = z.infer<typeof CreateReturnSchema>
export type UpdateReturnInput = z.infer<typeof UpdateReturnSchema>
export type QualityCheckInput = z.infer<typeof QualityCheckSchema>
export type DispositionInput = z.infer<typeof DispositionSchema>
export type AIRecommendationInput = z.infer<typeof AIRecommendationInputSchema>
export type AnalyticsQueryInput = z.infer<typeof AnalyticsQuerySchema>
export type PaginationInput = z.infer<typeof PaginationSchema>
export type SearchFilterInput = z.infer<typeof SearchFilterSchema>

class ValidationError extends Error {
  constructor(public details: Array<{ code: string; field: string; message: string }>) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}
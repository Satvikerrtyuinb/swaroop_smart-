// API Response Utilities - Standardized response formatting

import { NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    timestamp: string
    requestId: string
    version: string
    pagination?: PaginationMeta
  }
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface ErrorDetails {
  code: string
  field?: string
  message: string
}

/**
 * Success response helper
 */
export function successResponse<T>(
  data: T,
  message?: string,
  meta?: Partial<ApiResponse['meta']>
): NextResponse {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      version: '1.0.0',
      ...meta
    }
  }

  return NextResponse.json(response)
}

/**
 * Error response helper
 */
export function errorResponse(
  error: string,
  status: number = 500,
  details?: ErrorDetails[]
): NextResponse {
  const response: ApiResponse = {
    success: false,
    error,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      version: '1.0.0'
    }
  }

  if (details) {
    (response as any).details = details
  }

  return NextResponse.json(response, { status })
}

/**
 * Paginated response helper
 */
export function paginatedResponse<T>(
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
  },
  message?: string
): NextResponse {
  const pages = Math.ceil(pagination.total / pagination.limit)
  
  const paginationMeta: PaginationMeta = {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    pages,
    hasNext: pagination.page < pages,
    hasPrev: pagination.page > 1
  }

  return successResponse(data, message, { pagination: paginationMeta })
}

/**
 * Validation error response
 */
export function validationErrorResponse(errors: ErrorDetails[]): NextResponse {
  return errorResponse(
    'Validation failed',
    400,
    errors
  )
}

/**
 * Not found response
 */
export function notFoundResponse(resource: string = 'Resource'): NextResponse {
  return errorResponse(`${resource} not found`, 404)
}

/**
 * Unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse {
  return errorResponse(message, 401)
}

/**
 * Forbidden response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse {
  return errorResponse(message, 403)
}

/**
 * Rate limit response
 */
export function rateLimitResponse(retryAfter: number): NextResponse {
  const response = errorResponse('Rate limit exceeded', 429)
  response.headers.set('Retry-After', retryAfter.toString())
  return response
}

/**
 * Server error response
 */
export function serverErrorResponse(message: string = 'Internal server error'): NextResponse {
  return errorResponse(message, 500)
}

/**
 * Created response helper
 */
export function createdResponse<T>(data: T, message?: string): NextResponse {
  const response = successResponse(data, message || 'Resource created successfully')
  response.headers.set('status', '201')
  return response
}

/**
 * No content response
 */
export function noContentResponse(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

/**
 * Async response wrapper with error handling
 */
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      
      if (error instanceof ValidationError) {
        return validationErrorResponse(error.details)
      }
      
      if (error instanceof NotFoundError) {
        return notFoundResponse(error.resource)
      }
      
      if (error instanceof UnauthorizedError) {
        return unauthorizedResponse(error.message)
      }
      
      if (error instanceof ForbiddenError) {
        return forbiddenResponse(error.message)
      }
      
      return serverErrorResponse(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }
}

/**
 * Response timing middleware
 */
export function withTiming<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const startTime = Date.now()
    const response = await handler(...args)
    const duration = Date.now() - startTime
    
    response.headers.set('X-Response-Time', `${duration}ms`)
    return response
  }
}

/**
 * Request logging middleware
 */
export function withLogging<T extends any[], R>(
  handler: (...args: T) => Promise<NextResponse>
) {
  return async (...args: T): Promise<NextResponse> => {
    const request = args[0] as Request
    const startTime = Date.now()
    
    console.log(`${request.method} ${request.url} - Started`)
    
    const response = await handler(...args)
    const duration = Date.now() - startTime
    
    console.log(`${request.method} ${request.url} - ${response.status} (${duration}ms)`)
    
    return response
  }
}

// Custom error classes
export class ValidationError extends Error {
  constructor(public details: ErrorDetails[]) {
    super('Validation failed')
    this.name = 'ValidationError'
  }
}

export class NotFoundError extends Error {
  constructor(public resource: string = 'Resource') {
    super(`${resource} not found`)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends Error {
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = 'Forbidden') {
    super(message)
    this.name = 'ForbiddenError'
  }
}

// Utility functions
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Response composition utilities
export class ResponseBuilder {
  private response: Partial<ApiResponse> = { success: true }

  static create(): ResponseBuilder {
    return new ResponseBuilder()
  }

  data<T>(data: T): ResponseBuilder {
    this.response.data = data
    return this
  }

  message(message: string): ResponseBuilder {
    this.response.message = message
    return this
  }

  error(error: string): ResponseBuilder {
    this.response.success = false
    this.response.error = error
    return this
  }

  meta(meta: Partial<ApiResponse['meta']>): ResponseBuilder {
    this.response.meta = {
      timestamp: new Date().toISOString(),
      requestId: generateRequestId(),
      version: '1.0.0',
      ...meta
    }
    return this
  }

  build(status: number = 200): NextResponse {
    if (!this.response.meta) {
      this.meta({})
    }

    return NextResponse.json(this.response, { status })
  }
}

// Usage examples:
/*
// Success response
return successResponse({ id: 1, name: 'Item' }, 'Item retrieved successfully')

// Error response
return errorResponse('Item not found', 404)

// Paginated response
return paginatedResponse(items, { page: 1, limit: 10, total: 100 })

// Using builder pattern
return ResponseBuilder.create()
  .data({ id: 1, name: 'Item' })
  .message('Success')
  .meta({ pagination: { page: 1, limit: 10, total: 100 } })
  .build(200)

// With error handling wrapper
export const getItems = withErrorHandling(async (request: NextRequest) => {
  const items = await itemService.getAll()
  return successResponse(items)
})
*/
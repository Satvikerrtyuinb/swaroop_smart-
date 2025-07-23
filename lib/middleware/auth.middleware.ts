// Authentication and Authorization Middleware

import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'manager' | 'worker' | 'analyst'
  hubId?: string
  permissions: string[]
}

export interface AuthRequest extends NextRequest {
  user?: AuthUser
}

/**
 * JWT Authentication Middleware
 */
export function authMiddleware(requiredRole?: string) {
  return async (request: AuthRequest): Promise<NextResponse | void> => {
    try {
      // Extract token from Authorization header
      const authHeader = request.headers.get('authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Missing or invalid authorization header' },
          { status: 401 }
        )
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
      
      // Get user details from database
      const user = await getUserById(decoded.userId)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }

      // Check role permissions
      if (requiredRole && !hasRequiredRole(user.role, requiredRole)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }

      // Attach user to request
      request.user = user

    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  }
}

/**
 * API Key Authentication Middleware
 */
export function apiKeyMiddleware() {
  return async (request: NextRequest): Promise<NextResponse | void> => {
    const apiKey = request.headers.get('x-api-key')
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key required' },
        { status: 401 }
      )
    }

    const isValid = await validateApiKey(apiKey)
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      )
    }
  }
}

/**
 * Rate Limiting Middleware
 */
export function rateLimitMiddleware(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>()

  return async (request: NextRequest): Promise<NextResponse | void> => {
    const clientId = getClientId(request)
    const now = Date.now()
    
    const clientData = requests.get(clientId)
    
    if (!clientData || now > clientData.resetTime) {
      // Reset or initialize counter
      requests.set(clientId, {
        count: 1,
        resetTime: now + windowMs
      })
      return
    }

    if (clientData.count >= maxRequests) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          retryAfter: Math.ceil((clientData.resetTime - now) / 1000)
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((clientData.resetTime - now) / 1000).toString()
          }
        }
      )
    }

    clientData.count++
  }
}

/**
 * Request Validation Middleware
 */
export function validateRequest(schema: any) {
  return async (request: NextRequest): Promise<NextResponse | void> => {
    try {
      const body = await request.json()
      const validationResult = schema.safeParse(body)
      
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            details: validationResult.error.errors
          },
          { status: 400 }
        )
      }

      // Attach validated data to request
      ;(request as any).validatedData = validationResult.data

    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }
  }
}

/**
 * CORS Middleware
 */
export function corsMiddleware() {
  return async (request: NextRequest): Promise<NextResponse | void> => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-API-Key',
          'Access-Control-Max-Age': '86400'
        }
      })
    }
  }
}

// Helper functions
async function getUserById(userId: string): Promise<AuthUser | null> {
  // Database query to get user
  // Implementation depends on database choice
  return null
}

function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'admin': 4,
    'manager': 3,
    'worker': 2,
    'analyst': 1
  }

  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

  return userLevel >= requiredLevel
}

async function validateApiKey(apiKey: string): Promise<boolean> {
  // Validate API key against database
  // Implementation depends on database choice
  return false
}

function getClientId(request: NextRequest): string {
  // Get client identifier (IP address, user ID, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip
  return ip || 'unknown'
}

// Middleware composition utility
export function composeMiddleware(...middlewares: Array<(req: NextRequest) => Promise<NextResponse | void>>) {
  return async (request: NextRequest): Promise<NextResponse | void> => {
    for (const middleware of middlewares) {
      const result = await middleware(request)
      if (result) return result // If middleware returns a response, stop execution
    }
  }
}
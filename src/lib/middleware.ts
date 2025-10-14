import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  userId?: number;
  userEmail?: string;
  userRole?: string;
}

// Middleware to verify JWT authentication
export async function requireAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Extract token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.userId = payload.userId;
    authenticatedRequest.userEmail = payload.email;
    authenticatedRequest.userRole = payload.role;

    // Call the handler
    return handler(authenticatedRequest);
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
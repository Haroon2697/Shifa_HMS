import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Dynamically import the updateSession function
    const { updateSession } = await import('./lib/supabase/middleware')
    return await updateSession(request)
  } catch (error) {
    console.error('Middleware error:', error)
    // Return the original response if Supabase fails
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

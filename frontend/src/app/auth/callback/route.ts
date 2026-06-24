import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')
  const role = searchParams.get('role')

  if (!token || !role) {
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url))
  }

  const destination = role === 'validator' ? '/validate' : '/request'
  const response = NextResponse.redirect(new URL(destination, request.url))

  response.cookies.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8h
    path: '/',
  })

  return response
}

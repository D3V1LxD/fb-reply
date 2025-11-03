import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // Get credentials from environment variables
    const validUsername = process.env.ADMIN_USERNAME || 'admin'
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123'

    // Validate credentials
    if (username === validUsername && password === validPassword) {
      // Generate a simple token (in production, use JWT or similar)
      const token = Buffer.from(`${username}:${Date.now()}`).toString('base64')

      return NextResponse.json({
        success: true,
        token,
        user: { username },
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    )
  }
}

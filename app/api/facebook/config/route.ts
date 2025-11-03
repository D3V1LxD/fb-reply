import { NextRequest, NextResponse } from 'next/server'
import { getFacebookConfig, saveFacebookConfig } from '@/lib/storage'

export async function GET() {
  try {
    const config = await getFacebookConfig()
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Error loading Facebook config:', error)
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()

    if (!config.pageId || !config.accessToken || !config.verifyToken) {
      return NextResponse.json(
        { error: 'Page ID, Access Token, and Verify Token are required' },
        { status: 400 }
      )
    }

    await saveFacebookConfig(config)

    return NextResponse.json({ 
      success: true, 
      message: 'Configuration saved successfully' 
    })
  } catch (error) {
    console.error('Error saving Facebook config:', error)
    return NextResponse.json(
      { error: 'Failed to save configuration' },
      { status: 500 }
    )
  }
}

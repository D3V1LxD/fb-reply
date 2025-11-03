import { NextRequest, NextResponse } from 'next/server'
import { getFacebookConfig } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const config = await getFacebookConfig()

    if (!config || !config.pageId || !config.accessToken) {
      return NextResponse.json(
        { error: 'Facebook integration not configured' },
        { status: 400 }
      )
    }

    // Test the Page Access Token by making a simple Graph API call
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${config.pageId}?fields=name,id&access_token=${config.accessToken}`
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: `Facebook API Error: ${error.error?.message || 'Invalid token'}` },
        { status: 400 }
      )
    }

    const pageData = await response.json()

    return NextResponse.json({ 
      success: true, 
      message: 'Webhook is configured correctly',
      pageData
    })
  } catch (error: any) {
    console.error('Error testing webhook:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to test webhook' },
      { status: 500 }
    )
  }
}

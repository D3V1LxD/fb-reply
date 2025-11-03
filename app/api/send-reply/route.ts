import { NextRequest, NextResponse } from 'next/server'
import { getSentReplies, saveSentReplies } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { message, reply, mode } = await request.json()

    if (!message || !reply) {
      return NextResponse.json(
        { error: 'Message and reply are required' },
        { status: 400 }
      )
    }

    if (!mode || (mode !== 'ai' && mode !== 'manual')) {
      return NextResponse.json(
        { error: 'Valid mode is required (ai or manual)' },
        { status: 400 }
      )
    }

    const sentReplies = await getSentReplies()
    
    const newEntry = {
      id: Date.now().toString(),
      message: message.trim(),
      reply: reply.trim(),
      mode,
      timestamp: new Date().toISOString(),
    }

    sentReplies.unshift(newEntry) // Add to beginning of array
    await saveSentReplies(sentReplies)

    return NextResponse.json({ 
      success: true, 
      message: 'Reply sent successfully',
      data: newEntry
    })
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const sentReplies = await getSentReplies()
    return NextResponse.json({ data: sentReplies })
  } catch (error) {
    console.error('Error fetching sent replies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sent replies' },
      { status: 500 }
    )
  }
}

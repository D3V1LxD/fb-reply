import { NextRequest, NextResponse } from 'next/server'
import { getTrainingData, saveTrainingData } from '@/lib/storage'

export async function POST(request: NextRequest) {
  try {
    const { message, reply } = await request.json()

    if (!message || !reply) {
      return NextResponse.json(
        { error: 'Message and reply are required' },
        { status: 400 }
      )
    }

    const trainingData = await getTrainingData()
    
    const newEntry = {
      id: Date.now().toString(),
      message: message.trim(),
      reply: reply.trim(),
      timestamp: new Date().toISOString(),
    }

    trainingData.push(newEntry)
    await saveTrainingData(trainingData)

    return NextResponse.json({ 
      success: true, 
      message: 'Training data added successfully',
      data: newEntry
    })
  } catch (error) {
    console.error('Error adding training data:', error)
    return NextResponse.json(
      { error: 'Failed to add training data' },
      { status: 500 }
    )
  }
}

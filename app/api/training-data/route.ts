import { NextRequest, NextResponse } from 'next/server'
import { getTrainingData, saveTrainingData } from '@/lib/storage'

export async function GET() {
  try {
    const trainingData = await getTrainingData()
    return NextResponse.json({ data: trainingData })
  } catch (error) {
    console.error('Error fetching training data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training data' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      )
    }

    const trainingData = await getTrainingData()
    const filteredData = trainingData.filter((item) => item.id !== id)
    
    await saveTrainingData(filteredData)

    return NextResponse.json({ 
      success: true, 
      message: 'Training data deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting training data:', error)
    return NextResponse.json(
      { error: 'Failed to delete training data' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, message, reply } = await request.json()

    if (!id || !message || !reply) {
      return NextResponse.json(
        { error: 'ID, message, and reply are required' },
        { status: 400 }
      )
    }

    const trainingData = await getTrainingData()
    const index = trainingData.findIndex((item) => item.id === id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Training data not found' },
        { status: 404 }
      )
    }

    trainingData[index] = {
      ...trainingData[index],
      message: message.trim(),
      reply: reply.trim(),
      timestamp: new Date().toISOString(),
    }

    await saveTrainingData(trainingData)

    return NextResponse.json({ 
      success: true, 
      message: 'Training data updated successfully',
      data: trainingData[index]
    })
  } catch (error) {
    console.error('Error updating training data:', error)
    return NextResponse.json(
      { error: 'Failed to update training data' },
      { status: 500 }
    )
  }
}

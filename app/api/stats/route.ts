import { NextResponse } from 'next/server'
import { getTrainingData } from '@/lib/storage'

export async function GET() {
  try {
    const trainingData = await getTrainingData()
    
    const stats = {
      totalTrainingData: trainingData.length,
      lastUpdated: trainingData.length > 0 
        ? new Date(trainingData[trainingData.length - 1].timestamp).toLocaleDateString()
        : 'Never',
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

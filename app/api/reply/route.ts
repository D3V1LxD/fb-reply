import { NextRequest, NextResponse } from 'next/server'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { getTrainingData } from '@/lib/storage'

// Create GitHub-compatible OpenAI client
const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN || '',
})

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.GITHUB_TOKEN && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'GitHub token or OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Get training data
    const trainingData = await getTrainingData()

    // Create context from training data
    const trainingContext = trainingData
      .map((item) => `User: ${item.message}\nAssistant: ${item.reply}`)
      .join('\n\n')

    const systemPrompt = `You are a helpful AI assistant trained to respond to messages based on the following examples. Use these examples to understand the tone and style of responses expected, and generate appropriate replies for similar messages.

Training Examples:
${trainingContext}

When responding:
1. Use the training examples to understand the expected response style
2. Generate a response that matches the tone and format of the training data
3. Be helpful and contextually appropriate
4. If the message is similar to a training example, provide a similar style response
5. Keep responses concise and relevant`

    // Use GitHub's GPT-4o model
    const result = await generateText({
      model: github('gpt-4o'),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
    })

    const reply = result.text || 'I apologize, but I could not generate a response.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('Error generating reply:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate reply' },
      { status: 500 }
    )
  }
}

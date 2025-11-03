import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { getTrainingData } from '@/lib/storage'

// Create GitHub-compatible OpenAI client
const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN || '',
})

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get training data to use as context
    const trainingData = await getTrainingData()
    
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
    const result = await streamText({
      model: github('gpt-4o'),
      system: systemPrompt,
      messages: messages,
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('Error in chat API:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

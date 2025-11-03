import { NextRequest, NextResponse } from 'next/server'
import { getFacebookConfig, saveWebhookLog } from '@/lib/storage'
import { getTrainingData } from '@/lib/storage'
import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Create GitHub-compatible OpenAI client
const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN || '',
})

// GET method for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  console.log('Webhook verification request:', { mode, token, challenge })

  if (mode === 'subscribe') {
    const config = await getFacebookConfig()
    
    if (token === config?.verifyToken) {
      console.log('Webhook verified successfully')
      return new NextResponse(challenge, { status: 200 })
    } else {
      console.log('Verification failed: token mismatch')
      return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 })
    }
  }

  return NextResponse.json({ error: 'Invalid verification request' }, { status: 400 })
}

// POST method for receiving messages
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Webhook received:', JSON.stringify(body, null, 2))

    // Log webhook event
    await saveWebhookLog({
      timestamp: new Date().toISOString(),
      type: 'incoming',
      data: body
    })

    if (body.object === 'page') {
      for (const entry of body.entry) {
        for (const event of entry.messaging) {
          if (event.message && !event.message.is_echo) {
            await handleMessage(event)
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleMessage(event: any) {
  const senderId = event.sender.id
  const messageText = event.message.text

  if (!messageText) return

  console.log(`Received message from ${senderId}: ${messageText}`)

  try {
    // Generate AI reply
    const reply = await generateReply(messageText)

    // Send reply back to Facebook
    await sendFacebookMessage(senderId, reply)

    // Log the interaction
    await saveWebhookLog({
      timestamp: new Date().toISOString(),
      type: 'reply',
      data: {
        senderId,
        message: messageText,
        reply
      }
    })
  } catch (error) {
    console.error('Error handling message:', error)
  }
}

async function generateReply(message: string): Promise<string> {
  try {
    if (!process.env.GITHUB_TOKEN && !process.env.OPENAI_API_KEY) {
      return "Thank you for your message. We'll get back to you soon!"
    }

    const trainingData = await getTrainingData()
    
    const trainingContext = trainingData
      .map((item) => `User: ${item.message}\nAssistant: ${item.reply}`)
      .join('\n\n')

    const systemPrompt = `You are a helpful AI assistant for a Facebook Page. Use these training examples to understand the expected response style:

${trainingContext}

When responding:
1. Use the training examples to understand the expected response style
2. Generate a response that matches the tone and format of the training data
3. Be helpful, friendly, and professional
4. Keep responses concise and relevant for Facebook Messenger
5. If the message is similar to a training example, provide a similar style response`

    // Use GitHub's GPT-4o model
    const result = await generateText({
      model: github('gpt-4o'),
      system: systemPrompt,
      prompt: message,
      temperature: 0.7,
    })

    return result.text || "Thank you for your message. We'll get back to you soon!"
  } catch (error) {
    console.error('Error generating reply:', error)
    return "Thank you for your message. We'll get back to you soon!"
  }
}

async function sendFacebookMessage(recipientId: string, messageText: string) {
  try {
    const config = await getFacebookConfig()
    
    if (!config || !config.accessToken) {
      throw new Error('Facebook not configured')
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/me/messages?access_token=${config.accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: { id: recipientId },
          message: { text: messageText },
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Facebook API error: ${JSON.stringify(error)}`)
    }

    const result = await response.json()
    console.log('Message sent successfully:', result)
    return result
  } catch (error) {
    console.error('Error sending Facebook message:', error)
    throw error
  }
}

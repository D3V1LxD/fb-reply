# AI SDK Integration with GitHub Models

This project now uses the Vercel AI SDK with GitHub Models API for generating AI responses.

## Why GitHub Models?

- **Free Tier**: GitHub provides free access to GPT-4o through their Models API
- **High Quality**: Same GPT-4o model used by OpenAI
- **Easy Setup**: Simple GitHub token authentication
- **Streaming Support**: Real-time streaming responses
- **Better DX**: Built-in React hooks with `useChat`

## Setup Instructions

### 1. Get GitHub Token

1. Visit https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name like "FB Reply AI"
4. Select scopes (no special scopes needed for Models API)
5. Click "Generate token"
6. Copy the token immediately (you won't see it again!)

### 2. Configure Environment

Add to your `.env.local` file:

```env
GITHUB_TOKEN=github_pat_your_token_here
```

### 3. Available Endpoints

#### `/api/chat` - Streaming Chat API
- Uses Vercel AI SDK's `streamText`
- Returns streaming responses
- Used by the streaming chat interface

#### `/api/reply` - Standard Reply API  
- Uses Vercel AI SDK's `generateText`
- Returns complete responses at once
- Used by the standard test interface

#### `/api/webhook/facebook` - Facebook Webhook
- Automatically replies to Facebook messages
- Uses the same AI SDK for consistency

## Usage Examples

### Streaming Chat (Frontend)

```typescript
import { useChat } from 'ai/react'

const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
})
```

### Standard Generation (Backend)

```typescript
import { generateText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const github = createOpenAI({
  baseURL: 'https://models.inference.ai.azure.com',
  apiKey: process.env.GITHUB_TOKEN,
})

const result = await generateText({
  model: github('gpt-4o'),
  system: 'You are a helpful assistant',
  prompt: 'Hello!',
})
```

## Features

### 1. Standard Mode
- Click-to-generate responses
- Full response shown at once
- Good for testing individual messages
- Uses `/api/reply` endpoint

### 2. Streaming Mode  
- Real-time response generation
- See AI typing as it generates
- Better user experience
- Uses `/api/chat` endpoint

## Benefits of AI SDK

1. **Unified Interface**: Same API for different AI providers
2. **Type Safety**: Full TypeScript support
3. **React Integration**: Built-in `useChat` hook
4. **Streaming**: Native streaming support
5. **Error Handling**: Better error messages and handling

## Model Information

- **Model**: GPT-4o (via GitHub Models)
- **Provider**: GitHub Models API
- **Base URL**: https://models.inference.ai.azure.com
- **Context**: Uses your training data as system context
- **Temperature**: 0.7 (balanced creativity/consistency)

## Switching Between Modes

The test page now has two modes:

1. **Standard Mode**: Traditional request/response
   - Good for: Testing specific messages
   - Shows: Complete response at once
   
2. **Streaming Mode**: Real-time chat interface
   - Good for: Conversations, testing flow
   - Shows: Response as it generates

## Troubleshooting

### "Module 'ai/react' not found"
- Run `npm install` to ensure packages are installed
- Restart VS Code TypeScript server
- Restart Next.js dev server

### "GitHub token not configured"
- Check `.env.local` has `GITHUB_TOKEN`
- Make sure token starts with `github_pat_`
- Restart dev server after adding token

### Streaming not working
- Check browser console for errors
- Ensure `/api/chat` route is accessible
- Verify GitHub token is valid

## Migration Notes

### Old (OpenAI SDK)
```typescript
const completion = await openai.chat.completions.create({
  model: 'gpt-3.5-turbo',
  messages: [...],
})
```

### New (AI SDK with GitHub)
```typescript
const result = await generateText({
  model: github('gpt-4o'),
  system: systemPrompt,
  prompt: message,
})
```

## Cost Comparison

- **OpenAI GPT-3.5-turbo**: $0.50 / 1M input tokens
- **OpenAI GPT-4o**: $2.50 / 1M input tokens  
- **GitHub GPT-4o**: **FREE** (with rate limits)

## Rate Limits

GitHub Models has rate limits for free tier:
- Check current limits at https://docs.github.com/models
- For production use, consider GitHub Copilot subscription
- Or switch to OpenAI for higher limits

## Support

For more information:
- AI SDK Docs: https://sdk.vercel.ai/docs
- GitHub Models: https://github.com/marketplace/models
- Vercel AI: https://vercel.com/ai

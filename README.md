# AI Reply Training System

A Next.js web application that allows you to train an AI assistant to respond to messages with custom replies using OpenAI's GPT model.

## Features

- **Train AI**: Add examples of messages and corresponding replies to train the AI
- **Test Responses**: Test how the AI responds to new messages based on your training
- **Send Reply**: Send custom replies manually or use AI-assisted suggestions
- **Facebook Integration**: Connect your Facebook Page via webhook to auto-reply to messages
- **Manage Training Data**: View, edit, and delete training examples
- **Real-time Stats**: Track the number of training examples and last update time
- **Reply History**: Track all sent replies with timestamps and modes
- **Webhook Logging**: Monitor all incoming messages and outgoing replies
- **Beautiful UI**: Clean, modern interface with responsive design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
cp .env.local.example .env.local
```

4. Add your GitHub token or OpenAI API key to `.env.local`:

**Option 1: Using GitHub Models (Recommended - Free)**
```
GITHUB_TOKEN=your_github_token_here
```
Get a free token from: https://github.com/settings/tokens

**Option 2: Using OpenAI**
```
OPENAI_API_KEY=your_openai_api_key_here
```

### Running the Application

Development mode:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

Build for production:
```bash
npm run build
npm start
```

## How to Use

### 1. Train the AI
- Navigate to the **Train** page
- Enter a message that users might send
- Enter the reply you want the AI to give for similar messages
- Click "Add Training Data"
- Repeat with multiple examples for better accuracy

### 2. Test Responses
- Go to the **Test** page
- Enter a message to see how the AI responds
- The AI will use your training data to generate appropriate replies

### 3. Send Custom Replies
- Visit the **Send Reply** page
- Choose between **Manual** or **AI Assisted** mode
- **Manual Mode**: Write your own custom reply from scratch
- **AI Assisted Mode**: Get AI suggestions, then edit or send as-is
- View your sent reply history

### 4. Connect Facebook Page
- Go to the **Facebook** page
- Follow the step-by-step instructions to:
  - Create a Facebook App
  - Add Messenger product
  - Configure webhook with your URL
  - Generate and add Page Access Token
  - Subscribe to page events
- Once connected, messages to your Facebook Page will be auto-replied using AI

### 5. Manage Training Data
- Visit the **Manage** page
- View all your training examples
- Edit or delete examples as needed

## Project Structure

```
FB Reply/
├── app/
│   ├── api/              # API routes
│   │   ├── train/        # Add training data
│   │   ├── reply/        # Generate AI replies
│   │   ├── send-reply/   # Send custom replies
│   │   ├── training-data/# Manage training data
│   │   ├── stats/        # Get statistics
│   │   ├── facebook/     # Facebook configuration
│   │   └── webhook/      # Facebook webhook endpoint
│   ├── components/       # React components
│   ├── train/           # Training page
│   ├── test/            # Testing page
│   ├── send/            # Send reply page
│   ├── facebook/        # Facebook integration page
│   ├── manage/          # Management page
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home page
├── lib/
│   └── storage.ts       # Data storage utilities
├── data/                # Training data (auto-created)
├── .env.local          # Environment variables (create this)
└── package.json
```

## Technologies Used

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Vercel AI SDK**: Unified AI interface with streaming support
- **GitHub Models API**: Free GPT-4o access (or OpenAI as alternative)
- **CSS**: Custom styling (no framework dependencies)

## Tips for Better Results

1. **Add Multiple Examples**: The more training examples you provide, the better the AI will understand your needs
2. **Use Variations**: Include different ways users might phrase the same question
3. **Be Specific**: Clear, specific replies help the AI generate better responses
4. **Test Regularly**: Use the Test page to see how the AI performs and adjust training data accordingly
5. **Try Streaming Mode**: The new streaming chat interface provides real-time feedback as the AI generates responses

## AI SDK Features

### Streaming Chat
The test page now includes a **Streaming Mode** that shows AI responses in real-time as they're generated, powered by the Vercel AI SDK's `useChat` hook.

### GitHub Models Integration
- Uses GitHub's free GPT-4o model
- Better quality than GPT-3.5-turbo
- No cost for basic usage
- Easy setup with GitHub token

See [AI_SDK_GUIDE.md](./AI_SDK_GUIDE.md) for detailed information about the AI SDK integration.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on the repository.

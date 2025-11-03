# Python Backend for FB Reply AI System

## Requirements
- Python 3.9+
- FastAPI
- Uvicorn
- OpenAI SDK or GitHub API

## Installation

```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python main.py
```

Or with uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Training
- `POST /api/train` - Add training data
- `GET /api/training-data` - Get all training data
- `PUT /api/training-data` - Update training data
- `DELETE /api/training-data` - Delete training data

### AI Reply
- `POST /api/reply` - Generate AI reply (non-streaming)
- `POST /api/chat` - Generate AI reply (streaming)

### Send Reply
- `POST /api/send-reply` - Send custom reply
- `GET /api/send-reply` - Get sent replies history

### Facebook Integration
- `GET /api/facebook/config` - Get Facebook config
- `POST /api/facebook/config` - Save Facebook config
- `POST /api/facebook/test` - Test Facebook connection
- `GET /api/webhook/facebook` - Facebook webhook verification
- `POST /api/webhook/facebook` - Facebook webhook events

### Statistics
- `GET /api/stats` - Get system statistics

## Environment Variables

Create a `.env` file:

```env
# GitHub Token (recommended - free)
GITHUB_TOKEN=github_pat_xxxxx

# Or OpenAI API Key
OPENAI_API_KEY=sk-xxxxx

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

## File Structure

```
backend/
├── main.py              # FastAPI application entry point
├── models.py            # Pydantic models
├── storage.py           # Data storage utilities
├── ai_service.py        # AI/LLM integration
├── facebook_service.py  # Facebook integration
├── requirements.txt     # Python dependencies
├── .env                 # Environment variables
└── data/                # Data storage directory
    ├── training-data.json
    ├── sent-replies.json
    ├── facebook-config.json
    └── webhook-logs.json
```

## Features

- RESTful API with FastAPI
- Async/await support
- Automatic API documentation (Swagger UI at /docs)
- CORS enabled for frontend integration
- JSON file-based storage
- Streaming responses support
- Facebook webhook integration
- GitHub Models or OpenAI integration

# Running Python Backend with Next.js Frontend

## Option 1: Run Both Separately (Development)

### Terminal 1 - Python Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```
Backend runs on: http://localhost:8000

### Terminal 2 - Next.js Frontend
```bash
cd ..
npm run dev
```
Frontend runs on: http://localhost:3000

## Option 2: Update Next.js to use Python Backend

Update your frontend API calls to point to `http://localhost:8000/api/...`

### In your Next.js .env.local:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Update fetch calls:
```javascript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Example
fetch(`${API_URL}/api/train`, {
  method: 'POST',
  body: JSON.stringify(data)
})
```

## Option 3: Run Python Backend Only (Production)

The Python backend includes CORS support, so you can:

1. Build Next.js frontend: `npm run build`
2. Serve static files from Python
3. Or deploy frontend and backend separately

## Testing the Python Backend

### 1. Check if running:
```bash
curl http://localhost:8000
```

### 2. View API documentation:
Open browser: http://localhost:8000/docs

### 3. Test endpoints:
```bash
# Add training data
curl -X POST http://localhost:8000/api/train \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "reply": "Hi there!"}'

# Get training data
curl http://localhost:8000/api/training-data

# Generate reply
curl -X POST http://localhost:8000/api/reply \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

## Advantages of Python Backend

1. **Better AI Integration**: Native Python OpenAI SDK
2. **Async Support**: FastAPI with async/await
3. **Type Safety**: Pydantic models
4. **Auto Documentation**: Swagger UI at /docs
5. **Performance**: Efficient async operations
6. **Scalability**: Easy to deploy on Python hosting

## Migration from Next.js API Routes

The Python backend provides the same endpoints as Next.js:
- ✅ All `/api/*` routes implemented
- ✅ Same request/response format
- ✅ Facebook webhook support
- ✅ Streaming chat support
- ✅ File-based storage (compatible)

## Next Steps

1. **Install Python dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Run the server**:
   ```bash
   python main.py
   ```

4. **Access API docs**:
   http://localhost:8000/docs

## Deployment Options

### Vercel (Next.js + Python)
- Deploy Next.js frontend to Vercel
- Deploy Python backend to Vercel Serverless Functions

### Railway / Render
- Deploy Python backend as web service
- Deploy Next.js frontend separately

### Docker
- Create Dockerfile for Python backend
- Deploy as container

### Traditional Hosting
- Python backend: Any Python hosting (PythonAnywhere, Heroku, etc.)
- Frontend: Static hosting (Netlify, Vercel, etc.)

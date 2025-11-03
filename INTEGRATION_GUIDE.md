# Python Backend + Next.js Frontend Integration Guide

## ✅ Integration Complete!

Your Next.js frontend now communicates with the Python FastAPI backend.

## 🚀 Running Both Servers

### Terminal 1 - Python Backend (Port 8000)
```powershell
cd backend
.\venv\Scripts\Activate.ps1
python main.py
```

### Terminal 2 - Next.js Frontend (Port 3000)
```powershell
npm run dev
```

## 📡 API Communication

All frontend requests now go through the Python backend:

- **API URL**: `http://localhost:8000`
- **Frontend**: `http://localhost:3000`

### Updated Files:
✅ `.env.local` - Added `NEXT_PUBLIC_API_URL=http://localhost:8000`
✅ `lib/api.ts` - New centralized API client  
✅ `app/page.tsx` - Uses `statsAPI.get()`
✅ `app/train/page.tsx` - Uses `trainingAPI.add()`
✅ `app/test/page.tsx` - Uses `replyAPI.generate()` & `replyAPI.streamChat()`
✅ `app/send/page.tsx` - Uses `sendReplyAPI.send()` & `sendReplyAPI.getHistory()`
✅ `app/manage/page.tsx` - Uses `trainingAPI.getAll()`, `update()`, `delete()`
✅ `app/facebook/page.tsx` - Uses `facebookAPI.getConfig()`, `saveConfig()`, `test()`

## 🔧 Configuration

### Backend `.env` (backend/.env)
```env
GITHUB_TOKEN=github_pat_xxxxx  # Your token from backend/.env
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

### Frontend `.env.local`
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 API Documentation

Visit http://localhost:8000/docs for interactive API documentation (Swagger UI)

## ✨ Features

1. **Centralized API Client** (`lib/api.ts`)
   - Type-safe requests
   - Error handling
   - Easy to maintain

2. **All Endpoints Working**
   - Training data CRUD
   - AI reply generation
   - Streaming chat
   - Reply sending with history
   - Facebook webhook integration
   - Statistics

3. **Better Error Messages**
   - Proper error propagation
   - User-friendly messages

## 🧪 Testing

1. **Start both servers**
2. **Open** http://localhost:3000
3. **Test features**:
   - Add training data
   - Test AI responses
   - Send replies
   - View statistics

## 🔗 Next Steps

1. Add your GitHub token to `backend/.env`
2. Test all pages
3. Configure Facebook integration if needed
4. Deploy when ready!

## 📦 Deployment Options

### Option 1: Separate Deployment
- Frontend: Vercel/Netlify
- Backend: Railway/Render/Fly.io

### Option 2: Combined
- Docker container with both servers
- Single deployment unit

## 🆘 Troubleshooting

**Frontend can't connect to backend:**
- Ensure backend is running on port 8000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors

**Module errors:**
- Backend: Activate venv before running
- Frontend: Run `npm install`

**Import errors in VS Code:**
- Python: Select correct interpreter (venv)
- TypeScript: Reload VS Code window

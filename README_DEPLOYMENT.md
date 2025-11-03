# FB Reply AI

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

> AI-powered Facebook message reply system with training capabilities

## 🌐 Live Demo

- **Frontend**: [Deploy to Vercel](https://vercel.com)
- **Backend**: [Deploy to PythonAnywhere](https://www.pythonanywhere.com)

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- GitHub account
- GitHub Token or OpenAI API Key

### Local Development

**Frontend:**
```bash
npm install
npm run dev
```

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

Visit: http://localhost:3000

### Deploy

**Frontend → Vercel (1-Click):**
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy!

**Backend → PythonAnywhere:**
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed steps

## 📋 Features

- 🔐 **Secure Authentication** - Login system with credentials
- 🤖 **AI Training** - Train AI with custom message/reply pairs
- 💬 **Smart Replies** - Generate AI-powered responses
- 📊 **Dashboard** - View statistics and analytics
- 📤 **Manual Override** - Send custom replies when needed
- 🔗 **Facebook Integration** - Webhook for auto-replies
- 📝 **Data Management** - Full CRUD for training data

## 🛠️ Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- React 18
- CSS

**Backend:**
- Python 3.10+
- FastAPI
- OpenAI SDK (GitHub Models API)
- Pydantic

## 📁 Project Structure

```
fb-reply-ai/
├── app/                    # Next.js pages
│   ├── login/             # Authentication
│   ├── train/             # Training interface
│   ├── test/              # Testing AI
│   ├── send/              # Send replies
│   ├── manage/            # Manage data
│   └── facebook/          # Facebook integration
├── backend/               # Python FastAPI backend
│   ├── main.py           # FastAPI app
│   ├── models.py         # Pydantic models
│   ├── ai_service.py     # AI integration
│   └── requirements.txt  # Python deps
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── auth.ts           # Auth helpers
└── components/            # React components
```

## 🔑 Environment Variables

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Backend (.env):**
```env
GITHUB_TOKEN=your_github_token
DEBUG=True
```

## 📖 Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- [Quick Deploy](DEPLOY.md) - One-page deployment commands
- [Backend Deployment](backend/DEPLOYMENT.md) - PythonAnywhere setup

## 🔐 Security

**Default Credentials:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANT:** Change these before deploying to production!

## 🚀 Deployment Options

### Frontend
- ✅ **Vercel** (Recommended)
- Netlify
- GitHub Pages (static export)

### Backend
- ✅ **PythonAnywhere** (Free tier available)
- Railway.app
- Render.com
- Heroku

## 📊 API Endpoints

```
POST   /api/train              # Add training data
GET    /api/training-data      # Get all training
POST   /api/reply              # Generate AI reply
POST   /api/chat               # Streaming chat
POST   /api/send-reply         # Send custom reply
GET    /api/stats              # Get statistics
POST   /api/facebook/config    # Facebook config
POST   /api/facebook/webhook   # Webhook handler
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file

## 🐛 Issues

Found a bug? [Open an issue](https://github.com/YOUR_USERNAME/fb-reply-ai/issues)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📧 Contact

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Project: [https://github.com/YOUR_USERNAME/fb-reply-ai](https://github.com/YOUR_USERNAME/fb-reply-ai)

---

**Ready to deploy?** Check out [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)!

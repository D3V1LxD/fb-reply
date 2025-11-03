# Deployment Guide - Frontend & Backend

## 🎯 Quick Deployment Checklist

### Frontend (Vercel - Recommended)
- [ ] Push code to GitHub
- [ ] Sign up at [vercel.com](https://vercel.com)
- [ ] Import repository
- [ ] Add environment variables
- [ ] Deploy

### Backend (PythonAnywhere)
- [ ] Sign up at [pythonanywhere.com](https://www.pythonanywhere.com)
- [ ] Upload code or use Git
- [ ] Create virtual environment
- [ ] Configure WSGI file
- [ ] Add environment variables
- [ ] Reload web app

---

## 📦 Frontend Deployment

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- Automatic builds on Git push
- Free SSL certificates
- Global CDN
- Serverless functions
- Best for Next.js

**Steps:**

1. **Push to GitHub:**
```bash
cd "d:\Website Project\FB Reply"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git
git push -u origin main
```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Connect GitHub account
   - Select your repository
   - Configure:
     - Framework Preset: **Next.js**
     - Build Command: `npm run build`
     - Output Directory: `.next`

3. **Add Environment Variables:**
   - In Vercel dashboard → Settings → Environment Variables
   - Add these:
     ```
     NEXT_PUBLIC_API_URL=https://YOUR_USERNAME.pythonanywhere.com
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=your_secure_password
     ```

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at: `https://your-project.vercel.app`

5. **Custom Domain (Optional):**
   - Settings → Domains
   - Add your custom domain
   - Update DNS records

---

### Option 2: Netlify

**Steps:**

1. Push code to GitHub (same as above)

2. Deploy to Netlify:
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub
   - Select repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. Add environment variables in Netlify dashboard

4. Deploy!

---

### Option 3: GitHub Pages (Static Export)

**Note:** Limited functionality - no API routes

1. **Update `next.config.js`:**
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/fb-reply-ai',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
```

2. **Build:**
```bash
npm run build
```

3. **Deploy:**
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"deploy": "gh-pages -d out"

# Deploy
npm run deploy
```

4. **Enable GitHub Pages:**
   - Repository Settings → Pages
   - Source: `gh-pages` branch
   - Save

---

## 🐍 Backend Deployment

### PythonAnywhere (Free Tier Available) ⭐

**Why PythonAnywhere?**
- Free tier available
- Python-optimized
- Easy setup
- No credit card required

**Complete Setup Guide:**

#### 1. Sign Up
- Go to [pythonanywhere.com](https://www.pythonanywhere.com)
- Create free account

#### 2. Upload Code

**Option A: Git (Recommended)**
```bash
# In PythonAnywhere Bash console
git clone https://github.com/YOUR_USERNAME/fb-reply-ai.git
cd fb-reply-ai/backend
```

**Option B: Manual**
- Files tab → Upload backend folder

#### 3. Virtual Environment
```bash
cd ~/fb-reply-ai/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 4. Environment Variables
```bash
nano .env
```

Add:
```env
GITHUB_TOKEN=your_github_token
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=https://your-frontend.vercel.app
```

Save: `Ctrl+X`, `Y`, `Enter`

#### 5. Create Data Directory
```bash
mkdir -p data
chmod 755 data
```

#### 6. Web App Configuration

**A. Add New Web App:**
- Web tab → "Add a new web app"
- Manual configuration
- Python 3.10

**B. Configure WSGI:**

Click WSGI configuration file link, replace content:

```python
import sys
import os
from dotenv import load_dotenv

# Add project directory
path = '/home/YOUR_USERNAME/fb-reply-ai/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Load environment
load_dotenv(os.path.join(path, '.env'))

# Import app
from main import app as application
```

**C. Set Virtual Environment:**
- Virtualenv section
- Enter: `/home/YOUR_USERNAME/fb-reply-ai/backend/venv`

**D. Reload:**
- Click green "Reload" button

#### 7. Test API
Visit: `https://YOUR_USERNAME.pythonanywhere.com/docs`

---

### Alternative: Railway.app

**Steps:**

1. Push backend to GitHub
2. Go to [railway.app](https://railway.app)
3. "New Project" → Deploy from GitHub
4. Select backend folder
5. Add environment variables
6. Deploy

---

### Alternative: Render.com

**Steps:**

1. Push to GitHub
2. Go to [render.com](https://render.com)
3. New Web Service
4. Connect repository
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
7. Add environment variables
8. Deploy

---

## 🔗 Connecting Frontend to Backend

After deploying both:

1. **Get Backend URL:**
   - PythonAnywhere: `https://YOUR_USERNAME.pythonanywhere.com`
   - Railway: `https://your-app.railway.app`
   - Render: `https://your-app.onrender.com`

2. **Update Frontend Environment:**
   - Vercel: Dashboard → Settings → Environment Variables
   - Update `NEXT_PUBLIC_API_URL` with backend URL
   - Redeploy

3. **Update Backend CORS:**
   - Update backend `.env`:
     ```env
     CORS_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
     ```
   - Reload backend

---

## ✅ Post-Deployment Checklist

### Security
- [ ] Change default admin password
- [ ] Use HTTPS for all connections
- [ ] Set `DEBUG=False` in backend
- [ ] Add rate limiting
- [ ] Rotate API keys regularly
- [ ] Review CORS settings

### Testing
- [ ] Test login functionality
- [ ] Test AI reply generation
- [ ] Test training data CRUD
- [ ] Test Facebook webhook
- [ ] Test all pages load correctly
- [ ] Check mobile responsiveness

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Monitor API logs
- [ ] Check performance metrics
- [ ] Setup uptime monitoring

### Documentation
- [ ] Update README with live URLs
- [ ] Document API endpoints
- [ ] Add troubleshooting guide

---

## 🐛 Troubleshooting

### Frontend Issues

**CORS Errors:**
- Backend CORS_ORIGINS includes frontend URL
- Both use HTTPS (or both HTTP in dev)

**API Requests Failing:**
- Check `NEXT_PUBLIC_API_URL` is correct
- Backend is running and accessible
- Check browser console for errors

**Build Failures:**
- Run `npm install` locally first
- Check for TypeScript errors: `npm run build`
- Review build logs

### Backend Issues

**ModuleNotFoundError:**
```bash
source venv/bin/activate
pip install -r requirements.txt
```

**Permission Errors:**
```bash
chmod 755 ~/fb-reply-ai/backend
chmod 755 ~/fb-reply-ai/backend/data
```

**Import Errors:**
- Check WSGI file path is correct
- Virtual environment is set correctly
- All dependencies installed

**View Logs:**
```bash
# PythonAnywhere
tail -f /var/log/YOUR_USERNAME.pythonanywhere.com.error.log
```

---

## 📊 Free Tier Limits

### Vercel
- ✅ Unlimited personal projects
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Serverless functions

### PythonAnywhere
- ✅ 1 web app
- ✅ 512 MB disk space
- ✅ Daily CPU limit
- ❌ No custom domain (paid only)

### Netlify
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Automatic HTTPS

---

## 🚀 Production Optimizations

### Frontend
1. Enable Image Optimization
2. Add caching headers
3. Minify assets
4. Use CDN
5. Implement lazy loading

### Backend
1. Add Redis caching
2. Implement connection pooling
3. Use proper database (PostgreSQL)
4. Add rate limiting
5. Enable gzip compression
6. Setup monitoring

---

## 📝 Environment Variables Reference

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_password_here
```

### Backend (.env)
```env
GITHUB_TOKEN=github_pat_xxxxx
OPENAI_API_KEY=sk-xxxxx  # Alternative to GitHub token
HOST=0.0.0.0
PORT=8000
DEBUG=False
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## 🎉 Success!

Your app should now be live:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://YOUR_USERNAME.pythonanywhere.com`
- **API Docs**: `https://YOUR_USERNAME.pythonanywhere.com/docs`

---

## 📧 Need Help?

- Check respective platform documentation
- Review error logs
- Create GitHub issue
- Check community forums

---

**Good luck with your deployment! 🚀**

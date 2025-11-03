# Quick Start - Deployment Commands

## 🚀 Deploy Frontend to Vercel

```bash
# 1. Push to GitHub
cd "d:\Website Project\FB Reply"
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git
git push -u origin main

# 2. Go to vercel.com and import your repository
# 3. Add environment variables in Vercel dashboard:
#    NEXT_PUBLIC_API_URL=https://YOUR_USERNAME.pythonanywhere.com
#    ADMIN_USERNAME=admin
#    ADMIN_PASSWORD=your_secure_password
```

---

## 🐍 Deploy Backend to PythonAnywhere

```bash
# 1. In PythonAnywhere Bash console:
git clone https://github.com/YOUR_USERNAME/fb-reply-ai.git
cd fb-reply-ai/backend

# 2. Create virtual environment:
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 3. Create .env file:
nano .env
# Add:
# GITHUB_TOKEN=your_token
# HOST=0.0.0.0
# PORT=8000
# DEBUG=False
# CORS_ORIGINS=https://your-frontend.vercel.app

# 4. Create data directory:
mkdir -p data
chmod 755 data

# 5. Configure Web App:
# - Web tab → Add new web app → Manual configuration → Python 3.10
# - Click WSGI configuration file → Replace content (see DEPLOYMENT_GUIDE.md)
# - Set virtualenv: /home/YOUR_USERNAME/fb-reply-ai/backend/venv
# - Click Reload

# 6. Test:
# Visit: https://YOUR_USERNAME.pythonanywhere.com/docs
```

---

## 🔗 Connect Frontend to Backend

1. Update Vercel environment variable:
   - `NEXT_PUBLIC_API_URL=https://YOUR_USERNAME.pythonanywhere.com`

2. Redeploy frontend (automatic on Vercel)

3. Test at your Vercel URL

---

## ✅ Verify Deployment

- [ ] Frontend loads at Vercel URL
- [ ] Can login with credentials
- [ ] API requests work
- [ ] Training data can be added
- [ ] AI replies generate correctly

---

See **DEPLOYMENT_GUIDE.md** for detailed instructions!

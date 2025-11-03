# 🚀 Quick Reference - Deployment

## 📍 Deployment URLs

### Frontend (Vercel)
- **Live URL**: `https://your-project.vercel.app`
- **Dashboard**: https://vercel.com/dashboard
- **Docs**: https://vercel.com/docs

### Backend (PythonAnywhere)
- **API URL**: `https://YOUR_USERNAME.pythonanywhere.com`
- **API Docs**: `https://YOUR_USERNAME.pythonanywhere.com/docs`
- **Dashboard**: `https://www.pythonanywhere.com/user/YOUR_USERNAME/`

---

## 🔑 Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **IMPORTANT**: Change these before going to production!

---

## 📋 Environment Variables Checklist

### Frontend (.env.local → Vercel)
```
✅ NEXT_PUBLIC_API_URL=https://YOUR_USERNAME.pythonanywhere.com
✅ ADMIN_USERNAME=admin
✅ ADMIN_PASSWORD=your_secure_password
```

### Backend (.env → PythonAnywhere)
```
✅ GITHUB_TOKEN=github_pat_xxxxx
✅ HOST=0.0.0.0
✅ PORT=8000
✅ DEBUG=False
✅ CORS_ORIGINS=https://your-project.vercel.app
```

---

## ⚡ Quick Deploy Commands

### Initial Setup
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git
git push -u origin main

# 2. Deploy Frontend
# → Go to vercel.com → Import Project → Deploy

# 3. Deploy Backend
# → Go to pythonanywhere.com → Follow DEPLOYMENT.md
```

### Update Deployments

**Frontend (Auto-deploy):**
```bash
git add .
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys on push
```

**Backend (Manual reload):**
```bash
# In PythonAnywhere Bash console:
cd ~/fb-reply-ai/backend
git pull origin main
source venv/bin/activate
pip install -r requirements.txt
# Then click "Reload" in Web tab
```

---

## 🧪 Testing Checklist

After deployment:

- [ ] Visit frontend URL - should show login page
- [ ] Login with credentials
- [ ] Navigate to Train page - add data
- [ ] Navigate to Test page - test AI replies
- [ ] Navigate to Send page - send reply
- [ ] Navigate to Manage page - view/edit data
- [ ] Test mobile responsiveness
- [ ] Check browser console for errors
- [ ] Test API directly at `/docs` endpoint

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **CORS Error** | Update backend `CORS_ORIGINS` with frontend URL |
| **404 on API** | Check `NEXT_PUBLIC_API_URL` in Vercel settings |
| **Can't Login** | Verify credentials match in both environments |
| **Build Failed** | Run `npm run build` locally to check errors |
| **Import Error** | Check virtual environment and reinstall packages |

---

## 📞 Support Links

- **Vercel Status**: https://vercel-status.com/
- **PythonAnywhere Forums**: https://www.pythonanywhere.com/forums/
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com/

---

## 📂 Important Files

| File | Purpose |
|------|---------|
| `DEPLOYMENT_SUMMARY.md` | Complete deployment overview |
| `DEPLOYMENT_GUIDE.md` | Detailed step-by-step guide |
| `DEPLOY.md` | Quick command reference |
| `backend/DEPLOYMENT.md` | PythonAnywhere setup guide |
| `.env.example` | Frontend environment template |
| `backend/.env.example` | Backend environment template |

---

## 🎯 Quick Access Commands

```bash
# Check deployment readiness
.\check-deployment-ready.bat

# Backend setup (PythonAnywhere)
cd backend && ./deploy-setup.sh

# Build frontend locally
npm run build

# Start local dev servers
npm run dev                    # Frontend
python backend/main.py         # Backend
```

---

## ✅ Final Checklist

Before going live:

- [ ] Changed default admin password
- [ ] Set `DEBUG=False` in backend
- [ ] Configured CORS properly
- [ ] Tested all features
- [ ] HTTPS enabled on both platforms
- [ ] Environment variables set
- [ ] API keys secured
- [ ] Error logging configured
- [ ] Mobile tested
- [ ] Documentation updated with live URLs

---

**🎉 You're all set! Deploy and enjoy your AI Reply System!**

Need detailed instructions? See **DEPLOYMENT_GUIDE.md**

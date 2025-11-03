# 🚀 Deployment Configuration Summary

## ✅ Current Status

**Frontend Repository:** https://github.com/D3V1LxD/fb-reply
**Backend URL:** https://oneai.pythonanywhere.com
**Status:** Ready for Vercel deployment

---

## 📋 Vercel Environment Variables

Add these in **Vercel Dashboard → Your Project → Settings → Environment Variables**:

### Required Variables:

1. **NEXT_PUBLIC_API_URL**
   ```
   https://oneai.pythonanywhere.com
   ```

2. **ADMIN_USERNAME**
   ```
   admin@bodymassage.qzz.io
   ```

3. **ADMIN_PASSWORD**
   ```
   Mahim@2001
   ```

---

## 🔧 Vercel Deployment Steps

### 1. Add Environment Variables
- Go to https://vercel.com/d3v1lxd/fb-reply/settings/environment-variables
- Add all three variables above
- Apply to: Production, Preview, and Development

### 2. Redeploy
- Vercel should auto-deploy after you push changes
- OR manually trigger: Deployments → Click "..." → Redeploy

### 3. Test Your Deployment
Once deployed, you'll get a URL like: `https://fb-reply-xxxxx.vercel.app`

Test these features:
- [ ] Visit the URL - should redirect to `/login`
- [ ] Login with credentials
- [ ] Navigate to all pages (Train, Test, Send, Manage, Facebook)
- [ ] Test AI reply generation

---

## ⚠️ Important: Update Backend CORS

After getting your Vercel URL, you need to update the backend CORS settings on PythonAnywhere:

### On PythonAnywhere:

1. Go to your **Files** tab
2. Navigate to: `/home/oneai/fb-reply/backend/.env`
3. Update this line:
   ```
   CORS_ORIGINS=https://your-vercel-url.vercel.app
   ```
   Example:
   ```
   CORS_ORIGINS=https://fb-reply-d3v1lxd.vercel.app,https://www.your-custom-domain.com
   ```

4. **Reload your web app** in the Web tab

---

## 🔍 Troubleshooting

### Issue: CORS Errors
**Solution:** Make sure backend CORS_ORIGINS includes your Vercel URL

### Issue: 404 on API Calls
**Solution:** Verify NEXT_PUBLIC_API_URL is set correctly in Vercel

### Issue: Cannot Login
**Solution:** Check ADMIN_USERNAME and ADMIN_PASSWORD in Vercel match backend expectations

---

## 📊 Your URLs

| Service | URL |
|---------|-----|
| **GitHub Repo** | https://github.com/D3V1LxD/fb-reply |
| **Backend API** | https://oneai.pythonanywhere.com |
| **API Docs** | https://oneai.pythonanywhere.com/docs |
| **Vercel Project** | https://vercel.com/d3v1lxd/fb-reply |
| **Frontend** | (Will be assigned after deployment) |

---

## ✅ Deployment Checklist

- [x] Code pushed to GitHub
- [x] Backend URL configured
- [x] Build errors fixed
- [ ] Environment variables added in Vercel
- [ ] Vercel deployment successful
- [ ] Backend CORS updated with Vercel URL
- [ ] Tested login functionality
- [ ] Tested all features

---

## 🎉 Success!

Once all steps are complete:
1. Your frontend will be live on Vercel
2. Connected to your PythonAnywhere backend
3. Fully functional AI reply system
4. Secure authentication
5. All features working

---

*Last Updated: November 4, 2025*
*Backend: oneai.pythonanywhere.com*
*Repository: D3V1LxD/fb-reply*

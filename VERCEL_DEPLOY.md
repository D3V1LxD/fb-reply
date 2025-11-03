# Vercel Deployment Configuration

## Deployment Checklist

Before deploying:

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git
git push -u origin main
```

2. **Environment Variables:**
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `ADMIN_USERNAME` - Admin username
   - `ADMIN_PASSWORD` - Admin password (use strong password!)

3. **Build Settings:**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

## Important Notes

- The backend must be deployed separately (see backend/DEPLOYMENT.md)
- Update `NEXT_PUBLIC_API_URL` to point to your deployed backend
- Make sure CORS is configured correctly in backend

## Custom Domain

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Configure DNS records as shown
4. Update backend CORS_ORIGINS to include your domain

## Troubleshooting

**Build fails:**
- Check for TypeScript errors locally: `npm run build`
- Ensure all dependencies are in package.json
- Check Node version (requires 18+)

**API requests fail:**
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend CORS settings
- Ensure backend is deployed and running

**Authentication issues:**
- Check environment variables are set
- Try clearing browser cache/localStorage
- Verify credentials match .env values

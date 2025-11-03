#!/bin/bash
# Quick GitHub Push Script

echo "════════════════════════════════════════════════════════════"
echo "  🚀 Push to GitHub"
echo "════════════════════════════════════════════════════════════"
echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "✓ Remote 'origin' already configured"
    git remote -v
else
    echo "⚠️  Please add your GitHub repository URL:"
    echo ""
    echo "Run this command (replace YOUR_USERNAME with your GitHub username):"
    echo "git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git"
    echo ""
    exit 1
fi

echo ""
echo "Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next: Deploy to Vercel"
    echo "1. Go to https://vercel.com"
    echo "2. Import your repository"
    echo "3. Add environment variables"
    echo "4. Deploy!"
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "- GitHub repository exists"
    echo "- You have push permissions"
    echo "- Remote URL is correct"
fi

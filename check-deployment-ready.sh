#!/bin/bash

echo "========================================"
echo "  FB Reply AI - Deployment Preparation"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check status
check_exists() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        return 0
    else
        echo -e "${RED}✗${NC} $2"
        return 1
    fi
}

echo "Checking frontend files..."
check_exists "package.json" "package.json exists"
check_exists "next.config.js" "next.config.js exists"
check_exists ".env.example" ".env.example exists"
check_exists ".gitignore" ".gitignore configured"

echo ""
echo "Checking backend files..."
check_exists "backend/requirements.txt" "requirements.txt exists"
check_exists "backend/main.py" "main.py exists"
check_exists "backend/.env.example" "backend .env.example exists"
check_exists "backend/Procfile" "Procfile for deployment"
check_exists "backend/runtime.txt" "runtime.txt for Python version"

echo ""
echo "Checking documentation..."
check_exists "DEPLOYMENT_GUIDE.md" "Deployment guide"
check_exists "DEPLOY.md" "Quick deploy guide"
check_exists "README_DEPLOYMENT.md" "README for deployment"
check_exists "backend/DEPLOYMENT.md" "Backend deployment guide"

echo ""
echo "Checking deployment scripts..."
check_exists "backend/deploy-setup.sh" "Linux setup script"
check_exists "backend/deploy-setup.bat" "Windows setup script"

echo ""
echo "========================================"
echo "  Pre-Deployment Checklist"
echo "========================================"
echo ""

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠${NC}  .env.local found - will NOT be committed to Git"
    echo "   Make sure to add environment variables in your hosting platform"
else
    echo -e "${YELLOW}!${NC}  .env.local not found"
    echo "   Create it from .env.example before testing locally"
fi

echo ""

# Check if backend/.env exists
if [ -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠${NC}  backend/.env found - will NOT be committed to Git"
    echo "   Add these variables in PythonAnywhere console"
else
    echo -e "${YELLOW}!${NC}  backend/.env not found"
    echo "   Create it from backend/.env.example before deploying"
fi

echo ""
echo "========================================"
echo "  Next Steps"
echo "========================================"
echo ""
echo "1. Frontend (Vercel):"
echo "   • Push to GitHub: git init && git add . && git commit -m 'Initial commit'"
echo "   • Go to vercel.com and import your repository"
echo "   • Add environment variables from .env.example"
echo "   • Deploy!"
echo ""
echo "2. Backend (PythonAnywhere):"
echo "   • Sign up at pythonanywhere.com"
echo "   • Clone your repository in Bash console"
echo "   • Run: cd backend && ./deploy-setup.sh"
echo "   • Configure WSGI file (see backend/DEPLOYMENT.md)"
echo "   • Add environment variables"
echo "   • Reload web app"
echo ""
echo "3. Connect Frontend to Backend:"
echo "   • Update Vercel env var: NEXT_PUBLIC_API_URL"
echo "   • Update backend CORS_ORIGINS with frontend URL"
echo "   • Test the connection"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
echo ""
echo "✅ Your project is ready for deployment!"
echo ""

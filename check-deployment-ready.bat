@echo off
echo ========================================
echo   FB Reply AI - Deployment Preparation
echo ========================================
echo.

REM Function to check file existence
set "checkmark=[92m✓[0m"
set "crossmark=[91m✗[0m"
set "warning=[93m⚠[0m"

echo Checking frontend files...
if exist "package.json" (echo %checkmark% package.json exists) else (echo %crossmark% package.json missing)
if exist "next.config.js" (echo %checkmark% next.config.js exists) else (echo %crossmark% next.config.js missing)
if exist ".env.example" (echo %checkmark% .env.example exists) else (echo %crossmark% .env.example missing)
if exist ".gitignore" (echo %checkmark% .gitignore configured) else (echo %crossmark% .gitignore missing)

echo.
echo Checking backend files...
if exist "backend\requirements.txt" (echo %checkmark% requirements.txt exists) else (echo %crossmark% requirements.txt missing)
if exist "backend\main.py" (echo %checkmark% main.py exists) else (echo %crossmark% main.py missing)
if exist "backend\.env.example" (echo %checkmark% backend .env.example exists) else (echo %crossmark% backend .env.example missing)
if exist "backend\Procfile" (echo %checkmark% Procfile for deployment) else (echo %crossmark% Procfile missing)
if exist "backend\runtime.txt" (echo %checkmark% runtime.txt for Python version) else (echo %crossmark% runtime.txt missing)

echo.
echo Checking documentation...
if exist "DEPLOYMENT_GUIDE.md" (echo %checkmark% Deployment guide) else (echo %crossmark% Deployment guide missing)
if exist "DEPLOY.md" (echo %checkmark% Quick deploy guide) else (echo %crossmark% Quick deploy guide missing)
if exist "README_DEPLOYMENT.md" (echo %checkmark% README for deployment) else (echo %crossmark% README missing)
if exist "backend\DEPLOYMENT.md" (echo %checkmark% Backend deployment guide) else (echo %crossmark% Backend guide missing)

echo.
echo Checking deployment scripts...
if exist "backend\deploy-setup.sh" (echo %checkmark% Linux setup script) else (echo %crossmark% Linux setup script missing)
if exist "backend\deploy-setup.bat" (echo %checkmark% Windows setup script) else (echo %crossmark% Windows setup script missing)

echo.
echo ========================================
echo   Pre-Deployment Checklist
echo ========================================
echo.

if exist ".env.local" (
    echo %warning%  .env.local found - will NOT be committed to Git
    echo    Make sure to add environment variables in your hosting platform
) else (
    echo !  .env.local not found
    echo    Create it from .env.example before testing locally
)

echo.

if exist "backend\.env" (
    echo %warning%  backend\.env found - will NOT be committed to Git
    echo    Add these variables in PythonAnywhere console
) else (
    echo !  backend\.env not found
    echo    Create it from backend\.env.example before deploying
)

echo.
echo ========================================
echo   Next Steps
echo ========================================
echo.
echo 1. Frontend (Vercel):
echo    • Push to GitHub: git init ^&^& git add . ^&^& git commit -m "Initial commit"
echo    • Go to vercel.com and import your repository
echo    • Add environment variables from .env.example
echo    • Deploy!
echo.
echo 2. Backend (PythonAnywhere):
echo    • Sign up at pythonanywhere.com
echo    • Clone your repository in Bash console
echo    • Run: cd backend ^&^& ./deploy-setup.sh
echo    • Configure WSGI file (see backend\DEPLOYMENT.md)
echo    • Add environment variables
echo    • Reload web app
echo.
echo 3. Connect Frontend to Backend:
echo    • Update Vercel env var: NEXT_PUBLIC_API_URL
echo    • Update backend CORS_ORIGINS with frontend URL
echo    • Test the connection
echo.
echo 📚 See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
echo ✅ Your project is ready for deployment!
echo.
pause

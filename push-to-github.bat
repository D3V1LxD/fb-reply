@echo off
REM Quick GitHub Push Script

echo ════════════════════════════════════════════════════════════
echo   🚀 Push to GitHub
echo ════════════════════════════════════════════════════════════
echo.

REM Check if remote already exists
git remote get-url origin >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✓ Remote 'origin' already configured
    git remote -v
    goto :push
)

echo ⚠️  Please add your GitHub repository URL:
echo.
echo Run this command (replace YOUR_USERNAME with your GitHub username):
echo git remote add origin https://github.com/YOUR_USERNAME/fb-reply-ai.git
echo.
echo Then run this script again.
pause
exit /b 1

:push
echo.
echo Pushing to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Successfully pushed to GitHub!
    echo.
    echo Next: Deploy to Vercel
    echo 1. Go to https://vercel.com
    echo 2. Import your repository
    echo 3. Add environment variables:
    echo    - NEXT_PUBLIC_API_URL=http://localhost:8000
    echo    - ADMIN_USERNAME=admin@bodymassage.qzz.io
    echo    - ADMIN_PASSWORD=Mahim@2001
    echo 4. Deploy!
    echo.
) else (
    echo.
    echo ❌ Push failed. Please check:
    echo - GitHub repository exists
    echo - You have push permissions
    echo - Remote URL is correct
    echo.
)

pause

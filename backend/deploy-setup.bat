@echo off
echo 🚀 Preparing Backend for Deployment...

REM Create necessary directories
if not exist "data" mkdir data

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  Creating .env from .env.example...
    copy .env.example .env
    echo 📝 Please edit .env and add your API keys!
)

REM Check Python version
python --version

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo 📦 Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
pip install -r requirements.txt

echo.
echo ✅ Backend setup complete!
echo.
echo 📋 Next steps for PythonAnywhere deployment:
echo 1. Upload this backend folder to PythonAnywhere
echo 2. Run deploy-setup.sh in PythonAnywhere Bash console
echo 3. Configure WSGI file (see DEPLOYMENT.md)
echo 4. Add environment variables to .env
echo 5. Reload your web app
echo.
echo 📚 See DEPLOYMENT.md for detailed instructions
echo.
pause

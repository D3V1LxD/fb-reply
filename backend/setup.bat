@echo off
REM Setup script for Python backend on Windows

echo Setting up Python backend for FB Reply AI...

REM Check Python version
python --version
if errorlevel 1 (
    echo Python is not installed or not in PATH
    exit /b 1
)

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo Installing requirements...
pip install -r requirements.txt

REM Create data directory
echo Creating data directory...
if not exist data mkdir data

REM Copy environment file
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    echo Please edit .env file and add your API keys
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file and add your GitHub token or OpenAI API key
echo 2. Run the server: python main.py
echo 3. API documentation: http://localhost:8000/docs
echo.

pause

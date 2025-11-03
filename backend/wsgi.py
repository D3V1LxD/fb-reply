"""
WSGI configuration for FB Reply AI Backend

This module contains the WSGI application used by PythonAnywhere and other
WSGI-compatible web servers to serve the FastAPI application.

For PythonAnywhere deployment:
1. Upload this file to your backend directory
2. Update the WSGI configuration file to import from this module
3. Set the working directory to the backend folder
4. Configure the virtual environment path
5. Reload the web app

Local testing:
    uvicorn wsgi:application --host 0.0.0.0 --port 8000 --reload
"""

import sys
import os
from pathlib import Path
from datetime import datetime

def check_dependencies():
    """Check if all required dependencies are installed"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'dotenv',
        'aiofiles',
        'httpx',
        'openai'
    ]
    
    missing_packages = []
    for package in required_packages:
        try:
            __import__(package)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} - MISSING")
            missing_packages.append(package)
    
    return missing_packages

def check_environment():
    """Check environment variables"""
    print("\n🔧 Environment Variables:")
    
    # Load .env file
    env_file = BASE_DIR / '.env'
    if env_file.exists():
        print(f"  ✅ .env file found at {env_file}")
        
        # Check for important variables
        from dotenv import load_dotenv
        load_dotenv(env_file)
        
        github_token = os.getenv('GITHUB_TOKEN', '')
        cors_origins = os.getenv('CORS_ORIGINS', '')
        debug = os.getenv('DEBUG', 'True')
        
        print(f"  ✅ GITHUB_TOKEN: {'Set' if github_token else '❌ MISSING'}")
        print(f"  ✅ CORS_ORIGINS: {cors_origins if cors_origins else '❌ MISSING'}")
        print(f"  ✅ DEBUG: {debug}")
    else:
        print(f"  ❌ .env file NOT FOUND at {env_file}")
        return False
    
    return True

def check_data_directory():
    """Check if data directory exists"""
    data_dir = BASE_DIR / 'data'
    if data_dir.exists():
        print(f"  ✅ Data directory exists: {data_dir}")
        
        # List files in data directory
        files = list(data_dir.glob('*.json'))
        print(f"  📁 JSON files: {len(files)}")
        for file in files:
            print(f"     - {file.name}")
    else:
        print(f"  ⚠️  Data directory not found. Creating: {data_dir}")
        data_dir.mkdir(parents=True, exist_ok=True)
        print(f"  ✅ Data directory created")

# Get the directory containing this file
BASE_DIR = Path(__file__).resolve().parent

# Add the backend directory to Python path
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Set the working directory (important for relative paths in the app)
os.chdir(str(BASE_DIR))

# Print startup information (visible in PythonAnywhere error log)
print("=" * 70)
print("🚀 FB Reply AI Backend - WSGI Starting")
print("=" * 70)
print(f"📅 Startup Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
print(f"📂 Base Directory: {BASE_DIR}")
print(f"📂 Working Directory: {os.getcwd()}")
print(f"🐍 Python Version: {sys.version.split()[0]}")
print(f"🔧 Python Executable: {sys.executable}")
print("=" * 70)

# Check dependencies
print("\n📦 Checking Dependencies:")
missing = check_dependencies()

if missing:
    print("=" * 70)
    print("❌ CRITICAL: Missing required packages!")
    print(f"❌ Missing: {', '.join(missing)}")
    print("=" * 70)
    print("🔧 To fix, run in PythonAnywhere Bash console:")
    print("   cd ~/fb-reply/backend")
    print("   workon fb-reply-env")
    print("   pip install -r requirements.txt")
    print("=" * 70)
    raise ImportError(f"Missing required packages: {', '.join(missing)}")

# Check environment
print("=" * 70)
env_ok = check_environment()

# Check data directory
print("\n📁 Checking Data Directory:")
check_data_directory()

print("=" * 70)

if not env_ok:
    print("⚠️  WARNING: Environment configuration issues detected")
    print("=" * 70)

# Import the FastAPI app
try:
    print("\n⏳ Importing FastAPI application...")
    from main import app as fastapi_app
    
    print("=" * 70)
    print("✅ SUCCESS: FastAPI application imported")
    print(f"✅ Application: {fastapi_app.title}")
    print(f"✅ Version: {fastapi_app.version}")
    print(f"✅ Debug Mode: {os.getenv('DEBUG', 'True')}")
    
    # Get CORS configuration
    cors_origins = os.getenv('CORS_ORIGINS', '*')
    print(f"✅ CORS Origins: {cors_origins}")
    
    # Wrap FastAPI (ASGI) app with ASGI-to-WSGI adapter
    print("\n🔄 Wrapping FastAPI with ASGI-to-WSGI adapter...")
    from asgiref.wsgi import WsgiToAsgi
    application = WsgiToAsgi(fastapi_app)
    print("✅ ASGI-to-WSGI adapter applied")
    
    print("=" * 70)
    print("🎉 Backend is READY to handle requests!")
    print("🌐 API Endpoints:")
    print("   - Root: /")
    print("   - Docs: /docs")
    print("   - Training: /api/train")
    print("   - Reply: /api/reply")
    print("   - Chat: /api/chat")
    print("   - Facebook: /api/facebook/*")
    print("=" * 70)
    print(f"✅ WSGI Application Ready at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 70)
    
except Exception as e:
    print("=" * 70)
    print("❌ CRITICAL ERROR: Failed to import FastAPI application")
    print("=" * 70)
    print(f"❌ Error Type: {type(e).__name__}")
    print(f"❌ Error Message: {str(e)}")
    print("=" * 70)
    
    # Print full traceback
    import traceback
    print("📋 Full Traceback:")
    print(traceback.format_exc())
    print("=" * 70)
    
    raise

# This is what WSGI servers will use
# PythonAnywhere, Gunicorn, uWSGI, etc. will look for 'application'
__all__ = ['application']

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
print(f"🐍 Python Version: {sys.version}")
print(f"🔧 Python Path: {sys.path[:3]}...")
print("=" * 70)

try:
    # Import the FastAPI app from main.py
    from main import app as application
    print("✅ FastAPI application imported successfully")
    print(f"✅ Application: {application.title} v{application.version}")
    print("=" * 70)
    print("🎉 Backend is ready to handle requests!")
    print("=" * 70)
except Exception as e:
    print("=" * 70)
    print("❌ ERROR: Failed to import FastAPI application")
    print(f"❌ Error: {str(e)}")
    print("=" * 70)
    raise

# This is what WSGI servers will use
# PythonAnywhere, Gunicorn, uWSGI, etc. will look for 'application'
__all__ = ['application']

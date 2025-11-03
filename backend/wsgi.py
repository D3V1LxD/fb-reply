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

# Get the directory containing this file
BASE_DIR = Path(__file__).resolve().parent

# Add the backend directory to Python path
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

# Set the working directory (important for relative paths in the app)
os.chdir(str(BASE_DIR))

# Import the FastAPI app from main.py
from main import app as application

# This is what WSGI servers will use
# PythonAnywhere, Gunicorn, uWSGI, etc. will look for 'application'
__all__ = ['application']

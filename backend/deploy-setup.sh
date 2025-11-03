#!/bin/bash

echo "🚀 Preparing Backend for Deployment..."

# Create necessary directories
mkdir -p data
chmod 755 data

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env from .env.example..."
    cp .env.example .env
    echo "📝 Please edit .env and add your API keys!"
fi

# Check Python version
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "✓ Python version: $python_version"

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

echo "✅ Backend setup complete!"
echo ""
echo "📋 Next steps for PythonAnywhere deployment:"
echo "1. Upload this backend folder to PythonAnywhere"
echo "2. Run this script in PythonAnywhere Bash console"
echo "3. Configure WSGI file (see DEPLOYMENT.md)"
echo "4. Add environment variables to .env"
echo "5. Reload your web app"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"

# PythonAnywhere Deployment Guide

Complete step-by-step guide to deploy the FastAPI backend on PythonAnywhere.

## Prerequisites
- PythonAnywhere account (free tier works)
- Your GitHub repository: https://github.com/D3V1LxD/fb-reply
- GitHub token for authentication

---

## Part 1: Initial Setup (One-Time)

### Step 1: Create PythonAnywhere Account
1. Go to https://www.pythonanywhere.com/
2. Sign up for a free account or login (username: `oneai`)
3. Verify your email

### Step 2: Clone Your Repository
1. Click on **"Consoles"** tab → **"Bash"**
2. In the Bash console, run:
```bash
# Clone your repository
git clone https://github.com/D3V1LxD/fb-reply.git
cd fb-reply/backend

# Verify files are there
ls -la
```

### Step 3: Create Virtual Environment
```bash
# Still in the bash console
cd ~/fb-reply/backend

# Create virtual environment with Python 3.10
mkvirtualenv --python=/usr/bin/python3.10 fb-reply-env

# Virtual environment will activate automatically
# You should see (fb-reply-env) in your prompt
```

### Step 4: Install Dependencies
```bash
# Make sure you're in the backend directory with venv activated
cd ~/fb-reply/backend
workon fb-reply-env

# Install all required packages
pip install -r requirements.txt

# Verify installation
pip list
```

### Step 5: Create Environment File
```bash
# Create .env file
nano ~/fb-reply/backend/.env
```

Paste this content (replace with your actual token):
```env
# GitHub Token (required for GitHub Models API)
GITHUB_TOKEN=your_actual_github_token_here

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False

# CORS Origins (Frontend URLs allowed to access the API)
CORS_ORIGINS=https://fb-reply.vercel.app,http://localhost:3000,http://localhost:3001
```

**Save and exit:** Press `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Create Data Directory
```bash
# Create directory for data storage
mkdir -p ~/fb-reply/backend/data

# Verify it was created
ls -la ~/fb-reply/backend/
```

---

## Part 2: Configure Web App

### Step 7: Create Web App
1. Click on **"Web"** tab at the top
2. Click **"Add a new web app"**
3. Click **"Next"** (use your default domain: `oneai.pythonanywhere.com`)
4. Select **"Manual configuration"** (NOT Flask/Django)
5. Choose **Python 3.10**
6. Click **"Next"**

### Step 8: Configure WSGI File
1. In the **Web** tab, scroll to **"Code"** section
2. Click on the **WSGI configuration file** link (e.g., `/var/www/oneai_pythonanywhere_com_wsgi.py`)
3. **Delete all existing content** in the file
4. Paste this content:

```python
import sys
import os

# Add your project directory to the sys.path
project_home = '/home/oneai/fb-reply/backend'
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Set environment variables
os.environ['PYTHONPATH'] = project_home

# Import the FastAPI app
from main import app as application
```

5. Click **"Save"** button at the top

### Step 9: Configure Virtual Environment
1. Still in the **Web** tab, scroll to **"Virtualenv"** section
2. In the **"Enter path to a virtualenv"** field, paste:
   ```
   /home/oneai/.virtualenvs/fb-reply-env
   ```
3. Press Enter or click outside the field to save

### Step 10: Set Working Directory
1. Scroll to **"Code"** section
2. Set **"Working directory"** to:
   ```
   /home/oneai/fb-reply/backend
   ```

### Step 11: Configure Static Files (Optional)
Skip this - FastAPI doesn't need static file configuration on PythonAnywhere

---

## Part 3: Deploy and Test

### Step 12: Reload Web App
1. Scroll to the top of the **Web** tab
2. Click the big green **"Reload"** button
3. Wait for reload to complete (~10-30 seconds)

### Step 13: Check Error Logs
1. In the **Web** tab, scroll to **"Log files"** section
2. Click on **"Error log"** link
3. Check for any errors - should see something like:
   ```
   Application startup complete.
   ```

### Step 14: Test Your API
Open these URLs in your browser:

1. **Root endpoint:** https://oneai.pythonanywhere.com/
   - Should return: `{"message": "FB Reply AI Backend API"}`

2. **API docs:** https://oneai.pythonanywhere.com/docs
   - Should show FastAPI interactive documentation

3. **Health check:** Test from your frontend at https://fb-reply.vercel.app/

---

## Part 4: Updating Your Backend

### When You Make Code Changes:

1. **Open Bash console** on PythonAnywhere
2. **Pull latest changes:**
   ```bash
   cd ~/fb-reply/backend
   git pull origin main
   ```

3. **Update dependencies (if requirements.txt changed):**
   ```bash
   workon fb-reply-env
   pip install -r requirements.txt
   ```

4. **Update environment variables (if needed):**
   ```bash
   nano ~/fb-reply/backend/.env
   # Make your changes
   # Save: Ctrl+X, Y, Enter
   ```

5. **Reload web app:**
   - Go to **Web** tab → Click **"Reload"** button

---

## Part 5: Troubleshooting

### Problem: "ModuleNotFoundError"
**Solution:**
```bash
cd ~/fb-reply/backend
workon fb-reply-env
pip install -r requirements.txt
# Then reload web app
```

### Problem: "503 Service Unavailable"
**Solution:**
1. Check error log in Web tab
2. Make sure virtual environment path is correct: `/home/oneai/.virtualenvs/fb-reply-env`
3. Verify WSGI file has correct paths
4. Reload web app

### Problem: CORS errors from frontend
**Solution:**
```bash
nano ~/fb-reply/backend/.env
# Update CORS_ORIGINS to include your Vercel URL:
CORS_ORIGINS=https://fb-reply.vercel.app,http://localhost:3000
# Save and reload web app
```

### Problem: "Application startup failed"
**Solution:**
1. Check error log for specific error
2. Verify .env file has GITHUB_TOKEN set
3. Make sure data directory exists: `mkdir -p ~/fb-reply/backend/data`
4. Check file permissions: `ls -la ~/fb-reply/backend/`

### Problem: GitHub token errors
**Solution:**
```bash
nano ~/fb-reply/backend/.env
# Add or update your token:
GITHUB_TOKEN=your_actual_github_token_here
# Save and reload
```

---

## Part 6: Monitoring

### Check Logs:
```bash
# Error logs (in Bash console)
tail -f ~/fb-reply/backend/error.log

# Or view in Web tab → Log files → Error log
```

### View Running Processes:
```bash
# Check if app is running
ps aux | grep python
```

### Test API Health:
```bash
# From bash console
curl https://oneai.pythonanywhere.com/
```

---

## Important Notes

1. **Free Tier Limitations:**
   - App sleeps after 3 months of inactivity
   - Limited CPU/bandwidth per day
   - One web app only

2. **Data Persistence:**
   - Files in `/home/oneai/fb-reply/backend/data/` persist
   - They are NOT in git (excluded by .gitignore)
   - Backup important data separately

3. **Environment Variables:**
   - `.env` file is gitignored (secure)
   - You must create it manually on PythonAnywhere
   - Never commit sensitive tokens to GitHub

4. **Reload Required:**
   - Always reload web app after code/config changes
   - Reload button is on the Web tab

5. **HTTPS:**
   - PythonAnywhere provides free HTTPS: `https://oneai.pythonanywhere.com`
   - Already configured and working

---

## Quick Commands Reference

```bash
# Activate virtual environment
workon fb-reply-env

# Pull latest code
cd ~/fb-reply/backend && git pull origin main

# Reinstall dependencies
pip install -r requirements.txt

# Edit environment variables
nano ~/fb-reply/backend/.env

# Check error logs
tail -f ~/fb-reply/backend/error.log

# View data files
ls -la ~/fb-reply/backend/data/

# Test API locally (from bash)
curl https://oneai.pythonanywhere.com/
```

---

## Your Current Setup

- **Username:** oneai
- **Backend URL:** https://oneai.pythonanywhere.com
- **Frontend URL:** https://fb-reply.vercel.app
- **Repository:** https://github.com/D3V1LxD/fb-reply
- **Python Version:** 3.10
- **Virtual Environment:** fb-reply-env

---

## Support

- PythonAnywhere Help: https://help.pythonanywhere.com/
- FastAPI Docs: https://fastapi.tiangolo.com/
- Your GitHub Repo: https://github.com/D3V1LxD/fb-reply

---

**Status:** ✅ Backend configured and running at https://oneai.pythonanywhere.com

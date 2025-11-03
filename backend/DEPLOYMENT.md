# FB Reply AI - Backend

Python FastAPI backend for AI-powered message reply system.

## 🚀 Deployment to PythonAnywhere

### Step 1: Sign Up & Setup

1. Go to [pythonanywhere.com](https://www.pythonanywhere.com/)
2. Create a free account
3. Go to your Dashboard

### Step 2: Upload Code

**Option A: Using Git (Recommended)**

1. Open a Bash console from Dashboard
2. Clone your repository:
```bash
git clone https://github.com/YOUR_USERNAME/fb-reply-ai.git
cd fb-reply-ai/backend
```

**Option B: Manual Upload**

1. Use the "Files" tab to upload your `backend` folder
2. Navigate to `/home/YOUR_USERNAME/backend/`

### Step 3: Create Virtual Environment

In the Bash console:

```bash
cd ~/fb-reply-ai/backend
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create `.env` file:

```bash
nano .env
```

Add your configuration:
```env
GITHUB_TOKEN=your_github_token_here
OPENAI_API_KEY=your_openai_key_here
HOST=0.0.0.0
PORT=8000
DEBUG=False
```

Save with `Ctrl+X`, `Y`, `Enter`

### Step 5: Setup Web App

1. Go to **Web** tab in PythonAnywhere
2. Click **Add a new web app**
3. Choose **Manual configuration**
4. Select **Python 3.10**
5. Click **Next**

### Step 6: Configure WSGI File

1. In the Web tab, click on the **WSGI configuration file** link
2. Delete all content and replace with:

```python
import sys
import os
from dotenv import load_dotenv

# Add your project directory to the sys.path
path = '/home/YOUR_USERNAME/fb-reply-ai/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# Load environment variables
load_dotenv(os.path.join(path, '.env'))

# Import the FastAPI app
from main import app as application
```

Replace `YOUR_USERNAME` with your PythonAnywhere username.

3. Save the file

### Step 7: Configure Virtual Environment

1. In the Web tab, find **Virtualenv** section
2. Enter the path to your virtual environment:
```
/home/YOUR_USERNAME/fb-reply-ai/backend/venv
```

### Step 8: Setup Static Files (Optional)

If you need to serve static files:

1. In Web tab, scroll to **Static files** section
2. Add:
   - URL: `/static/`
   - Directory: `/home/YOUR_USERNAME/fb-reply-ai/backend/static/`

### Step 9: Reload Web App

1. Click the big green **Reload** button
2. Your API should now be live at: `https://YOUR_USERNAME.pythonanywhere.com`

### Step 10: Test Your API

Visit these URLs:
- `https://YOUR_USERNAME.pythonanywhere.com/` - Health check
- `https://YOUR_USERNAME.pythonanywhere.com/docs` - API documentation

## 📁 Required Files for Deployment

Make sure these files exist:

```
backend/
├── main.py                 # FastAPI app
├── models.py              # Pydantic models
├── storage.py             # Data storage
├── ai_service.py          # AI integration
├── facebook_service.py    # Facebook integration
├── requirements.txt       # Python dependencies
├── .env                   # Environment variables (create on server)
└── data/                  # Data directory (create on server)
```

## 🔧 Troubleshooting

### Error: "ModuleNotFoundError"

Check virtualenv is activated and packages installed:
```bash
source ~/fb-reply-ai/backend/venv/bin/activate
pip install -r requirements.txt
```

### Error: "Permission denied"

Make sure file permissions are correct:
```bash
chmod +x ~/fb-reply-ai/backend/main.py
```

### Error: "Database/File errors"

Create data directory:
```bash
mkdir -p ~/fb-reply-ai/backend/data
chmod 755 ~/fb-reply-ai/backend/data
```

### Check Logs

View error logs:
1. Go to Web tab
2. Click on error log link
3. Check for errors

Or in Bash console:
```bash
tail -f /var/log/YOUR_USERNAME.pythonanywhere.com.error.log
```

## 🔄 Updating Your Code

When you update your code:

1. SSH or use Bash console
2. Pull latest changes:
```bash
cd ~/fb-reply-ai/backend
git pull origin main
```

3. Install any new dependencies:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

4. Reload web app from Web tab

## 🌐 Custom Domain (Paid Plans Only)

Free accounts get: `YOUR_USERNAME.pythonanywhere.com`

For custom domain:
1. Upgrade to paid plan
2. Go to Web tab
3. Add your custom domain
4. Update DNS settings

## 📊 Database Considerations

Current setup uses JSON files. For production:

1. **SQLite** (included, no setup needed):
```python
import sqlite3
```

2. **MySQL** (free on PythonAnywhere):
   - Create database in Databases tab
   - Update connection settings

3. **PostgreSQL** (requires paid plan)

## 🔐 Security Best Practices

1. **Never commit `.env` file** to Git
2. **Use strong passwords** in production
3. **Enable HTTPS** (automatic on PythonAnywhere)
4. **Rotate API keys** regularly
5. **Set DEBUG=False** in production
6. **Implement rate limiting**

## 📝 Environment Variables

Required variables in `.env`:

```env
# AI Configuration
GITHUB_TOKEN=github_pat_xxxxx          # GitHub Models API token
# OR
OPENAI_API_KEY=sk-xxxxx                # OpenAI API key

# Server Configuration
HOST=0.0.0.0
PORT=8000
DEBUG=False                             # Set to False in production

# Optional: Database (if using)
DATABASE_URL=postgresql://...
```

## 🚀 Performance Tips

1. **Use caching** for training data
2. **Implement connection pooling** for databases
3. **Compress responses** with gzip
4. **Use CDN** for static files
5. **Monitor performance** with logs

## 📈 Scaling Options

Free tier limits:
- 512 MB storage
- 1 web app
- Daily CPU limit

For scaling:
1. Upgrade to Hacker/Web Developer plan
2. Use multiple workers
3. Implement caching (Redis)
4. Use background tasks (Celery)

## 🆘 Getting Help

- [PythonAnywhere Forums](https://www.pythonanywhere.com/forums/)
- [PythonAnywhere Help](https://help.pythonanywhere.com/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## 📧 Support

Create an issue on GitHub for code-related problems.

---

Your API URL: `https://YOUR_USERNAME.pythonanywhere.com`

Update this in your frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://YOUR_USERNAME.pythonanywhere.com
```

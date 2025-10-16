# Deployment Guide

This guide will help you deploy the Frame Extractor application to various hosting platforms.

## 🚀 Quick Deploy to Render (Recommended)

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Frame Extractor App"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### Step 2: Deploy to Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `frame-extractor`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Click "Create Web Service"

### Step 3: Deploy Frontend (Optional)
For the frontend, you can:
1. Create another Render service as a "Static Site"
2. Point it to your `frontend/` directory
3. Or serve it from the backend (see below)

## 🌐 Alternative Hosting Options

### Heroku
1. Install Heroku CLI
2. Create `Procfile` (already included)
3. Deploy:
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

### Railway
1. Connect GitHub repo to Railway
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`

### Vercel (Backend only)
1. Install Vercel CLI
2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "backend/main.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "backend/main.py"
       }
     ]
   }
   ```

## 🔧 Serving Frontend from Backend

To serve the frontend from the same backend server, add this to your `backend/main.py`:

```python
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

# Add after your routes
app.mount("/static", StaticFiles(directory="../frontend"), name="static")

@app.get("/")
async def serve_frontend():
    return FileResponse('../frontend/index.html')
```

## 📋 Environment Variables

For production, consider setting:
- `PYTHON_VERSION=3.11.0`
- `DEBUG=False`
- `ALLOWED_HOSTS=yourdomain.com`

## 🐛 Troubleshooting

### Common Issues:
1. **Port Issues**: Ensure you're using `$PORT` environment variable
2. **Path Issues**: Use relative paths, not absolute
3. **Dependencies**: All packages must be in `requirements.txt`
4. **Static Files**: Configure static file serving properly

### Debug Commands:
```bash
# Check if all imports work
python -c "import backend.main"

# Test locally with production settings
cd backend && uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🔒 Security Notes

For production:
1. Set up proper CORS origins
2. Add authentication if needed
3. Use environment variables for secrets
4. Enable HTTPS
5. Add rate limiting

## 📊 Monitoring

Consider adding:
- Health check endpoint (`/health`)
- Logging configuration
- Error tracking (Sentry)
- Performance monitoring

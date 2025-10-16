# 🚀 Quick Deployment Guide

## Option 1: Netlify (Recommended - FREE)

**Deploy your Frame Extractor with full DOCX/PDF support in 2 minutes:**

1. **Go to [netlify.com](https://netlify.com)**
2. **Sign up with GitHub**
3. **Click "New site from Git"**
4. **Connect repository**: `https://github.com/0xabhiram/Arjun-Shetty`
5. **Build settings** (auto-detected):
   - Build command: `pip install -r requirements.txt`
   - Publish directory: `frontend`
6. **Click "Deploy site"**

**✅ You're done!** Your app will be live with:
- Full DOCX/PDF support
- Server-side processing
- Advanced PDF export
- No file size limits

---

## Option 2: Render (FREE Tier)

**Deploy with 750 free hours/month:**

1. **Go to [render.com](https://render.com)**
2. **Sign up with GitHub**
3. **Click "New +" → "Web Service"**
4. **Connect repository**: `https://github.com/0xabhiram/Arjun-Shetty`
5. **Configure**:
   - Name: `frame-extractor`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
6. **Click "Create Web Service"**

---

## Option 3: GitHub Pages (Current - LIMITED)

**What you have now:**
- ✅ Free hosting
- ✅ Basic DOCX text extraction
- ✅ Text file support
- ⚠️ Limited functionality
- ⚠️ Client-side only

**To use:** Just visit [https://0xabhiram.github.io](https://0xabhiram.github.io)

---

## 📊 Feature Comparison

| Feature | GitHub Pages | Netlify | Render |
|---------|-------------|---------|---------|
| **Cost** | Free | Free | Free (750hrs) |
| **DOCX Support** | Basic | Full | Full |
| **PDF Support** | ❌ | ✅ | ✅ |
| **Server Processing** | ❌ | ✅ | ✅ |
| **File Size Limits** | Yes | No | No |
| **Setup Time** | ✅ Done | 2 min | 3 min |

---

## 🎯 Recommendation

**For best results:** Use **Netlify** - it's free, fast, and gives you the full Frame Extractor experience!

**Current status:** Your GitHub Pages version works great for text files and basic DOCX processing.

---

## 🔗 Quick Links

- **GitHub Repository**: [https://github.com/0xabhiram/Arjun-Shetty](https://github.com/0xabhiram/Arjun-Shetty)
- **Current GitHub Pages**: [https://0xabhiram.github.io](https://0xabhiram.github.io)
- **Deploy to Netlify**: [netlify.com](https://netlify.com)
- **Deploy to Render**: [render.com](https://render.com)

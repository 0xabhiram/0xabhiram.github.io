# Free Hosting Guide - Netlify & GitHub Pages

This guide shows you how to host your Frame Extractor app for free on Netlify and GitHub Pages.

## 🌐 Option 1: Netlify (Full-Stack - Recommended)

Netlify can host both frontend and backend using serverless functions.

### Setup Steps:

1. **Push to GitHub** (already done):
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push origin main
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Sign up with GitHub
   - Click "New site from Git"
   - Connect your repository: `https://github.com/0xabhiram/Arjun-Shetty`
   - Build settings:
     - Build command: `pip install -r requirements.txt`
     - Publish directory: `frontend`
   - Click "Deploy site"

3. **Configure Functions**:
   - Netlify will automatically detect the `netlify/functions` folder
   - Your API endpoints will be available at `/api/upload` and `/api/export`

### Features:
✅ Full backend functionality  
✅ DOCX and PDF support  
✅ PDF export  
✅ Automatic deployments  
✅ Custom domain support  
✅ SSL certificate  

### Limitations:
- Serverless functions have execution time limits
- File upload size limits
- Cold start delays

---

## 📄 Option 2: GitHub Pages (Frontend Only)

GitHub Pages can only host static files, so we'll create a client-side version.

### Setup Steps:

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Source: "GitHub Actions"
   - Save

2. **Push the GitHub Pages version**:
   ```bash
   git add .
   git commit -m "Add GitHub Pages version"
   git push origin main
   ```

3. **Access your site**:
   - Your site will be available at: `https://0xabhiram.github.io/Arjun-Shetty`

### Features:
✅ Completely free  
✅ No server costs  
✅ Fast loading  
✅ Automatic deployments  
✅ Custom domain support  

### Limitations:
- Text files only (no DOCX/PDF parsing)
- Client-side PDF generation only
- Data saved in browser localStorage
- No server-side processing

---

## 🚀 Option 3: Hybrid Approach (Best of Both)

Host frontend on GitHub Pages + Backend on free tier services:

### Frontend (GitHub Pages):
- Use the `frontend-github-pages/` version
- Deploy to GitHub Pages
- Fast, reliable, free

### Backend Options:

#### A. Render (Free Tier):
- 750 hours/month free
- Automatic deployments from GitHub
- Use the existing `render.yaml` configuration

#### B. Railway:
- $5 credit monthly (usually covers small apps)
- Easy GitHub integration
- Good performance

#### C. Heroku (Limited Free):
- No longer offers free tier
- $7/month for basic dyno

#### D. Vercel (Serverless):
- Free tier available
- Good for API functions
- Requires conversion to Vercel functions

---

## 📊 Comparison Table

| Feature | Netlify | GitHub Pages | Hybrid |
|---------|---------|--------------|--------|
| **Cost** | Free | Free | Free/Low |
| **Backend** | ✅ Serverless | ❌ No | ✅ External |
| **DOCX/PDF** | ✅ Full | ❌ Text only | ✅ Depends |
| **PDF Export** | ✅ Server | ✅ Client | ✅ Depends |
| **Performance** | Good | Excellent | Good |
| **Complexity** | Medium | Low | High |

---

## 🎯 Recommended Approach

### For Development/Demo:
**GitHub Pages** - Simple, fast, free

### For Production:
**Netlify** - Full functionality, still free

### For Enterprise:
**Hybrid** - GitHub Pages frontend + Render backend

---

## 🔧 Quick Setup Commands

### Netlify:
```bash
# Already configured, just push to GitHub
git push origin main
# Then connect to Netlify via web interface
```

### GitHub Pages:
```bash
# Enable Pages in repository settings
# Then push (already done)
git push origin main
```

### Hybrid (GitHub Pages + Render):
```bash
# 1. Enable GitHub Pages (frontend)
# 2. Deploy backend to Render using existing config
# 3. Update frontend API URL to point to Render backend
```

---

## 🌍 Custom Domains

Both platforms support custom domains:

### Netlify:
1. Go to Site settings → Domain management
2. Add custom domain
3. Configure DNS records

### GitHub Pages:
1. Go to repository settings → Pages
2. Add custom domain
3. Configure DNS records
4. Enable HTTPS

---

## 📱 Mobile Support

Both versions are mobile-responsive and work on:
- iOS Safari
- Android Chrome
- Mobile browsers

---

## 🔒 Security Notes

### Netlify:
- Automatic HTTPS
- Environment variables for secrets
- Function-level security

### GitHub Pages:
- HTTPS enabled by default
- No server-side secrets needed
- Client-side data only

---

## 🆘 Troubleshooting

### Common Issues:

1. **Netlify Functions Not Working**:
   - Check function names match API calls
   - Verify Python dependencies in requirements.txt
   - Check Netlify function logs

2. **GitHub Pages Not Updating**:
   - Check GitHub Actions workflow
   - Verify Pages is enabled
   - Check for build errors

3. **CORS Issues**:
   - Update API URLs in frontend
   - Configure CORS in backend
   - Use relative URLs where possible

### Support:
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)
- Project Issues: Create GitHub issue in repository

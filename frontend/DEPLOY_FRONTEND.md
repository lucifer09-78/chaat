# Frontend Deployment Guide

## Option 1: Vercel (Easiest - Recommended)

### Step 1: Prepare Your Code

1. **Create environment file for production:**

Create `frontend/.env.production`:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

Note: You'll update these URLs after deploying the backend.

2. **Test the build locally:**
```bash
cd frontend
npm install
npm run build
```

If the build succeeds, you're ready to deploy!

### Step 2: Deploy to Vercel

**Method A: Using Vercel Website (No CLI needed)**

1. Go to https://vercel.com
2. Sign up with GitHub/GitLab/Bitbucket
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Add Environment Variables:
   - `VITE_API_BASE_URL` = `http://localhost:8080` (temporary)
   - `VITE_WS_BASE_URL` = `ws://localhost:8080` (temporary)
7. Click "Deploy"

**Method B: Using Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? social-messaging-platform
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

After deployment, update environment variables in Vercel dashboard:

1. Go to your project in Vercel
2. Settings → Environment Variables
3. Update:
   - `VITE_API_BASE_URL` = Your backend URL (e.g., `https://api.yourdomain.com`)
   - `VITE_WS_BASE_URL` = Your WebSocket URL (e.g., `wss://api.yourdomain.com`)
4. Redeploy

---

## Option 2: Netlify

### Step 1: Prepare

```bash
cd frontend
npm install
npm run build
```

### Step 2: Deploy

**Method A: Drag and Drop**

1. Go to https://app.netlify.com
2. Sign up/Login
3. Drag the `dist` folder to the deploy area
4. Done!

**Method B: Using Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod --dir=dist

# Follow prompts
```

### Step 3: Configure

1. Go to Site settings → Build & deploy → Environment
2. Add variables:
   - `VITE_API_BASE_URL`
   - `VITE_WS_BASE_URL`
3. Trigger redeploy

---

## Option 3: GitHub Pages (Free)

### Step 1: Update vite.config.js

```javascript
import { definePlugin } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/social-messaging-platform/', // Your repo name
  // ... rest of config
})
```

### Step 2: Add deployment script

Add to `package.json`:
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### Step 3: Install gh-pages

```bash
npm install --save-dev gh-pages
```

### Step 4: Deploy

```bash
npm run deploy
```

### Step 5: Enable GitHub Pages

1. Go to repository Settings
2. Pages → Source → gh-pages branch
3. Save

---

## Option 4: Self-Hosted (Your Own Server)

### Step 1: Build

```bash
cd frontend
npm install
npm run build
```

### Step 2: Upload to Server

```bash
# Using SCP
scp -r dist/* user@your-server:/var/www/html/

# Or using SFTP client like FileZilla
```

### Step 3: Configure Web Server

**For Nginx:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**For Apache:**

Create `.htaccess` in dist folder:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## Quick Deployment Commands

### Vercel
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Netlify
```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

### Build Only
```bash
cd frontend
npm install
npm run build
# Output in: dist/
```

---

## After Deployment

### 1. Update Backend CORS

Update `CorsConfig.java` with your frontend URL:

```java
.allowedOrigins(
    "https://your-vercel-app.vercel.app",
    "https://yourdomain.com"
)
```

### 2. Test Your Deployment

1. Open your deployed URL
2. Check browser console for errors
3. Test login/registration
4. Test messaging
5. Test WebSocket connection

### 3. Custom Domain (Optional)

**Vercel:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

**Netlify:**
1. Go to Domain settings
2. Add custom domain
3. Update DNS records

---

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Environment Variables Not Working

- Make sure they start with `VITE_`
- Rebuild after changing env vars
- Check they're set in deployment platform

### 404 on Refresh

- Configure SPA routing (see web server configs above)
- For Vercel/Netlify, this is automatic

### API Calls Failing

- Check CORS configuration in backend
- Verify API URL in environment variables
- Check browser console for errors

---

## Recommended: Vercel

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Easy custom domains
- ✅ Automatic deployments from Git
- ✅ Preview deployments for PRs
- ✅ Built-in analytics

**Deployment Time:** ~2 minutes

---

## Cost Comparison

| Platform | Free Tier | Paid Plans | Custom Domain |
|----------|-----------|------------|---------------|
| Vercel | ✅ Yes | $20/month | ✅ Free |
| Netlify | ✅ Yes | $19/month | ✅ Free |
| GitHub Pages | ✅ Yes | N/A | ✅ Free |
| Self-Hosted | ❌ No | $5-50/month | ✅ Free |

---

## Next Steps

1. Choose deployment platform
2. Deploy frontend
3. Get the deployed URL
4. Update backend CORS with frontend URL
5. Update frontend environment variables with backend URL
6. Test everything
7. (Optional) Add custom domain

Need help? Check the main PRODUCTION_DEPLOYMENT.md file!

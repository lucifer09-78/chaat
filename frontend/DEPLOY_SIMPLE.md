# Simple Frontend Deployment - Step by Step

## The Easiest Way: Vercel (5 Minutes)

### What You Need:
- GitHub account (or GitLab/Bitbucket)
- Your code pushed to GitHub

---

## Step-by-Step Instructions

### 1. Push Your Code to GitHub (if not already done)

```bash
# In your project root
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Go to Vercel

1. Open https://vercel.com in your browser
2. Click "Sign Up" (use your GitHub account)
3. Authorize Vercel to access your repositories

### 3. Import Your Project

1. Click "Add New..." → "Project"
2. Find your repository in the list
3. Click "Import"

### 4. Configure the Project

You'll see a configuration screen. Set these values:

**Framework Preset:** Vite (should auto-detect)

**Root Directory:** Click "Edit" and type: `frontend`

**Build Settings:**
- Build Command: `npm run build` (should be auto-filled)
- Output Directory: `dist` (should be auto-filled)
- Install Command: `npm install` (should be auto-filled)

**Environment Variables:** Click "Add" and add these:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `http://localhost:8080` |
| `VITE_WS_BASE_URL` | `ws://localhost:8080` |

Note: We'll update these after deploying the backend

### 5. Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. You'll see "Congratulations!" when done

### 6. Get Your URL

You'll get a URL like: `https://your-project-name.vercel.app`

Copy this URL - you'll need it!

---

## After Deployment

### Update Backend CORS

Your backend needs to allow requests from your new frontend URL.

1. Open `social-messaging-platform/src/main/java/com/example/socialmessaging/config/CorsConfig.java`

2. Update the `allowedOrigins` to include your Vercel URL:

```java
.allowedOrigins(
    "http://localhost:5173",  // Keep for local development
    "https://your-project-name.vercel.app"  // Add your Vercel URL
)
```

3. Rebuild and restart your backend

### Update Frontend Environment Variables (After Backend is Deployed)

Once your backend is deployed:

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Edit the variables:
   - `VITE_API_BASE_URL` → Your backend URL (e.g., `https://api.yourdomain.com`)
   - `VITE_WS_BASE_URL` → Your WebSocket URL (e.g., `wss://api.yourdomain.com`)
4. Go to "Deployments" tab
5. Click "..." on the latest deployment → "Redeploy"

---

## Alternative: Deploy Using Command Line

If you prefer using the terminal:

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

Follow the prompts to login with your GitHub account.

### 3. Deploy

```bash
cd frontend
vercel
```

Answer the questions:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **social-messaging-platform** (or your choice)
- In which directory is your code located? **./`**
- Want to override settings? **No**

### 4. Deploy to Production

```bash
vercel --prod
```

---

## Testing Your Deployment

1. Open your Vercel URL in a browser
2. Open browser console (F12)
3. Check for any errors
4. Try to register/login (will fail until backend is deployed)

---

## Common Issues

### "Build Failed"

**Solution:** Run locally first:
```bash
cd frontend
npm install
npm run build
```

Fix any errors, commit, and push again.

### "Cannot connect to backend"

**Solution:** 
1. Make sure backend is running
2. Check CORS configuration
3. Verify environment variables in Vercel

### "Page not found on refresh"

**Solution:** This is automatically handled by Vercel for Vite projects. If it happens, check your `vite.config.js`.

---

## Quick Reference

### Vercel Dashboard URLs
- Projects: https://vercel.com/dashboard
- Deployments: https://vercel.com/[your-username]/[project-name]
- Settings: https://vercel.com/[your-username]/[project-name]/settings

### Useful Commands
```bash
# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

---

## What's Next?

1. ✅ Frontend deployed
2. ⬜ Deploy backend (see PRODUCTION_DEPLOYMENT.md)
3. ⬜ Update environment variables
4. ⬜ Update CORS configuration
5. ⬜ Test everything
6. ⬜ (Optional) Add custom domain

---

## Need Help?

- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check DEPLOY_FRONTEND.md for more options

---

## Cost

**Vercel Free Tier Includes:**
- Unlimited deployments
- Automatic HTTPS
- Global CDN
- 100GB bandwidth/month
- Custom domains

**Perfect for:**
- Personal projects
- Small applications
- Testing/staging environments

You can upgrade later if needed!

# Simple Deployment Fix

Your code is correct! The compilation error is from Render's cached build. Here's how to fix it:

## Step 1: Clear Render Build Cache

1. Go to https://dashboard.render.com
2. Click your **Web Service** (backend)
3. Click **"Manual Deploy"**
4. Select **"Clear build cache & deploy"**
5. Wait 5-10 minutes

## Step 2: Set Environment Variables

While it's building, go to **Environment** tab and add:

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<your-database-url>
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Get Database URL:
1. Click your **PostgreSQL** database
2. Find "Connections" section
3. Copy **Internal Database URL**
4. Paste it as `SPRING_DATASOURCE_URL`

## Step 3: Verify Backend Works

Open: `https://your-backend.onrender.com/actuator/health`

Should see: `{"status":"UP"}`

## Step 4: Update Frontend

1. Go to Vercel Dashboard
2. Your project → **Settings** → **Environment Variables**
3. Update:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   VITE_WS_BASE_URL=wss://your-backend.onrender.com
   ```
4. Go to **Deployments** → Click **"Redeploy"**

## Done!

Your app should now work! Test by:
1. Opening your Vercel URL
2. Creating an account
3. Sending a message

---

## Still Having Issues?

Share these with me:
- Last 20 lines of Render logs
- Your environment variables (hide passwords)
- Database status

---

## Quick Files Reference

- `QUICK_DEPLOY.md` - Detailed deployment guide
- `RENDER_FIX.md` - Database connection troubleshooting
- `CLICK_HERE_TO_FIX.txt` - Quick reference
- `FIX_CORS_NOW.bat` - Windows helper script

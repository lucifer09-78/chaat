# Quick Fix for Render Deployment

## The Issue
Your Render deployment failed because of a compilation error with `@JsonProperty`. This is already fixed in your code, but Render needs to rebuild.

## Solution for Render

### Option 1: Force Rebuild on Render (Recommended)

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your **Web Service** (backend)
3. Click **"Manual Deploy"** button
4. Select **"Clear build cache & deploy"**
5. Wait 5-10 minutes for build to complete

### Option 2: Push a Small Change

If Option 1 doesn't work, make a small change to force rebuild:

```bash
cd social-messaging-platform
git add .
git commit -m "Force rebuild for Render"
git push origin main
```

Render will automatically detect the push and rebuild.

---

## Verify Environment Variables

While waiting for build, verify these are set in Render:

### Required Variables:
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<your-internal-database-url>
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### How to Get Internal Database URL:
1. Go to your **PostgreSQL database** in Render
2. Scroll to "Connections" section
3. Copy **Internal Database URL**
4. Should look like: `postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname`

---

## After Successful Build

### Test Backend:
```
https://your-backend.onrender.com/actuator/health
```
Should return: `{"status":"UP"}`

### Update Frontend (Vercel):
1. Go to Vercel Dashboard
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Update these:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com`
   - `VITE_WS_BASE_URL` = `wss://your-backend.onrender.com`
5. Go to **Deployments** tab
6. Click **"Redeploy"** on latest deployment

---

## If Build Still Fails

Check the logs for the exact error and share:
1. Last 20 lines of build logs
2. Your environment variables (hide passwords)
3. Database status (should be "Available")

---

## Local Testing (Optional)

If you want to test locally first:

### Windows:
```bash
# Run the rebuild script
REBUILD_NOW.bat

# Or manually:
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Check logs:
```bash
docker-compose logs -f app
```

Backend should start on: http://localhost:8080

---

## Quick Checklist

- [ ] Database is "Available" in Render
- [ ] Environment variables are set correctly
- [ ] Cleared build cache and redeployed
- [ ] Build completed successfully (check logs)
- [ ] Health endpoint returns UP
- [ ] Updated Vercel environment variables
- [ ] Redeployed frontend on Vercel
- [ ] Tested login/registration

---

## Common Errors

### "Connection refused"
- Use **Internal** Database URL, not External

### "Authentication failed"
- Database URL must include username and password

### "CORS error"
- Set `CORS_ALLOWED_ORIGINS` to your Vercel URL
- Include `https://` prefix

---

Need help? Share your Render logs and I'll help debug!

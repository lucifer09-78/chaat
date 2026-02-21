# Deploy Backend to Render - Step by Step

## What You'll Get
- ✅ Backend API with automatic HTTPS
- ✅ PostgreSQL database
- ✅ Free tier available (750 hours/month)
- ✅ Automatic deployments from GitHub

**Cost:** Free tier available, or $7/month for database + $7/month for web service

---

## Step-by-Step Guide

### Step 1: Create PostgreSQL Database

1. Go to https://dashboard.render.com
2. Click "New +" → "PostgreSQL"
3. Fill in:
   - **Name:** `social-messaging-db`
   - **Database:** `social_messaging_prod`
   - **User:** `social_messaging_user` (or leave default)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15
   - **Plan:** Free (or Starter $7/month for better performance)
4. Click "Create Database"
5. Wait for database to be created (takes 1-2 minutes)

### Step 2: Get Database Connection Details

1. Click on your database
2. Scroll down to "Connections"
3. Copy the **Internal Database URL** (looks like: `postgresql://user:pass@host/db`)
4. Keep this handy - you'll need it!

---

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Click "Build and deploy from a Git repository"
3. Connect your GitHub account if not already connected
4. Find and select your repository
5. Click "Connect"

### Step 4: Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name:** `social-messaging-backend` (or your choice)
- **Region:** Same as your database
- **Branch:** `main`
- **Root Directory:** Leave empty (or `/` if asked)
- **Runtime:** Docker

**Build Settings:**
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/*.jar`

**Plan:**
- Select "Free" (or "Starter" for $7/month)

### Step 5: Add Environment Variables

Scroll down to "Environment Variables" and click "Add Environment Variable"

Add these one by one:

| Key | Value |
|-----|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `SPRING_DATASOURCE_URL` | Paste your Internal Database URL from Step 2 |
| `CORS_ALLOWED_ORIGINS` | `https://your-vercel-app.vercel.app` |

**Important:** Replace `your-vercel-app.vercel.app` with your actual Vercel URL!

**Example:**
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=postgresql://social_messaging_user:password@dpg-xxxxx.oregon-postgres.render.com/social_messaging_prod
CORS_ALLOWED_ORIGINS=https://my-chat-app.vercel.app
```

### Step 6: Deploy!

1. Click "Create Web Service"
2. Render will start building your application
3. This takes 5-10 minutes for the first build
4. Watch the logs to see progress

### Step 7: Get Your Backend URL

1. Once deployed, you'll see your service URL at the top
2. It looks like: `https://social-messaging-backend.onrender.com`
3. Copy this URL!

---

## Step 8: Update Frontend (Vercel)

Now update your frontend to use the new backend:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update these variables:
   - `VITE_API_BASE_URL` = `https://social-messaging-backend.onrender.com`
   - `VITE_WS_BASE_URL` = `wss://social-messaging-backend.onrender.com`
5. Go to "Deployments" tab
6. Click "..." on latest deployment → "Redeploy"

---

## Step 9: Test Your Deployment

### Test Backend Health

Open in browser:
```
https://social-messaging-backend.onrender.com/actuator/health
```

Should return:
```json
{"status":"UP"}
```

### Test from Frontend

1. Open your Vercel app: `https://your-app.vercel.app`
2. Try to register a new user
3. Try to login
4. Send a message
5. Check browser console (F12) for any errors

---

## Troubleshooting

### Build Failed

**Check the logs:**
1. Go to your web service in Render
2. Click "Logs" tab
3. Look for error messages

**Common issues:**

**"Maven wrapper not executable"**
```bash
# Fix locally and push:
git update-index --chmod=+x mvnw
git commit -m "Make mvnw executable"
git push
```

**"Out of memory"**
- Upgrade to paid plan ($7/month)
- Or optimize your application

### Database Connection Failed

**Check:**
1. Database is running (green status in Render)
2. `SPRING_DATASOURCE_URL` is correct
3. Database URL is the **Internal** URL, not External

**Fix:**
1. Go to your database in Render
2. Copy the "Internal Database URL"
3. Update `SPRING_DATASOURCE_URL` in your web service
4. Render will auto-redeploy

### CORS Errors in Browser

**Symptoms:**
- Frontend shows errors like "blocked by CORS policy"
- API calls fail

**Fix:**
1. Go to your web service → "Environment"
2. Check `CORS_ALLOWED_ORIGINS` matches your Vercel URL exactly
3. Make sure it includes `https://`
4. If you have multiple URLs, separate with commas:
   ```
   CORS_ALLOWED_ORIGINS=https://app1.vercel.app,https://app2.vercel.app
   ```

### Application Keeps Restarting

**Check logs for:**
- Database connection errors
- Port binding issues
- Missing environment variables

**Render automatically sets `PORT` environment variable - your app should use it!**

### Free Tier Limitations

**Free tier spins down after 15 minutes of inactivity**
- First request after spin-down takes 30-60 seconds
- Upgrade to paid plan ($7/month) for always-on service

---

## Configuration Files

### Make sure you have these files:

**1. `src/main/resources/application-prod.properties`**

Already created! Contains production configuration.

**2. `Dockerfile` (if using Docker runtime)**

Render can use your existing Dockerfile or build with Maven directly.

---

## Render Configuration Options

### Option 1: Using Dockerfile (Current Setup)

Render will use your existing `Dockerfile`.

**Pros:**
- Consistent with local development
- Full control over build process

### Option 2: Using Native Build

Change Runtime to "Java" and set:
- **Build Command:** `./mvnw clean package -DskipTests`
- **Start Command:** `java -Dserver.port=$PORT -Dspring.profiles.active=prod -jar target/*.jar`

**Pros:**
- Faster builds
- Simpler configuration

---

## Monitoring Your Application

### View Logs

1. Go to your web service
2. Click "Logs" tab
3. See real-time logs

### View Metrics

1. Click "Metrics" tab
2. See CPU, memory, and request metrics

### Set Up Alerts

1. Go to "Settings" → "Notifications"
2. Add email or Slack notifications
3. Get alerted on deploy failures or crashes

---

## Updating Your Application

### Automatic Deployments

Render automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render will automatically:
1. Detect the push
2. Build your application
3. Deploy the new version
4. Zero-downtime deployment

### Manual Deployment

1. Go to your web service
2. Click "Manual Deploy" → "Deploy latest commit"

### Rollback

1. Go to "Events" tab
2. Find a previous successful deployment
3. Click "Rollback to this version"

---

## Environment Variables Reference

Here are all the environment variables you need:

```bash
# Required
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=postgresql://user:pass@host/database

# CORS (use your actual Vercel URL)
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app

# Optional - if you need to override defaults
SPRING_DATASOURCE_USERNAME=your_db_user
SPRING_DATASOURCE_PASSWORD=your_db_password
```

---

## Cost Breakdown

### Free Tier
- **Web Service:** 750 hours/month (enough for 1 app)
- **Database:** Free tier available (limited resources)
- **Bandwidth:** 100GB/month
- **Build Minutes:** 500 minutes/month

**Limitations:**
- Spins down after 15 minutes of inactivity
- Limited CPU and memory
- Slower cold starts

### Paid Plans

**Starter Plan ($7/month per service):**
- Always-on (no spin down)
- More CPU and memory
- Faster performance
- Priority support

**Total Cost for Production:**
- Web Service: $7/month
- Database: $7/month
- **Total: $14/month**

---

## Security Best Practices

### 1. Use Environment Variables

Never commit sensitive data:
- ✅ Use environment variables for passwords
- ✅ Use environment variables for API keys
- ❌ Don't commit `.env` files

### 2. Enable HTTPS

Render provides automatic HTTPS - no configuration needed!

### 3. Restrict CORS

Only allow your frontend domain:
```
CORS_ALLOWED_ORIGINS=https://your-app.vercel.app
```

Don't use `*` in production!

### 4. Database Security

- Use Internal Database URL (not External)
- Database is only accessible from your Render services
- Enable automatic backups (in database settings)

---

## Backup and Recovery

### Database Backups

1. Go to your database
2. Click "Backups" tab
3. Enable automatic backups
4. Set retention period

### Manual Backup

```bash
# Get External Database URL from Render
pg_dump "postgresql://user:pass@host/db" > backup.sql
```

### Restore from Backup

```bash
psql "postgresql://user:pass@host/db" < backup.sql
```

---

## Performance Optimization

### 1. Upgrade to Paid Plan

Free tier spins down - paid plan is always-on.

### 2. Enable Connection Pooling

Already configured in Spring Boot!

### 3. Add Caching

Consider adding Redis for caching (available on Render).

### 4. Monitor Performance

Use Render's built-in metrics to identify bottlenecks.

---

## Quick Commands Reference

### View Logs
```bash
# Install Render CLI (optional)
npm install -g render-cli

# View logs
render logs
```

### Database Commands
```bash
# Connect to database
psql "postgresql://user:pass@host/db"

# View tables
\dt

# View users
SELECT * FROM users;
```

---

## Common Issues and Solutions

### Issue: "Application failed to start"

**Solution:**
1. Check logs for specific error
2. Verify all environment variables are set
3. Test database connection
4. Check if port is configured correctly

### Issue: "Database connection timeout"

**Solution:**
1. Use Internal Database URL (not External)
2. Check database is running
3. Verify database credentials

### Issue: "Build takes too long"

**Solution:**
1. Builds can take 5-10 minutes first time
2. Subsequent builds are faster (cached)
3. Consider upgrading to paid plan for faster builds

---

## Next Steps

1. ✅ Backend deployed on Render
2. ✅ Database created
3. ✅ Frontend updated with backend URL
4. ⬜ Test all features
5. ⬜ Set up monitoring
6. ⬜ Enable database backups
7. ⬜ (Optional) Add custom domain

---

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Support: support@render.com

---

## Checklist

- [ ] Database created and running
- [ ] Web service created
- [ ] Environment variables configured
- [ ] Application deployed successfully
- [ ] Health check endpoint working
- [ ] Frontend updated with backend URL
- [ ] CORS configured correctly
- [ ] Registration works
- [ ] Login works
- [ ] Messaging works
- [ ] WebSocket connection works
- [ ] Database backups enabled

---

Congratulations! Your backend is now deployed on Render! 🎉

If you encounter any issues, check the logs first, then refer to the troubleshooting section above.

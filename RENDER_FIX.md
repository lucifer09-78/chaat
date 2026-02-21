# Fix Render Deployment - Database Connection Issue

## The Problem
Your deployment failed with: "Exited with status 1 while running your code"
This is a database connection error.

## Solution

### Step 1: Get Database URL

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your **PostgreSQL database** (not web service)
3. Scroll to "Connections" section
4. Copy the **Internal Database URL**
   - Should look like: `postgresql://user:pass@dpg-xxxxx.oregon-postgres.render.com/dbname`

### Step 2: Update Web Service Environment Variables

1. Go to your **Web Service** (the backend app)
2. Click "Environment" tab
3. Update or add these variables:

**Required Variables:**
```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<paste your Internal Database URL here>
```

**Optional but Recommended:**
```
SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
SPRING_JPA_HIBERNATE_DDL_AUTO=update
```

### Step 3: Redeploy

1. After saving environment variables, Render will automatically redeploy
2. Or click "Manual Deploy" → "Deploy latest commit"
3. Wait 5-10 minutes for build to complete

### Step 4: Check Logs

1. Go to "Logs" tab
2. Look for: "Started SocialMessagingPlatformApplication"
3. Should see: "Tomcat started on port(s): 10000"

---

## Alternative: Use Render's Database Connection Feature

### Method 1: Add from Database

1. In your Web Service → "Environment" tab
2. Click "Add Environment Variable"
3. Look for "Add from Database" option
4. Select your PostgreSQL database
5. Render will add `DATABASE_URL` automatically

### Method 2: Update application-prod.properties

If using `DATABASE_URL` (Render's default):

Update `src/main/resources/application-prod.properties`:

```properties
spring.datasource.url=${DATABASE_URL:${SPRING_DATASOURCE_URL}}
```

This will use `DATABASE_URL` if available, otherwise fall back to `SPRING_DATASOURCE_URL`.

Then commit and push:
```bash
git add .
git commit -m "Use DATABASE_URL for Render"
git push origin main
```

---

## Verify Database is Running

1. Go to your PostgreSQL database in Render
2. Status should be "Available" (green)
3. If not, wait for it to start (takes 1-2 minutes)

---

## Common Issues

### Issue: "Connection refused"
**Fix:** Make sure you're using the **Internal** Database URL, not External

### Issue: "Authentication failed"
**Fix:** Database URL includes username and password - make sure it's complete

### Issue: "Database does not exist"
**Fix:** Check the database name in the URL matches your database

---

## Test After Fix

Once deployed successfully:

1. Open: `https://your-app.onrender.com/actuator/health`
2. Should return: `{"status":"UP"}`
3. Test registration from your frontend

---

## If Still Failing

Check these in order:

1. **Database Status:** Is it "Available"?
2. **Environment Variables:** Are they set correctly?
3. **Logs:** What's the exact error message?
4. **Database URL:** Does it include username, password, host, and database name?

Example correct URL:
```
postgresql://myuser:mypassword@dpg-abc123.oregon-postgres.render.com/mydatabase
```

---

## Need More Help?

Share these with me:
1. Last 20 lines of your Render logs
2. Your environment variables (hide the password)
3. Database status (Available/Not Available)

# Backend Deployment - Simple Guide

## Easiest Option: Railway (Recommended)

Railway provides:
- ✅ Free $5 credit (no credit card needed initially)
- ✅ Automatic PostgreSQL database
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS
- ✅ Environment variable management

**Cost:** ~$5-10/month after free credit

---

## Step-by-Step: Deploy to Railway

### Step 1: Sign Up for Railway

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your repository
4. Railway will detect it's a Java/Spring Boot app

### Step 3: Add PostgreSQL Database

1. In your project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will create a database automatically

### Step 4: Configure Environment Variables

1. Click on your backend service
2. Go to "Variables" tab
3. Add these variables:

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=${{Postgres.DATABASE_URL}}
SPRING_DATASOURCE_USERNAME=${{Postgres.PGUSER}}
SPRING_DATASOURCE_PASSWORD=${{Postgres.PGPASSWORD}}
```

Note: Railway automatically provides the Postgres variables

4. Add CORS configuration:

```
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

Replace with your actual Vercel URL!

### Step 5: Configure Build Settings

1. Go to "Settings" tab
2. Under "Build", set:
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/*.jar`
3. Under "Deploy", set:
   - **Root Directory:** `/` (leave as default)

### Step 6: Deploy

1. Click "Deploy" or push to GitHub
2. Railway will automatically build and deploy
3. Wait 3-5 minutes for the build to complete

### Step 7: Get Your Backend URL

1. Go to "Settings" tab
2. Under "Networking", click "Generate Domain"
3. You'll get a URL like: `https://your-app.up.railway.app`
4. Copy this URL!

---

## Step 8: Update Frontend Environment Variables

Now that backend is deployed, update your Vercel environment variables:

1. Go to Vercel dashboard
2. Select your project
3. Go to "Settings" → "Environment Variables"
4. Update:
   - `VITE_API_BASE_URL` = `https://your-app.up.railway.app`
   - `VITE_WS_BASE_URL` = `wss://your-app.up.railway.app`
5. Go to "Deployments" → Click "..." → "Redeploy"

---

## Step 9: Update Backend CORS

Your backend needs to allow requests from Vercel:

1. In Railway, go to your service → "Variables"
2. Update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app,https://www.your-vercel-app.vercel.app
   ```
3. Redeploy (Railway will auto-redeploy on variable change)

---

## Alternative: Render (Also Easy)

### Step 1: Sign Up

1. Go to https://render.com
2. Sign up with GitHub

### Step 2: Create PostgreSQL Database

1. Click "New +" → "PostgreSQL"
2. Name: `social-messaging-db`
3. Select free tier
4. Click "Create Database"
5. Copy the "Internal Database URL"

### Step 3: Create Web Service

1. Click "New +" → "Web Service"
2. Connect your repository
3. Configure:
   - **Name:** social-messaging-backend
   - **Environment:** Docker
   - **Region:** Choose closest to you
   - **Branch:** main
   - **Root Directory:** `/` (leave empty)

### Step 4: Add Environment Variables

```
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=<paste your database URL>
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait 5-10 minutes for build
3. Get your URL from the dashboard

---

## Alternative: Heroku

### Step 1: Install Heroku CLI

```bash
# Download from: https://devcenter.heroku.com/articles/heroku-cli
# Or use npm:
npm install -g heroku
```

### Step 2: Login and Create App

```bash
heroku login
heroku create your-app-name
```

### Step 3: Add PostgreSQL

```bash
heroku addons:create heroku-postgresql:mini
```

### Step 4: Configure

```bash
heroku config:set SPRING_PROFILES_ACTIVE=prod
heroku config:set CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

### Step 5: Deploy

```bash
git push heroku main
```

---

## Testing Your Deployment

### 1. Test Backend Health

Open in browser:
```
https://your-backend-url.railway.app/actuator/health
```

Should return: `{"status":"UP"}`

### 2. Test API Endpoint

```
https://your-backend-url.railway.app/users/search?username=test
```

### 3. Test from Frontend

1. Open your Vercel app
2. Try to register a new user
3. Try to login
4. Check browser console for errors

---

## Troubleshooting

### Build Fails

**Check Railway logs:**
1. Go to your service
2. Click "Deployments"
3. Click on the failed deployment
4. Check the logs

**Common issues:**
- Maven wrapper not executable: Railway handles this automatically
- Out of memory: Upgrade to paid plan or optimize

### Database Connection Fails

**Check:**
1. Database is running (green status in Railway)
2. Environment variables are set correctly
3. Database URL format is correct

### CORS Errors

**Fix:**
1. Update `CORS_ALLOWED_ORIGINS` in Railway
2. Make sure it matches your Vercel URL exactly
3. Include both `https://` and `wss://` if needed

### Application Won't Start

**Check logs for:**
- Port binding issues (Railway sets PORT automatically)
- Missing environment variables
- Database connection errors

---

## Configuration Files Needed

### 1. Create `application-prod.properties`

Create this file: `src/main/resources/application-prod.properties`

```properties
# Server
server.port=${PORT:8080}

# Database (Railway provides these via environment variables)
spring.datasource.url=${SPRING_DATASOURCE_URL}
spring.datasource.username=${SPRING_DATASOURCE_USERNAME:postgres}
spring.datasource.password=${SPRING_DATASOURCE_PASSWORD}

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# Logging
logging.level.root=INFO
logging.level.com.example.socialmessaging=INFO
```

### 2. Update `CorsConfig.java`

Make CORS configurable via environment variable:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    
    @Value("${cors.allowed.origins:http://localhost:5173}")
    private String allowedOrigins;
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 3. Commit and Push

```bash
git add .
git commit -m "Add production configuration"
git push origin main
```

Railway will automatically redeploy!

---

## Quick Reference

### Railway Commands

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# View logs
railway logs

# Open in browser
railway open
```

### Important URLs

- Railway Dashboard: https://railway.app/dashboard
- Render Dashboard: https://dashboard.render.com
- Heroku Dashboard: https://dashboard.heroku.com

---

## Cost Breakdown

### Railway
- Free: $5 credit (lasts ~1 month)
- Paid: ~$5-10/month
- Database: Included

### Render
- Free: 750 hours/month (enough for 1 app)
- Database: $7/month minimum
- Total: $7/month

### Heroku
- Free tier removed
- Minimum: $7/month (Eco Dynos)
- Database: $5/month
- Total: $12/month

**Recommendation:** Start with Railway for easiest setup!

---

## What's Next?

1. ✅ Backend deployed
2. ✅ Database created
3. ⬜ Update frontend environment variables
4. ⬜ Update backend CORS
5. ⬜ Test everything
6. ⬜ (Optional) Add custom domain

---

## Final Checklist

- [ ] Backend deployed and running
- [ ] Database connected
- [ ] Environment variables set
- [ ] Frontend updated with backend URL
- [ ] CORS configured correctly
- [ ] Registration works
- [ ] Login works
- [ ] Messaging works
- [ ] WebSocket connection works

---

## Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Check logs in Railway dashboard
- Review PRODUCTION_DEPLOYMENT.md for more details

Good luck! 🚀

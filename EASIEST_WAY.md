# The Easiest Way to Fix Your Deployment

## What Happened?

The error you saw (`@JsonProperty` not found) was from an old cached build. Your code is actually correct now - the import is there in `Message.java`.

## The Fix (Takes 2 Minutes)

### 1. Force Render to Rebuild

Go to: https://dashboard.render.com

Click your backend service → **"Manual Deploy"** → **"Clear build cache & deploy"**

That's it! Render will rebuild with your correct code.

### 2. While It Builds, Set These Variables

Click **"Environment"** tab and add:

| Variable | Value |
|----------|-------|
| `SPRING_PROFILES_ACTIVE` | `prod` |
| `SPRING_DATASOURCE_URL` | Get from your PostgreSQL database |
| `CORS_ALLOWED_ORIGINS` | Your Vercel URL (e.g., `https://myapp.vercel.app`) |

**To get database URL:**
- Click your PostgreSQL database in Render
- Scroll to "Connections"
- Copy "Internal Database URL"

### 3. Test It

After build completes (5-10 min), open:

```
https://your-backend.onrender.com/actuator/health
```

Should return: `{"status":"UP"}`

### 4. Update Vercel

Go to Vercel → Your project → Settings → Environment Variables

Update these two:
```
VITE_API_BASE_URL=https://your-backend.onrender.com
VITE_WS_BASE_URL=wss://your-backend.onrender.com
```

Then: Deployments → Redeploy

## Done! 🎉

Your app should now work end-to-end.

---

## Why Did This Happen?

When you first deployed, the `@JsonProperty` import was missing. We added it, but Render kept using the old cached build. Clearing the cache forces it to rebuild with the new code.

---

## If You Get Stuck

Check these in order:

1. **Database Status:** Is it "Available" (green)?
2. **Environment Variables:** Are all three set?
3. **Build Logs:** Does it say "BUILD SUCCESS"?
4. **Health Check:** Does `/actuator/health` return UP?

If any of these fail, let me know which one and I'll help debug!

---

## Other Helpful Files

- `SIMPLE_START.md` - Step-by-step guide
- `QUICK_DEPLOY.md` - Detailed deployment instructions
- `RENDER_FIX.md` - Database troubleshooting
- `CLICK_HERE_TO_FIX.txt` - Quick reference

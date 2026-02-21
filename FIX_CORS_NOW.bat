@echo off
echo ========================================
echo RENDER DEPLOYMENT FIX GUIDE
echo ========================================
echo.
echo Your code is correct! The issue is Render's build cache.
echo.
echo FOLLOW THESE STEPS:
echo ========================================
echo.
echo 1. Open: https://dashboard.render.com
echo.
echo 2. Click your Web Service (backend)
echo.
echo 3. Click "Manual Deploy" button
echo.
echo 4. Select "Clear build cache & deploy"
echo.
echo 5. Wait 5-10 minutes for build
echo.
echo ========================================
echo ENVIRONMENT VARIABLES NEEDED:
echo ========================================
echo.
echo Go to Environment tab and set:
echo.
echo SPRING_PROFILES_ACTIVE=prod
echo SPRING_DATASOURCE_URL=(get from PostgreSQL database)
echo CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
echo.
echo To get database URL:
echo - Click PostgreSQL database in Render
echo - Scroll to "Connections" section
echo - Copy "Internal Database URL"
echo.
echo ========================================
echo AFTER BACKEND WORKS:
echo ========================================
echo.
echo Test: https://your-backend.onrender.com/actuator/health
echo Should return: {"status":"UP"}
echo.
echo Then update Vercel:
echo - Settings -^> Environment Variables
echo - VITE_API_BASE_URL=https://your-backend.onrender.com
echo - VITE_WS_BASE_URL=wss://your-backend.onrender.com
echo - Redeploy
echo.
echo ========================================
echo.
echo See QUICK_DEPLOY.md for detailed instructions
echo.
pause

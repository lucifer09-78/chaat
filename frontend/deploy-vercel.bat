@echo off
echo ========================================
echo   Frontend Deployment to Vercel
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
)

echo.
echo Step 1: Installing dependencies...
call npm install

echo.
echo Step 2: Building the project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Build failed! Please fix errors and try again.
    pause
    exit /b 1
)

echo.
echo Step 3: Deploying to Vercel...
echo.
echo Choose deployment type:
echo 1. Preview deployment (for testing)
echo 2. Production deployment
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo Deploying preview...
    vercel
) else if "%choice%"=="2" (
    echo.
    echo Deploying to production...
    vercel --prod
) else (
    echo Invalid choice!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Copy the deployment URL
echo 2. Update backend CORS configuration
echo 3. Update environment variables in Vercel dashboard
echo 4. Test your application
echo.
pause

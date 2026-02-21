@echo off
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🔧 FIXING CORS ERROR NOW 🔧                    ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo The error was: "blocked by CORS policy"
echo.
echo What was fixed:
echo ✅ Created CorsConfig.java - Global CORS configuration
echo ✅ Updated UserController - Added CORS headers
echo ✅ Updated FriendRequestController - Added CORS headers
echo ✅ Updated GroupController - Added CORS headers
echo ✅ Updated MessageController - Added CORS headers + REST endpoints
echo ✅ Fixed all entity models - JSON serialization
echo.
echo ════════════════════════════════════════════════════════════════
echo.

echo Step 1: Stopping containers...
docker-compose down
if %errorlevel% neq 0 (
    echo ❌ Failed to stop containers
    pause
    exit /b 1
)
echo ✅ Containers stopped
echo.

echo Step 2: Rebuilding with new code...
echo (This will take 1-2 minutes - compiling Java code)
echo.
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo ❌ Failed to build/start containers
    pause
    exit /b 1
)
echo.

echo Step 3: Waiting for backend to start...
echo.
timeout /t 10 /nobreak >nul

:check_loop
docker-compose logs app 2>nul | findstr "Started SocialMessagingApplication" >nul 2>&1
if %errorlevel% equ 0 (
    goto :success
)

docker-compose logs app 2>nul | findstr "ERROR" >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ❌ Backend started with errors!
    echo.
    echo Showing last 30 lines of logs:
    docker-compose logs --tail=30 app
    echo.
    echo Check the errors above.
    pause
    exit /b 1
)

echo Still starting... (waiting 5 more seconds)
timeout /t 5 /nobreak >nul
goto :check_loop

:success
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              ✅ BACKEND STARTED SUCCESSFULLY! ✅            ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Backend is running on: http://localhost:8080
echo Frontend should be on: http://localhost:5173
echo.
echo ════════════════════════════════════════════════════════════════
echo                    WHAT TO DO NOW
echo ════════════════════════════════════════════════════════════════
echo.
echo 1. Make sure frontend is running:
echo    cd frontend
echo    npm run dev
echo.
echo 2. Open browser: http://localhost:5173
echo.
echo 3. Try to login or register
echo.
echo 4. CORS error should be FIXED! ✅
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo To view live logs:
echo   docker-compose logs -f app
echo.
pause

@echo off
echo ========================================
echo Starting Nexus Chat Application
echo ========================================
echo.
echo IMPORTANT: Make sure Docker Desktop is running!
echo.
echo This will open 2 terminal windows:
echo   1. Backend (Docker Compose)
echo   2. Frontend (React + Vite)
echo.
echo Press any key to continue...
pause >nul

echo.
echo Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and run this script again.
    pause
    exit /b 1
)

echo Docker is running!
echo.
echo Starting Backend with Docker...
start "Nexus Chat - Backend (Docker)" cmd /k "cd /d %~dp0 && docker-compose up --build"

echo Waiting 10 seconds for backend to initialize...
timeout /t 10 >nul

echo Starting Frontend...
start "Nexus Chat - Frontend" cmd /k "cd /d %~dp0frontend && start-frontend.bat"

echo.
echo ========================================
echo Both services are starting!
echo ========================================
echo.
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo.
echo Wait for backend to show "Started SocialMessagingApplication",
echo then open http://localhost:5173 in your browser.
echo.
echo Press any key to exit this window...
pause >nul

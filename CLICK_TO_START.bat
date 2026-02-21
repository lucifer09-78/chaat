:5174/users/login:1  Failed to load resource: the server responded with a status of 500 (I@echo off
color 0A
title Nexus Chat - Launcher
cls

echo.
echo  ========================================
echo   NEXUS CHAT - Application Launcher
echo  ========================================
echo.
echo  This will start your chat application!
echo.
echo  What will happen:
echo  1. Backend + Database (Docker)
echo  2. Frontend (React)
echo.
echo  Make sure Docker Desktop is running!
echo.
echo  ========================================
echo.
pause

cls
echo.
echo  Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo.
    echo  ERROR: Docker is not running!
    echo.
    echo  Please:
    echo  1. Open Docker Desktop
    echo  2. Wait for it to start
    echo  3. Run this script again
    echo.
    pause
    exit /b 1
)

color 0A
echo  Docker is running!
echo.
echo  ========================================
echo   Starting Backend + Database...
echo  ========================================
echo.
echo  Opening new window for backend...
echo  (This will take 2-5 minutes first time)
echo.

start "Nexus Chat - Backend (Docker)" cmd /k "color 0B && echo Starting Backend with Docker... && echo. && docker-compose up --build"

echo  Waiting 15 seconds for backend to initialize...
timeout /t 15 >nul

cls
echo.
echo  ========================================
echo   Starting Frontend...
echo  ========================================
echo.
echo  Opening new window for frontend...
echo.

start "Nexus Chat - Frontend (React)" cmd /k "color 0E && cd frontend && echo Starting Frontend... && echo. && npm run dev"

cls
echo.
echo  ========================================
echo   NEXUS CHAT IS STARTING!
echo  ========================================
echo.
echo  Two windows have opened:
echo.
echo  Window 1: Backend (Blue)
echo    - Wait for: "Started SocialMessagingApplication"
echo.
echo  Window 2: Frontend (Yellow)
echo    - Wait for: "Local: http://localhost:5173"
echo.
echo  ========================================
echo.
echo  Once both show "ready", open your browser:
echo.
echo    http://localhost:5173
echo.
echo  ========================================
echo.
echo  Tips:
echo  - Register 2 users to test chat
echo  - Add each other as friends
echo  - Start messaging in real-time!
echo.
echo  To stop: Press Ctrl+C in both windows
echo.
echo  ========================================
echo.
echo  Press any key to close this window...
pause >nul

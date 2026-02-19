@echo off
echo ========================================
echo Starting Nexus Chat Backend with Docker
echo ========================================
echo.

echo Checking if Docker is running...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo Docker is running!
echo.
echo Starting backend with Docker Compose...
echo This may take 1-2 minutes on first run...
echo.

docker-compose up --build

pause

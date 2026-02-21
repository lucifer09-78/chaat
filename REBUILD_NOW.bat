@echo off
echo ========================================
echo Rebuilding Backend Docker Container
echo ========================================
echo.

echo Step 1: Stopping existing containers...
docker-compose down

echo.
echo Step 2: Removing old images...
docker rmi social-messaging-platform-app 2>nul

echo.
echo Step 3: Building fresh container...
docker-compose build --no-cache

echo.
echo Step 4: Starting containers...
docker-compose up -d

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Backend should be running on: http://localhost:8080
echo Database should be running on: localhost:5432
echo.
echo To view logs: docker-compose logs -f app
echo To stop: docker-compose down
echo.
pause

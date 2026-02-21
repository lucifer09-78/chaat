@echo off
cls
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              🔧 REBUILDING BACKEND NOW 🔧                   ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Fixed compilation error:
echo ✅ Added missing method to MessageRepository
echo.
echo ════════════════════════════════════════════════════════════════
echo.

echo Stopping containers...
docker-compose down

echo.
echo Rebuilding (this will take 1-2 minutes)...
echo.
docker-compose up --build

pause

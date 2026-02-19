@echo off
echo ========================================
echo Starting Nexus Chat Frontend
echo ========================================
echo.

echo Installing dependencies (if needed)...
call npm install

echo.
echo Starting Vite Dev Server...
echo.

call npm run dev

pause

@echo off
echo Testing Frontend Setup...
echo.

cd /d "%~dp0"

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo node_modules not found. Installing dependencies...
    call npm install
) else (
    echo node_modules found!
)

echo.
echo Checking for missing dependencies...
call npm install

echo.
echo Starting frontend in test mode...
echo.
echo If you see "VITE ready", the frontend is working!
echo Open http://localhost:5173 in your browser.
echo.
echo Press Ctrl+C to stop.
echo.

call npm run dev

pause

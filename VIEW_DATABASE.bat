@echo off
echo ========================================
echo   View Database Contents
echo ========================================
echo.
echo Connecting to database...
echo Database: social_messaging
echo Username: postgres
echo Password: keerat78
echo.
echo ========================================
echo.

psql -U postgres -d social_messaging -c "\dt" -c "SELECT 'USERS:' as info;" -c "SELECT * FROM users;" -c "SELECT 'MESSAGES:' as info;" -c "SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10;" -c "SELECT 'FRIEND REQUESTS:' as info;" -c "SELECT * FROM friend_requests;" -c "SELECT 'GROUPS:' as info;" -c "SELECT * FROM groups;"

echo.
echo ========================================
pause

@echo off
echo ========================================
echo   PostgreSQL Database Viewer
echo ========================================
echo.
echo Connecting to database: social_messaging
echo Username: postgres
echo Password: keerat78
echo.
echo Choose an option:
echo 1. Open psql command line
echo 2. View all tables
echo 3. View users table
echo 4. View messages table
echo 5. View friend_requests table
echo 6. View groups table
echo 7. View database statistics
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging
) else if "%choice%"=="2" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "\dt"
    pause
) else if "%choice%"=="3" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "SELECT id, username, last_seen, created_at FROM users ORDER BY id;"
    pause
) else if "%choice%"=="4" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "SELECT id, sender_id, receiver_id, group_id, LEFT(content, 30) as content, timestamp, delivered_at, read_at FROM messages ORDER BY timestamp DESC LIMIT 20;"
    pause
) else if "%choice%"=="5" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "SELECT * FROM friend_requests ORDER BY id;"
    pause
) else if "%choice%"=="6" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "SELECT * FROM chat_groups ORDER BY id;"
    pause
) else if "%choice%"=="7" (
    docker exec -it social-messaging-db psql -U postgres -d social_messaging -c "SELECT COUNT(*) as total_users FROM users; SELECT COUNT(*) as total_messages FROM messages; SELECT COUNT(*) as total_groups FROM chat_groups;"
    pause
) else (
    echo Invalid choice!
    pause
)

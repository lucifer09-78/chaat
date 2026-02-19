-- View Database Contents
-- Run this with: psql -U postgres -d social_messaging -f VIEW_DATABASE.sql

\echo '========================================'
\echo 'DATABASE: social_messaging'
\echo '========================================'
\echo ''

\echo '--- TABLES ---'
\dt

\echo ''
\echo '--- USERS ---'
SELECT id, username, created_at FROM users ORDER BY created_at DESC;

\echo ''
\echo '--- FRIEND REQUESTS ---'
SELECT 
    fr.id,
    s.username as sender,
    r.username as receiver,
    fr.status,
    fr.created_at
FROM friend_requests fr
JOIN users s ON fr.sender_id = s.id
JOIN users r ON fr.receiver_id = r.id
ORDER BY fr.created_at DESC;

\echo ''
\echo '--- MESSAGES (Last 20) ---'
SELECT 
    m.id,
    s.username as sender,
    COALESCE(r.username, 'Group: ' || m.group_id) as receiver,
    LEFT(m.content, 50) as message,
    m.timestamp
FROM messages m
JOIN users s ON m.sender_id = s.id
LEFT JOIN users r ON m.receiver_id = r.id
ORDER BY m.timestamp DESC
LIMIT 20;

\echo ''
\echo '--- GROUPS ---'
SELECT 
    g.id,
    g.name,
    u.username as created_by,
    g.created_at
FROM groups g
JOIN users u ON g.created_by = u.id
ORDER BY g.created_at DESC;

\echo ''
\echo '--- GROUP MEMBERS ---'
SELECT 
    g.name as group_name,
    u.username as member
FROM group_members gm
JOIN groups g ON gm.group_id = g.id
JOIN users u ON gm.user_id = u.id
ORDER BY g.name, u.username;

\echo ''
\echo '========================================'
\echo 'Database view complete!'
\echo '========================================'

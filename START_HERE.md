# 🚀 START HERE - Complete Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- ✅ PostgreSQL installed with password `keerat78`
- ✅ Java 17 or higher
- ✅ Node.js 18 or higher
- ✅ Maven (or use included `mvnw`)

## Quick Start (3 Steps)

### Step 1: Setup Database

**Option A: Create database manually**
```bash
# Open PostgreSQL command line
psql -U postgres

# Enter password: keerat78

# Create database
CREATE DATABASE social_messaging;

# Exit
\q
```

**Option B: Use Docker for database only**
```bash
docker run --name postgres-db -e POSTGRES_PASSWORD=keerat78 -e POSTGRES_DB=social_messaging -p 5432:5432 -d postgres:15-alpine
```

### Step 2: Start Backend

```bash
cd social-messaging-platform
./mvnw spring-boot:run
```

Wait for the message: `Started SocialMessagingApplication`

### Step 3: Start Frontend

Open a new terminal:

```bash
cd social-messaging-platform/frontend
npm run dev
```

## Access the Application

🌐 **Frontend**: http://localhost:5173  
🔧 **Backend API**: http://localhost:8080  
🗄️ **Database**: localhost:5432

## First Time Usage

### 1. Register Users

1. Open http://localhost:5173
2. Click "Sign up"
3. Create first user (e.g., username: `alice`, password: `test123`)
4. You'll be automatically logged in

### 2. Create Second User

1. Logout (click logout icon in sidebar)
2. Click "Sign up" again
3. Create second user (e.g., username: `bob`, password: `test123`)

### 3. Add Friends

1. Click "Requests" button in sidebar
2. Search for "alice" in the search box
3. Click "Add Friend"
4. Logout and login as `alice`
5. Click "Requests" button
6. Accept the friend request from `bob`

### 4. Start Chatting

1. Click on `bob` in the friends list
2. Type a message and press Enter
3. Open another browser (or incognito window)
4. Login as `bob`
5. See the message from `alice` appear in real-time!

### 5. Create a Group

1. Click "New Group" button
2. Enter group name (e.g., "Team Chat")
3. Select friends to add
4. Click "Create Group"
5. Click on the group to start group chat

## Verify Everything is Working

### ✅ Backend Health Check
```bash
curl http://localhost:8080/users/search?username=alice
```

Should return user data if alice is registered.

### ✅ Database Check
```bash
psql -U postgres -d social_messaging -c "SELECT * FROM users;"
```

Should show registered users.

### ✅ Frontend Check
Open http://localhost:5173 - should see the login page with animated background.

## Common Issues & Solutions

### ❌ Backend won't start

**Error**: "Connection refused to localhost:5432"

**Solution**: PostgreSQL is not running
```bash
# Windows - Start PostgreSQL service
net start postgresql-x64-15

# Or check if it's running
Get-Service postgresql*
```

---

**Error**: "password authentication failed"

**Solution**: Wrong password or user
- Verify password is `keerat78`
- Verify username is `postgres`
- Check `application.properties` file

---

### ❌ Frontend won't start

**Error**: "Cannot find module"

**Solution**: Install dependencies
```bash
cd social-messaging-platform/frontend
npm install
```

---

**Error**: "Port 5173 is already in use"

**Solution**: Kill the process or use different port
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
```

---

### ❌ WebSocket not connecting

**Error**: "WebSocket connection failed"

**Solution**: 
1. Ensure backend is running on port 8080
2. Check browser console for errors
3. Verify CORS is enabled in backend
4. Try refreshing the page

---

### ❌ Messages not appearing

**Solution**:
1. Check browser console for WebSocket errors
2. Verify both users are friends
3. Ensure backend is running
4. Check database has messages: `SELECT * FROM messages;`

## Project Structure

```
social-messaging-platform/
├── src/                          # Backend (Spring Boot)
│   └── main/
│       ├── java/                 # Java source code
│       └── resources/
│           └── application.properties  # DB config
├── frontend/                     # Frontend (React)
│   ├── src/
│   │   ├── pages/               # Login, Chat pages
│   │   ├── components/          # UI components
│   │   ├── services/            # API, WebSocket
│   │   └── context/             # Auth context
│   └── package.json
├── docker-compose.yml           # Docker setup (optional)
└── pom.xml                      # Maven config
```

## Development Workflow

### Making Changes

**Backend Changes**:
1. Edit Java files in `src/main/java/`
2. Stop backend (Ctrl+C)
3. Restart: `./mvnw spring-boot:run`

**Frontend Changes**:
- Vite hot-reloads automatically
- Just save the file and see changes instantly

### Viewing Logs

**Backend logs**: In the terminal where you ran `mvnw spring-boot:run`

**Frontend logs**: Browser console (F12)

**Database logs**: 
```bash
psql -U postgres -d social_messaging
\x
SELECT * FROM messages ORDER BY timestamp DESC LIMIT 10;
```

## Testing Real-Time Features

### Test Private Messaging
1. Open browser window 1: Login as `alice`
2. Open browser window 2: Login as `bob`
3. In window 1: Click on `bob`, send message
4. In window 2: Message appears instantly

### Test Group Messaging
1. Create a group with multiple members
2. Open multiple browser windows with different users
3. Send message in group
4. All members see the message in real-time

## Stopping the Application

### Stop Frontend
Press `Ctrl+C` in the frontend terminal

### Stop Backend
Press `Ctrl+C` in the backend terminal

### Stop Database (if using Docker)
```bash
docker stop postgres-db
```

## Next Steps

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for detailed setup
2. ✅ Read [DATABASE_SETUP.md](DATABASE_SETUP.md) for database details
3. ✅ Read [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
4. ✅ Check [CHECKLIST.md](CHECKLIST.md) for all implemented features

## Need Help?

### Check Logs
- Backend: Terminal where Spring Boot is running
- Frontend: Browser console (F12 → Console)
- Database: `psql -U postgres -d social_messaging`

### Verify Services
```bash
# Check if backend is running
curl http://localhost:8080/users/search?username=test

# Check if database is running
psql -U postgres -l

# Check if frontend is running
curl http://localhost:5173
```

## 🎉 You're Ready!

Everything is set up and ready to go. Start the backend, start the frontend, and begin chatting!

**Happy Coding! 🚀**

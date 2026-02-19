# 🚀 Simple Start Guide

## The Easiest Way to Run Everything

### Method 1: Double-Click to Start (Easiest!)

1. **Double-click** `START_ALL.bat` in the `social-messaging-platform` folder
2. Wait for 2 terminal windows to open
3. Wait until you see "Started SocialMessagingApplication" in the backend window
4. Open your browser to: http://localhost:5173
5. Done! 🎉

---

### Method 2: Manual Start (Step by Step)

#### Terminal 1 - Backend

1. Open PowerShell
2. Navigate to project:
   ```powershell
   cd E:\javapro\social-messaging-platform
   ```
3. Start backend:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
4. Wait for: `Started SocialMessagingApplication`

#### Terminal 2 - Frontend

1. Open a NEW PowerShell window
2. Navigate to frontend:
   ```powershell
   cd E:\javapro\social-messaging-platform\frontend
   ```
3. Start frontend:
   ```powershell
   npm run dev
   ```
4. Open browser: http://localhost:5173

---

## First Time Setup

### Before running, create the database:

```powershell
psql -U postgres
```
Password: `keerat78`

```sql
CREATE DATABASE social_messaging;
\q
```

---

## What You'll See

### Backend Terminal (when ready):
```
Started SocialMessagingApplication in 45.123 seconds
```

### Frontend Terminal (when ready):
```
VITE v7.3.1  ready in 314 ms
➜  Local:   http://localhost:5173/
```

---

## Using the App

1. **Register**: Click "Sign up" and create an account
2. **Add Friends**: Click "Requests" → Search for users → Add Friend
3. **Chat**: Click on a friend to start chatting
4. **Groups**: Click "New Group" to create group chats

---

## Stopping Everything

Press `Ctrl+C` in both terminal windows.

---

## Troubleshooting

### "Port 8080 already in use"
```powershell
netstat -ano | findstr :8080
taskkill /PID <number> /F
```

### "Cannot find module '@tailwindcss/forms'"
```powershell
cd frontend
npm install -D @tailwindcss/forms
```

### "Connection refused to database"
```powershell
net start postgresql-x64-15
```

### "Database does not exist"
```powershell
psql -U postgres -c "CREATE DATABASE social_messaging;"
```

---

## Quick Commands

| Action | Command |
|--------|---------|
| Start Backend | `.\mvnw.cmd spring-boot:run` |
| Start Frontend | `npm run dev` |
| Create Database | `psql -U postgres -c "CREATE DATABASE social_messaging;"` |
| Check Backend | `curl http://localhost:8080/users/search?username=test` |
| Stop Services | `Ctrl+C` in terminals |

---

## Need More Help?

- 📖 Read [RUN_BACKEND.md](RUN_BACKEND.md) for detailed backend instructions
- 📖 Read [START_HERE.md](START_HERE.md) for complete setup guide
- 📖 Read [DATABASE_SETUP.md](DATABASE_SETUP.md) for database help

---

## ✅ You're Ready!

Just double-click `START_ALL.bat` and you're good to go! 🚀

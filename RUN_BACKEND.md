# How to Run the Backend

## ✅ Option 1: Run Backend WITHOUT Docker (Recommended)

This is simpler and uses your existing PostgreSQL installation.

### Step 1: Ensure PostgreSQL is Running

Check if PostgreSQL is running:
```powershell
Get-Service postgresql*
```

If not running, start it:
```powershell
net start postgresql-x64-15
```

### Step 2: Create Database (First Time Only)

Open PowerShell and run:
```powershell
psql -U postgres
```

Enter password: `keerat78`

Then create the database:
```sql
CREATE DATABASE social_messaging;
\q
```

### Step 3: Start the Backend

Open PowerShell in the project directory:
```powershell
cd E:\javapro\social-messaging-platform
```

Run the backend:
```powershell
.\mvnw.cmd spring-boot:run
```

OR if you have Maven installed:
```powershell
mvn spring-boot:run
```

### Step 4: Verify Backend is Running

You should see:
```
Started SocialMessagingApplication in X.XXX seconds
```

Test the backend:
```powershell
curl http://localhost:8080/users/search?username=test
```

### Step 5: Start Frontend (New Terminal)

Open a NEW PowerShell window:
```powershell
cd E:\javapro\social-messaging-platform\frontend
npm run dev
```

### Step 6: Access Application

Open browser: http://localhost:5173

---

## ⚙️ Option 2: Run with Docker (Everything Automated)

This creates a PostgreSQL container and runs everything in Docker.

### Prerequisites
- Docker Desktop installed and running
- Docker Compose installed

### Step 1: Start Docker Desktop

Make sure Docker Desktop is running (check system tray).

### Step 2: Run Docker Compose

Open PowerShell:
```powershell
cd E:\javapro\social-messaging-platform
docker-compose up --build
```

This will:
- Create PostgreSQL container with password `keerat78`
- Build and run Spring Boot backend
- Expose backend on port 8080

### Step 3: Start Frontend (New Terminal)

Docker Compose only runs the backend. Start frontend separately:
```powershell
cd E:\javapro\social-messaging-platform\frontend
npm run dev
```

### Step 4: Access Application

Open browser: http://localhost:5173

---

## 🛑 How to Stop

### Stop Backend (Option 1 - Local)
Press `Ctrl+C` in the terminal where backend is running

### Stop Docker (Option 2)
```powershell
docker-compose down
```

### Stop Frontend
Press `Ctrl+C` in the terminal where frontend is running

---

## 🔍 Troubleshooting

### Backend won't start - "Port 8080 already in use"

Find and kill the process:
```powershell
netstat -ano | findstr :8080
taskkill /PID <PID_NUMBER> /F
```

### Backend won't start - "Connection refused to database"

PostgreSQL is not running:
```powershell
net start postgresql-x64-15
```

### Backend won't start - "Password authentication failed"

Check password in `application.properties`:
```properties
spring.datasource.password=keerat78
```

### Database doesn't exist

Create it:
```powershell
psql -U postgres -c "CREATE DATABASE social_messaging;"
```

### Maven command not found

Use the wrapper:
```powershell
.\mvnw.cmd spring-boot:run
```

---

## 📋 Quick Reference

### Check if services are running:

**PostgreSQL:**
```powershell
Get-Service postgresql*
```

**Backend:**
```powershell
curl http://localhost:8080/users/search?username=test
```

**Frontend:**
Open http://localhost:5173

### View logs:

**Backend logs:** In the terminal where you ran `mvnw spring-boot:run`

**Database logs:**
```powershell
psql -U postgres -d social_messaging
SELECT * FROM users;
\q
```

---

## 🎯 Recommended Workflow

1. ✅ Start PostgreSQL (if not running)
2. ✅ Start Backend: `.\mvnw.cmd spring-boot:run`
3. ✅ Wait for "Started SocialMessagingApplication"
4. ✅ Start Frontend (new terminal): `npm run dev`
5. ✅ Open http://localhost:5173
6. ✅ Register and start chatting!

---

## 💡 Tips

- Keep backend and frontend running in separate terminal windows
- Backend takes 30-60 seconds to start
- Frontend starts in 2-3 seconds
- If you make backend changes, restart backend only
- If you make frontend changes, Vite hot-reloads automatically
- Database persists data between restarts

---

## ✅ Success Indicators

**Backend Started Successfully:**
```
Started SocialMessagingApplication in 45.123 seconds (process running for 46.789)
```

**Frontend Started Successfully:**
```
VITE v7.3.1  ready in 314 ms
➜  Local:   http://localhost:5173/
```

**Database Connected:**
Backend logs show:
```
HikariPool-1 - Start completed.
```

You're ready to go! 🚀

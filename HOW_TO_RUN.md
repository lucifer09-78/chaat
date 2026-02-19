# 🎯 HOW TO RUN - Step by Step

## Where is Everything?

```
E:\javapro\social-messaging-platform\
├── Backend (Spring Boot) - Runs in Docker
├── Frontend (React) - Runs locally
└── Database (PostgreSQL) - Runs in Docker
```

---

## 🚀 STEP-BY-STEP INSTRUCTIONS

### STEP 1: Open PowerShell in Project Folder

1. Open File Explorer
2. Go to: `E:\javapro\social-messaging-platform`
3. Click in the address bar (where it shows the path)
4. Type: `powershell`
5. Press Enter

A blue PowerShell window will open.

---

### STEP 2: Start Backend + Database (Docker)

In the PowerShell window, type this command:

```powershell
docker-compose up --build
```

Press Enter.

**What happens:**
- Docker downloads images (first time: 2-5 minutes)
- Builds your Java application
- Starts PostgreSQL database
- Starts Spring Boot backend

**Wait for this message:**
```
social-messaging-app  | Started SocialMessagingApplication in 45.123 seconds
```

✅ **Backend is now running on: http://localhost:8080**

**KEEP THIS WINDOW OPEN!** Don't close it.

---

### STEP 3: Start Frontend (New Window)

1. Open a NEW PowerShell window (don't close the first one!)
2. Type these commands:

```powershell
cd E:\javapro\social-messaging-platform\frontend
npm run dev
```

**Wait for this message:**
```
VITE v7.3.1  ready in 314 ms
➜  Local:   http://localhost:5173/
```

✅ **Frontend is now running on: http://localhost:5173**

---

### STEP 4: Open the App

Open your web browser and go to:

**http://localhost:5173**

You should see the login page with animated background!

---

## 📍 Where is Each Part Running?

| Component | Where | URL |
|-----------|-------|-----|
| **Frontend** | Your computer (Node.js) | http://localhost:5173 |
| **Backend** | Docker container | http://localhost:8080 |
| **Database** | Docker container | localhost:5432 |

---

## 🎮 Using the App

### 1. Register First User
- Click "Sign up"
- Username: `alice`
- Password: `test123`
- Click "Create Account"

### 2. Register Second User
- Logout (click logout icon in sidebar)
- Click "Sign up"
- Username: `bob`
- Password: `test123`
- Click "Create Account"

### 3. Add Friends
- Login as `bob`
- Click "Requests" button
- Search for "alice"
- Click "Add Friend"
- Logout and login as `alice`
- Click "Requests"
- Accept the request from `bob`

### 4. Start Chatting
- Click on `bob` in the friends list
- Type a message and press Enter
- Open another browser window
- Login as `bob`
- See the message appear in real-time!

---

## 🛑 How to Stop

### Stop Frontend
- Go to the PowerShell window running frontend
- Press `Ctrl+C`

### Stop Backend + Database
- Go to the PowerShell window running docker-compose
- Press `Ctrl+C`
- Then type: `docker-compose down`

---

## 🔄 How to Restart

Just repeat the steps:

**Terminal 1:**
```powershell
cd E:\javapro\social-messaging-platform
docker-compose up
```

**Terminal 2:**
```powershell
cd E:\javapro\social-messaging-platform\frontend
npm run dev
```

---

## ❓ Troubleshooting

### "Port 8080 is already in use"
```powershell
docker-compose down
docker ps -a
docker rm -f $(docker ps -aq)
```

### "Cannot find module"
```powershell
cd frontend
npm install
```

### Backend not starting
```powershell
docker-compose down -v
docker-compose up --build
```

### See what's running
```powershell
docker ps
```

---

## 📊 Visual Summary

```
┌─────────────────────────────────────────┐
│  YOUR COMPUTER                          │
│                                         │
│  ┌─────────────────┐                   │
│  │   Browser       │                   │
│  │  localhost:5173 │                   │
│  └────────┬────────┘                   │
│           │                             │
│           ↓                             │
│  ┌─────────────────┐                   │
│  │   Frontend      │                   │
│  │   (React)       │                   │
│  │   Port 5173     │                   │
│  └────────┬────────┘                   │
│           │                             │
│           ↓ HTTP/WebSocket             │
│  ┌─────────────────────────────────┐   │
│  │   DOCKER                        │   │
│  │                                 │   │
│  │  ┌──────────────┐               │   │
│  │  │  Backend     │               │   │
│  │  │  (Spring)    │               │   │
│  │  │  Port 8080   │               │   │
│  │  └──────┬───────┘               │   │
│  │         │                       │   │
│  │         ↓                       │   │
│  │  ┌──────────────┐               │   │
│  │  │  Database    │               │   │
│  │  │  (Postgres)  │               │   │
│  │  │  Port 5432   │               │   │
│  │  └──────────────┘               │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## ✅ Success Checklist

- [ ] Docker Desktop is running
- [ ] PowerShell window 1 shows "Started SocialMessagingApplication"
- [ ] PowerShell window 2 shows "VITE ready"
- [ ] Browser opens http://localhost:5173
- [ ] You see the login page with animated background
- [ ] You can register and login

---

## 🎉 You're Ready!

The app is running! Register users, add friends, and start chatting in real-time!

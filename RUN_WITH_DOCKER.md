# 🐳 Run Backend with Docker (Easiest Method)

Since Maven is not installed, using Docker is the simplest way to run the backend.

## Prerequisites

1. **Docker Desktop** must be installed and running
   - Download from: https://www.docker.com/products/docker-desktop/
   - After installation, make sure Docker Desktop is running (check system tray)

## Step-by-Step Instructions

### Step 1: Start Docker Desktop

1. Open Docker Desktop from Start Menu
2. Wait for it to say "Docker Desktop is running"
3. You should see the Docker icon in your system tray

### Step 2: Start Backend with Docker Compose

Open PowerShell in the project directory:

```powershell
cd E:\javapro\social-messaging-platform
docker-compose up --build
```

This will:
- ✅ Create a PostgreSQL database container (password: keerat78)
- ✅ Build and run the Spring Boot backend
- ✅ Expose backend on http://localhost:8080

**Wait for this message:**
```
social-messaging-app  | Started SocialMessagingApplication
```

### Step 3: Start Frontend (New Terminal)

Open a NEW PowerShell window:

```powershell
cd E:\javapro\social-messaging-platform\frontend
npm run dev
```

### Step 4: Access Application

Open your browser: **http://localhost:5173**

---

## Alternative: Run Backend Only with Docker

If you want to run just the backend in Docker and use your local PostgreSQL:

### Option A: Use Docker for Backend Only

Create a simple Dockerfile run:

```powershell
cd E:\javapro\social-messaging-platform
docker build -t nexus-chat-backend .
docker run -p 8080:8080 -e SPRING_DATASOURCE_URL=jdbc:postgresql://host.docker.internal:5432/social_messaging -e SPRING_DATASOURCE_PASSWORD=keerat78 nexus-chat-backend
```

---

## Stopping Docker

### Stop all containers:
```powershell
docker-compose down
```

### Stop and remove volumes (clean restart):
```powershell
docker-compose down -v
```

---

## Checking Docker Status

### See running containers:
```powershell
docker ps
```

### See logs:
```powershell
docker-compose logs -f
```

### See backend logs only:
```powershell
docker-compose logs -f app
```

### See database logs only:
```powershell
docker-compose logs -f db
```

---

## Troubleshooting Docker

### "Docker daemon is not running"

Start Docker Desktop from the Start Menu.

### "Port 8080 is already in use"

Stop any running containers:
```powershell
docker-compose down
docker ps -a
docker rm -f <container_id>
```

### "Cannot connect to database"

Check if database container is running:
```powershell
docker ps
```

You should see both `social-messaging-app` and `social-messaging-db`.

### Clean restart:

```powershell
docker-compose down -v
docker-compose up --build
```

---

## What Docker Compose Does

1. **Creates PostgreSQL container**:
   - Database: `social_messaging`
   - Username: `postgres`
   - Password: `keerat78`
   - Port: `5432`

2. **Builds Spring Boot app**:
   - Compiles Java code
   - Packages as JAR
   - Runs on port `8080`

3. **Connects them together**:
   - Backend automatically connects to database
   - All networking handled by Docker

---

## Advantages of Docker Method

✅ No need to install Maven  
✅ No need to install Java locally  
✅ Database automatically created  
✅ Everything isolated in containers  
✅ Easy to clean up and restart  
✅ Same environment as production  

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start everything | `docker-compose up --build` |
| Stop everything | `docker-compose down` |
| Clean restart | `docker-compose down -v && docker-compose up --build` |
| View logs | `docker-compose logs -f` |
| Check status | `docker ps` |

---

## After Docker is Running

1. ✅ Backend: http://localhost:8080
2. ✅ Database: localhost:5432
3. ✅ Start frontend: `npm run dev` in frontend folder
4. ✅ Open: http://localhost:5173

---

## 🎉 You're Ready!

Docker handles all the complexity. Just run `docker-compose up --build` and you're good to go!

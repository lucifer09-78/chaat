# Quick Start Guide

## Prerequisites
- Docker and Docker Compose installed
- Ports 5173, 8080, and 5432 available

## Start the Application

### Option 1: Using Docker Compose (Recommended)

1. Navigate to the project directory:
```bash
cd social-messaging-platform
```

2. Start all services:
```bash
docker-compose up --build
```

3. Wait for all services to start (this may take a few minutes on first run)

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Option 2: Running Locally

#### Start Backend:
```bash
cd social-messaging-platform
./mvnw spring-boot:run
```

#### Start Frontend (in a new terminal):
```bash
cd social-messaging-platform/frontend
npm install
npm run dev
```

## Using the Application

### 1. Register a New Account
- Open http://localhost:5173
- Click "Sign up" at the bottom
- Enter a username and password
- Click "Create Account"

### 2. Add Friends
- Click the "Requests" button in the sidebar
- Use the search box to find users by username
- Click "Add Friend" to send a friend request
- Other users can accept your request from their Requests page

### 3. Start Chatting
- Once a friend accepts your request, they'll appear in your sidebar
- Click on a friend to open a private chat
- Type your message and press Enter or click the send button
- Messages are delivered in real-time via WebSocket

### 4. Create a Group
- Click "New Group" button in the sidebar
- Enter a group name
- Select friends to add to the group
- Click "Create Group"
- The group will appear in your sidebar under "Groups"

### 5. Group Chat
- Click on a group in the sidebar
- Send messages that all group members can see
- Group messages are broadcast in real-time

## Testing with Multiple Users

To test the real-time messaging:

1. Open the app in two different browsers (or incognito mode)
2. Register two different accounts
3. Add each other as friends
4. Start chatting - messages should appear instantly in both windows

## Troubleshooting

### Backend won't start
- Check if port 8080 is already in use
- Ensure PostgreSQL is running (if using Docker Compose, it should start automatically)
- Check logs: `docker-compose logs app`

### Frontend won't start
- Check if port 5173 is already in use
- Ensure all dependencies are installed: `npm install`
- Check for errors in the browser console

### WebSocket connection fails
- Ensure backend is running on port 8080
- Check browser console for connection errors
- Verify CORS settings in backend allow your frontend origin

### Database connection issues
- Check if PostgreSQL container is running: `docker ps`
- Verify database credentials in `application.properties`
- Check database logs: `docker-compose logs db`

## Stopping the Application

### Docker Compose:
```bash
docker-compose down
```

### Local Development:
Press `Ctrl+C` in each terminal window

## Clean Restart

To start fresh with a clean database:
```bash
docker-compose down -v
docker-compose up --build
```

The `-v` flag removes the database volume, deleting all data.

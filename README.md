# Nexus Chat - Social Messaging Platform

A real-time social messaging platform built with Spring Boot, WebSocket, React, and Docker.

## Features

- **User Authentication**: Register and login functionality
- **Friend System**: Send, accept, and reject friend requests
- **Private Messaging**: Real-time one-on-one chat with friends
- **Group Messaging**: Create groups and chat with multiple users
- **WebSocket Communication**: Instant message delivery using STOMP over WebSocket
- **Modern UI**: Glassmorphism design with liquid animations

## Tech Stack

### Backend
- Spring Boot 3.x
- WebSocket + STOMP
- Spring Data JPA
- PostgreSQL
- Docker

### Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- SockJS + STOMP Client
- React Router

## Getting Started

**📖 New to the project? Start with [START_HERE.md](START_HERE.md) for a complete step-by-step guide!**

### Prerequisites
- PostgreSQL with password `keerat78` (for local setup)
- OR Docker and Docker Compose (for containerized setup)
- Node.js 18+ (for local frontend development)
- Java 17+ (for local backend development)

### Quick Start - Local Development

#### 1. Setup Database
```bash
# Create database in PostgreSQL
psql -U postgres
# Password: keerat78
CREATE DATABASE social_messaging;
\q
```

#### 2. Start Backend
```bash
cd social-messaging-platform
./mvnw spring-boot:run
```

#### 3. Start Frontend (new terminal)
```bash
cd social-messaging-platform/frontend
npm install
npm run dev
```

#### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Running with Docker

1. **Start the entire application**:
```bash
cd social-messaging-platform
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432 (password: keerat78)
- Spring Boot backend on port 8080
- React frontend on port 5173

2. **Access the application**:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Running Locally (Development)

#### Backend
```bash
cd social-messaging-platform
./mvnw spring-boot:run
```

#### Frontend
```bash
cd social-messaging-platform/frontend
npm install
npm run dev
```

## API Endpoints

### User Management
- `POST /users/register` - Register a new user
- `POST /users/login` - Login user
- `GET /users/search?username={username}` - Search users

### Friend Requests
- `POST /friends/request/{senderId}/{receiverId}` - Send friend request
- `PUT /friends/accept/{requestId}` - Accept friend request
- `PUT /friends/reject/{requestId}` - Reject friend request
- `GET /friends/pending/{userId}` - Get pending requests
- `GET /friends/list/{userId}` - Get friends list

### Groups
- `POST /groups/create` - Create a new group
- `POST /groups/add-member` - Add member to group
- `GET /groups/list/{userId}` - Get user's groups

### WebSocket Endpoints
- `/ws` - WebSocket connection endpoint
- `/app/private.send` - Send private message
- `/app/group.send` - Send group message
- `/user/{userId}/queue/messages` - Subscribe to private messages
- `/topic/group/{groupId}` - Subscribe to group messages

## Project Structure

```
social-messaging-platform/
├── src/main/java/com/example/socialmessaging/
│   ├── config/          # WebSocket configuration
│   ├── controller/      # REST controllers
│   ├── model/          # Entity models
│   ├── repository/     # JPA repositories
│   └── service/        # Business logic
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API and WebSocket services
│   │   └── context/    # React context (Auth)
│   └── public/
├── docker-compose.yml
└── Dockerfile
```

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Find Friends**: Use the friend requests modal to search and add friends
3. **Start Chatting**: Select a friend from the sidebar to start a private conversation
4. **Create Groups**: Click "New Group" to create a group chat with multiple friends
5. **Real-time Messaging**: All messages are delivered instantly via WebSocket

## Environment Variables

### Backend (application.properties)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/social_messaging
spring.datasource.username=postgres
spring.datasource.password=keerat78
server.port=8080
```

### Frontend
The frontend connects to the backend at `http://localhost:8080` by default. Update `src/services/api.js` and `src/services/websocket.js` to change the backend URL.

## Docker Configuration

The application uses Docker Compose with two services:
- **db**: PostgreSQL 15 database
- **app**: Spring Boot application with embedded frontend

## Development Notes

- The backend uses CORS configuration to allow all origins for development
- WebSocket connections use SockJS for fallback support
- Messages are persisted in the PostgreSQL database
- The UI features glassmorphism design with animated backgrounds

## Troubleshooting

### WebSocket Connection Issues
- Ensure the backend is running on port 8080
- Check browser console for connection errors
- Verify CORS settings if running on different ports

### Database Connection Issues
- Ensure PostgreSQL container is running
- Check database credentials in application.properties
- Verify the database name matches the configuration

## License

This project is for educational purposes.

# Database Setup Guide

## PostgreSQL Configuration

The application is configured to connect to PostgreSQL with the following credentials:

- **Database Name**: `social_messaging`
- **Username**: `postgres`
- **Password**: `keerat78`
- **Port**: `5432`
- **Host**: `localhost` (for local development) or `db` (for Docker)

## Option 1: Using Docker Compose (Recommended)

Docker Compose will automatically create and configure the PostgreSQL database for you.

```bash
cd social-messaging-platform
docker-compose up --build
```

This will:
- Create a PostgreSQL container with the correct credentials
- Create the `social_messaging` database
- Connect the Spring Boot app to the database
- Persist data in a Docker volume

## Option 2: Using Existing PostgreSQL Installation

If you already have PostgreSQL installed locally with password `keerat78`, follow these steps:

### 1. Create the Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE social_messaging;
```

### 2. Verify Connection

Test the connection with:

```bash
psql -U postgres -d social_messaging
```

Enter password: `keerat78`

### 3. Grant Permissions (if needed)

```sql
GRANT ALL PRIVILEGES ON DATABASE social_messaging TO postgres;
```

### 4. Start the Spring Boot Application

```bash
cd social-messaging-platform
./mvnw spring-boot:run
```

The application will automatically create all necessary tables using Hibernate DDL auto-update.

## Database Schema

The application will automatically create the following tables:

### 1. users
- `id` (BIGINT, Primary Key)
- `username` (VARCHAR, Unique)
- `password` (VARCHAR)
- `created_at` (TIMESTAMP)

### 2. friend_requests
- `id` (BIGINT, Primary Key)
- `sender_id` (BIGINT, Foreign Key → users.id)
- `receiver_id` (BIGINT, Foreign Key → users.id)
- `status` (VARCHAR) - PENDING, ACCEPTED, REJECTED
- `created_at` (TIMESTAMP)

### 3. messages
- `id` (BIGINT, Primary Key)
- `sender_id` (BIGINT, Foreign Key → users.id)
- `receiver_id` (BIGINT, Foreign Key → users.id, nullable)
- `group_id` (BIGINT, Foreign Key → groups.id, nullable)
- `content` (TEXT)
- `timestamp` (TIMESTAMP)

### 4. groups
- `id` (BIGINT, Primary Key)
- `name` (VARCHAR)
- `created_by` (BIGINT, Foreign Key → users.id)
- `created_at` (TIMESTAMP)

### 5. group_members
- `group_id` (BIGINT, Foreign Key → groups.id)
- `user_id` (BIGINT, Foreign Key → users.id)
- Primary Key: (group_id, user_id)

## Connection Configuration Files

### application.properties
Located at: `src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/social_messaging
spring.datasource.username=postgres
spring.datasource.password=keerat78
```

### docker-compose.yml
Located at: `docker-compose.yml`

```yaml
db:
  image: postgres:15-alpine
  environment:
    - POSTGRES_DB=social_messaging
    - POSTGRES_USER=postgres
    - POSTGRES_PASSWORD=keerat78
```

## Troubleshooting

### Connection Refused
If you get "Connection refused" error:

1. **Check if PostgreSQL is running**:
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Or check Docker
   docker ps
   ```

2. **Verify port 5432 is not in use**:
   ```bash
   netstat -ano | findstr :5432
   ```

3. **Check PostgreSQL is listening on localhost**:
   Edit `postgresql.conf` and ensure:
   ```
   listen_addresses = 'localhost'
   ```

### Authentication Failed
If you get "password authentication failed":

1. **Verify password is correct**: `keerat78`

2. **Check pg_hba.conf** (PostgreSQL config):
   ```
   # IPv4 local connections:
   host    all             all             127.0.0.1/32            md5
   ```

3. **Restart PostgreSQL** after config changes

### Database Does Not Exist
If you get "database does not exist":

```sql
CREATE DATABASE social_messaging;
```

### Permission Denied
If you get permission errors:

```sql
GRANT ALL PRIVILEGES ON DATABASE social_messaging TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
```

## Resetting the Database

### Using Docker Compose
```bash
docker-compose down -v
docker-compose up --build
```

The `-v` flag removes volumes, deleting all data.

### Using Local PostgreSQL
```sql
DROP DATABASE social_messaging;
CREATE DATABASE social_messaging;
```

Then restart the Spring Boot application to recreate tables.

## Viewing Database Content

### Using psql
```bash
psql -U postgres -d social_messaging

# List tables
\dt

# View users
SELECT * FROM users;

# View messages
SELECT * FROM messages;

# View friend requests
SELECT * FROM friend_requests;
```

### Using pgAdmin
1. Open pgAdmin
2. Connect to localhost:5432
3. Navigate to: Servers → PostgreSQL → Databases → social_messaging
4. Right-click on Tables to view data

## Production Considerations

For production deployment, consider:

1. **Use environment variables** for sensitive data:
   ```bash
   export DB_PASSWORD=keerat78
   ```

2. **Use a strong password** (not `keerat78`)

3. **Enable SSL** for database connections

4. **Set up database backups**

5. **Use connection pooling** (HikariCP is included by default)

6. **Monitor database performance**

## Current Configuration Summary

✅ Database: `social_messaging`  
✅ Username: `postgres`  
✅ Password: `keerat78`  
✅ Port: `5432`  
✅ Auto-create tables: Enabled (Hibernate DDL)  
✅ Show SQL: Enabled (for debugging)  
✅ Dialect: PostgreSQL

The database is ready to use!

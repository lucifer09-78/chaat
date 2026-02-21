# Production Deployment Guide

## Overview
This guide covers deploying the Social Messaging Platform to production using various hosting options.

---

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Deployment Options](#deployment-options)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Tools
- Docker & Docker Compose (for containerized deployment)
- Node.js 18+ (for frontend build)
- Java 17+ (for backend build)
- PostgreSQL 15+ (production database)
- Domain name with DNS access
- SSL certificate (Let's Encrypt recommended)

### Recommended Services
- **Backend Hosting**: AWS EC2, DigitalOcean, Heroku, Railway, Render
- **Frontend Hosting**: Vercel, Netlify, AWS S3 + CloudFront, Nginx
- **Database**: AWS RDS, DigitalOcean Managed PostgreSQL, Supabase
- **SSL**: Let's Encrypt (free), Cloudflare

---

## Environment Configuration

### 1. Backend Environment Variables

Create `application-prod.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration (REPLACE WITH YOUR PRODUCTION DB)
spring.datasource.url=jdbc:postgresql://your-db-host:5432/social_messaging_prod
spring.datasource.username=your_db_user
spring.datasource.password=your_secure_password

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# CORS Configuration (REPLACE WITH YOUR FRONTEND URL)
cors.allowed.origins=https://yourdomain.com,https://www.yourdomain.com

# Logging
logging.level.root=INFO
logging.level.com.example.socialmessaging=INFO
```

### 2. Frontend Environment Variables

Create `.env.production`:

```env
# Backend API URL (REPLACE WITH YOUR BACKEND URL)
VITE_API_BASE_URL=https://api.yourdomain.com

# WebSocket URL (REPLACE WITH YOUR BACKEND URL)
VITE_WS_BASE_URL=wss://api.yourdomain.com
```

---

## Database Setup

### Option 1: Managed Database (Recommended)

**AWS RDS PostgreSQL:**
```bash
# Create RDS instance via AWS Console
# - Engine: PostgreSQL 15
# - Instance class: db.t3.micro (for testing) or db.t3.small (production)
# - Storage: 20GB minimum
# - Enable automated backups
# - Enable Multi-AZ for high availability
```

**DigitalOcean Managed Database:**
```bash
# Create via DigitalOcean Console
# - Database: PostgreSQL 15
# - Plan: Basic ($15/month minimum)
# - Enable automatic backups
```

### Option 2: Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create production database
sudo -u postgres psql
CREATE DATABASE social_messaging_prod;
CREATE USER your_db_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE social_messaging_prod TO your_db_user;
\q

# Configure PostgreSQL for remote connections
sudo nano /etc/postgresql/15/main/postgresql.conf
# Set: listen_addresses = '*'

sudo nano /etc/postgresql/15/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Database Migration

```bash
# Run initial schema creation
# The application will auto-create tables on first run with ddl-auto=update
# Then change to ddl-auto=validate for production

# Or manually run SQL schema if needed
psql -h your-db-host -U your_db_user -d social_messaging_prod -f schema.sql
```

---

## Backend Deployment

### Option 1: Docker Deployment (Recommended)

**1. Create production docker-compose.yml:**

```yaml
version: '3.8'
services:
  app:
    image: social-messaging-platform-app:latest
    container_name: social-messaging-app-prod
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SPRING_DATASOURCE_URL=jdbc:postgresql://your-db-host:5432/social_messaging_prod
      - SPRING_DATASOURCE_USERNAME=your_db_user
      - SPRING_DATASOURCE_PASSWORD=your_secure_password
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

**2. Build and deploy:**

```bash
# Build the Docker image
docker build -t social-messaging-platform-app:latest .

# Start the container
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker logs -f social-messaging-app-prod
```

### Option 2: JAR Deployment

**1. Build the JAR:**

```bash
cd social-messaging-platform
./mvnw clean package -DskipTests -Pprod
```

**2. Deploy to server:**

```bash
# Copy JAR to server
scp target/social-messaging-platform-0.0.1-SNAPSHOT.jar user@your-server:/opt/app/

# Create systemd service
sudo nano /etc/systemd/system/social-messaging.service
```

**Service file content:**

```ini
[Unit]
Description=Social Messaging Platform
After=network.target

[Service]
Type=simple
User=appuser
WorkingDirectory=/opt/app
ExecStart=/usr/bin/java -jar -Dspring.profiles.active=prod /opt/app/social-messaging-platform-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**3. Start the service:**

```bash
sudo systemctl daemon-reload
sudo systemctl enable social-messaging
sudo systemctl start social-messaging
sudo systemctl status social-messaging
```

### Option 3: Cloud Platform Deployment

**Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:mini

# Deploy
git push heroku main

# Set environment variables
heroku config:set SPRING_PROFILES_ACTIVE=prod
```

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli
railway login

# Initialize project
railway init
railway up

# Add PostgreSQL
railway add postgresql
```

---

## Frontend Deployment

### 1. Build for Production

```bash
cd frontend

# Install dependencies
npm install

# Create .env.production file (see Environment Configuration above)

# Build
npm run build
# Output will be in: dist/
```

### Option 1: Vercel (Recommended - Easiest)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# VITE_API_BASE_URL=https://api.yourdomain.com
# VITE_WS_BASE_URL=wss://api.yourdomain.com
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist

# Or connect GitHub repo in Netlify dashboard for auto-deploy
```

### Option 3: Nginx (Self-Hosted)

**1. Install Nginx:**

```bash
sudo apt update
sudo apt install nginx
```

**2. Copy build files:**

```bash
# Copy dist folder to server
scp -r dist/* user@your-server:/var/www/social-messaging/
```

**3. Configure Nginx:**

```bash
sudo nano /etc/nginx/sites-available/social-messaging
```

**Nginx configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /var/www/social-messaging;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (optional if backend on same server)
    location /api {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**4. Enable site and restart Nginx:**

```bash
sudo ln -s /etc/nginx/sites-available/social-messaging /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Deployment Options

### Complete Stack Deployment Options

#### Option 1: Single Server (Budget-Friendly)

**Requirements:**
- 1 VPS (2GB RAM minimum)
- Domain name
- SSL certificate

**Setup:**
```bash
# Install Docker, PostgreSQL, Nginx
# Run backend in Docker
# Serve frontend with Nginx
# Use Let's Encrypt for SSL
```

**Cost:** ~$10-20/month (DigitalOcean Droplet or AWS Lightsail)

#### Option 2: Separate Services (Recommended)

**Backend:** Railway/Render ($5-10/month)
**Frontend:** Vercel/Netlify (Free tier available)
**Database:** Managed PostgreSQL ($15/month)

**Cost:** ~$20-25/month

#### Option 3: Full AWS Stack (Enterprise)

**Backend:** ECS/EKS with Auto Scaling
**Frontend:** S3 + CloudFront
**Database:** RDS Multi-AZ
**Load Balancer:** Application Load Balancer

**Cost:** ~$100+/month (scales with usage)

---

## SSL Certificate Setup

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is configured automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Post-Deployment

### 1. Update CORS Configuration

Update `CorsConfig.java`:

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "https://yourdomain.com",
                    "https://www.yourdomain.com"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

### 2. Update Frontend API URLs

Update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com';
```

Update `frontend/src/services/websocket.js`:

```javascript
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.yourdomain.com';
```

### 3. Test Deployment

```bash
# Test backend health
curl https://api.yourdomain.com/actuator/health

# Test frontend
curl https://yourdomain.com

# Test WebSocket connection (use browser console)
const ws = new WebSocket('wss://api.yourdomain.com/ws');
```

### 4. Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h your-db-host -U your_db_user social_messaging_prod > backup_$DATE.sql
# Upload to S3 or backup storage
```

---

## Monitoring & Maintenance

### 1. Application Monitoring

**Add Spring Boot Actuator endpoints:**

```properties
# application-prod.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

**Monitor with:**
- Prometheus + Grafana
- New Relic
- Datadog
- AWS CloudWatch

### 2. Log Management

```bash
# View backend logs
docker logs -f social-messaging-app-prod

# Or with systemd
sudo journalctl -u social-messaging -f

# Centralized logging with ELK Stack or CloudWatch
```

### 3. Performance Optimization

**Backend:**
- Enable connection pooling
- Add Redis for caching
- Configure JVM heap size: `-Xmx512m -Xms256m`

**Frontend:**
- Enable CDN (CloudFront, Cloudflare)
- Optimize images
- Enable lazy loading

**Database:**
- Add indexes on frequently queried columns
- Enable query caching
- Regular VACUUM and ANALYZE

### 4. Security Checklist

- ✅ HTTPS enabled everywhere
- ✅ Strong database passwords
- ✅ CORS properly configured
- ✅ Rate limiting enabled
- ✅ SQL injection prevention (using JPA)
- ✅ XSS protection (React handles this)
- ✅ Regular security updates
- ✅ Firewall configured (only ports 80, 443, 22 open)
- ✅ Database not publicly accessible
- ✅ Environment variables secured

---

## Quick Deployment Commands

### Full Stack on Single Server

```bash
# 1. Setup server
ssh user@your-server
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io docker-compose nginx postgresql certbot python3-certbot-nginx -y

# 2. Clone repository
git clone https://github.com/yourusername/social-messaging-platform.git
cd social-messaging-platform

# 3. Setup database
sudo -u postgres createdb social_messaging_prod
sudo -u postgres createuser your_db_user

# 4. Configure environment
cp application.properties application-prod.properties
# Edit with production values

# 5. Build and start backend
docker-compose -f docker-compose.prod.yml up -d

# 6. Build frontend
cd frontend
npm install
npm run build

# 7. Deploy frontend
sudo cp -r dist/* /var/www/social-messaging/

# 8. Configure Nginx (see above)
sudo nano /etc/nginx/sites-available/social-messaging

# 9. Get SSL certificate
sudo certbot --nginx -d yourdomain.com

# 10. Start services
sudo systemctl restart nginx
```

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
docker logs social-messaging-app-prod

# Common issues:
# - Database connection failed: Check credentials and network
# - Port already in use: Change port or stop conflicting service
# - Out of memory: Increase container memory limit
```

### Frontend shows blank page
```bash
# Check browser console for errors
# Common issues:
# - API URL incorrect: Check .env.production
# - CORS errors: Update backend CORS config
# - Build failed: Check npm run build output
```

### WebSocket connection fails
```bash
# Check:
# - Nginx WebSocket proxy configuration
# - Backend WebSocket endpoint accessible
# - SSL certificate valid for WebSocket (wss://)
```

---

## Support & Updates

### Updating the Application

```bash
# Backend update
git pull origin main
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build

# Frontend update
cd frontend
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/social-messaging/
```

### Rollback

```bash
# Backend rollback
docker-compose -f docker-compose.prod.yml down
docker run -d --name social-messaging-app-prod social-messaging-platform-app:previous-tag

# Frontend rollback
# Keep previous dist folder as backup
sudo cp -r dist-backup/* /var/www/social-messaging/
```

---

## Cost Estimation

### Minimal Setup (~$25/month)
- Railway/Render backend: $5-10
- Vercel frontend: Free
- Managed PostgreSQL: $15

### Recommended Setup (~$50/month)
- DigitalOcean Droplet (4GB): $24
- Managed PostgreSQL: $15
- Cloudflare CDN: Free
- Domain: $10/year

### Enterprise Setup (~$200+/month)
- AWS ECS/EKS: $50+
- RDS Multi-AZ: $100+
- CloudFront: $20+
- Load Balancer: $20+

---

## Next Steps

1. Choose your deployment option
2. Set up production database
3. Configure environment variables
4. Deploy backend
5. Build and deploy frontend
6. Set up SSL certificates
7. Configure monitoring
8. Test thoroughly
9. Set up automated backups
10. Document your specific deployment

Good luck with your deployment! 🚀

# Production Deployment Checklist

## Pre-Deployment

### Infrastructure
- [ ] Domain name purchased and DNS configured
- [ ] SSL certificate obtained (Let's Encrypt or purchased)
- [ ] Server/hosting platform selected and provisioned
- [ ] Database server set up (managed or self-hosted)
- [ ] Backup strategy planned

### Configuration
- [ ] Production database created
- [ ] Database credentials secured
- [ ] Backend environment variables configured
- [ ] Frontend environment variables configured
- [ ] CORS settings updated with production URLs
- [ ] API URLs updated in frontend code

### Security
- [ ] Strong passwords set for database
- [ ] Firewall rules configured
- [ ] Only necessary ports open (80, 443, 22)
- [ ] Database not publicly accessible
- [ ] Environment variables not committed to git
- [ ] SSL/TLS certificates valid

## Backend Deployment

- [ ] Code tested locally
- [ ] All tests passing
- [ ] Production profile configured (`application-prod.properties`)
- [ ] JAR built or Docker image created
- [ ] Backend deployed to server
- [ ] Backend accessible via HTTPS
- [ ] Health check endpoint responding
- [ ] WebSocket connection working
- [ ] Database migrations applied
- [ ] Logs accessible and monitored

## Frontend Deployment

- [ ] Production build created (`npm run build`)
- [ ] Environment variables set correctly
- [ ] Static files deployed
- [ ] Frontend accessible via HTTPS
- [ ] API calls working
- [ ] WebSocket connection working
- [ ] All pages loading correctly
- [ ] Browser console shows no errors

## Post-Deployment

### Testing
- [ ] User registration works
- [ ] User login works
- [ ] Friend requests work
- [ ] Private messaging works
- [ ] Group chat works
- [ ] Online/offline status updates
- [ ] Message read receipts work
- [ ] Notifications work
- [ ] Profile updates work
- [ ] Account deletion works

### Performance
- [ ] Page load time acceptable (<3 seconds)
- [ ] API response time acceptable (<500ms)
- [ ] WebSocket latency acceptable
- [ ] Database queries optimized
- [ ] Static assets cached properly

### Monitoring
- [ ] Application monitoring set up
- [ ] Error tracking configured
- [ ] Log aggregation working
- [ ] Uptime monitoring active
- [ ] Alert notifications configured

### Backup & Recovery
- [ ] Database backup automated
- [ ] Backup restoration tested
- [ ] Disaster recovery plan documented
- [ ] Rollback procedure tested

### Documentation
- [ ] Deployment process documented
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Troubleshooting guide created
- [ ] Team trained on deployment process

## Maintenance

### Regular Tasks
- [ ] Monitor application logs daily
- [ ] Check error rates weekly
- [ ] Review performance metrics weekly
- [ ] Test backups monthly
- [ ] Update dependencies monthly
- [ ] Review security patches monthly
- [ ] Optimize database quarterly

### Emergency Contacts
- [ ] On-call rotation established
- [ ] Emergency contact list created
- [ ] Escalation procedures documented

---

## Quick Reference

### Important URLs
- Frontend: https://yourdomain.com
- Backend API: https://api.yourdomain.com
- Database: your-db-host:5432
- Monitoring: your-monitoring-url

### Important Commands

**Check Backend Status:**
```bash
docker ps
docker logs -f social-messaging-app-prod
curl https://api.yourdomain.com/actuator/health
```

**Check Frontend:**
```bash
curl https://yourdomain.com
```

**Database Backup:**
```bash
pg_dump -h your-db-host -U your_db_user social_messaging_prod > backup.sql
```

**Restart Services:**
```bash
docker-compose restart
sudo systemctl restart nginx
```

---

## Deployment Status

**Last Deployment:** _____________
**Deployed By:** _____________
**Version:** _____________
**Status:** ⬜ Success ⬜ Failed ⬜ Rolled Back

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

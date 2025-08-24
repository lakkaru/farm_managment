# 🚀 VPS Deployment Checklist for Farm Management System

## Pre-deployment Requirements

### 1. VPS Setup
- [ ] Ubuntu 20.04+ VPS with root access
- [ ] At least 2GB RAM, 20GB storage
- [ ] Domain name pointed to VPS IP address
- [ ] SSH key authentication configured

### 2. Required Services
- [ ] Node.js 18+ installed
- [ ] PM2 installed globally
- [ ] Nginx installed and configured
- [ ] MongoDB installed (or MongoDB Atlas connection ready)
- [ ] SSL certificate (Let's Encrypt) configured

## Deployment Steps

### 1. Initial Server Setup
```bash
# Run as root
sudo chmod +x setup-server.sh
sudo ./setup-server.sh
```

### 2. Switch to Application User
```bash
su - farmapp
```

### 3. Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/farm_managment.git farm-management
sudo chown -R farmapp:farmapp farm-management
cd farm-management
```

### 4. Configure Environment
```bash
# Backend environment
cd backend
cp .env.production .env
# Edit .env with your production values
nano .env
```

**Required .env values:**
- [ ] `MONGODB_URI` - MongoDB connection string
- [ ] `JWT_SECRET` - Strong JWT secret key
- [ ] `EMAIL_*` - Email service configuration
- [ ] `FRONTEND_URL` - Your domain URL

### 5. Deploy Application
```bash
chmod +x deploy.sh
./deploy.sh
```

### 6. Configure SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 7. Set Up Monitoring
```bash
chmod +x monitor.sh
chmod +x backup-db.sh

# Add to crontab for automatic backups
crontab -e
# Add: 0 2 * * * /var/www/farm-management/backup-db.sh
```

## Post-deployment Verification

### 1. Service Status
- [ ] Backend API responding: `curl http://your-domain.com/api/health`
- [ ] Frontend loading: Open `https://your-domain.com` in browser
- [ ] PM2 process running: `pm2 status`
- [ ] Nginx running: `sudo systemctl status nginx`
- [ ] MongoDB connected: Check application logs

### 2. Functionality Tests
- [ ] User registration/login works
- [ ] Farm creation works
- [ ] Season planning works
- [ ] Fertilizer recommendations display correctly
- [ ] File uploads work (if applicable)

### 3. Security Checks
- [ ] SSL certificate valid
- [ ] Firewall configured (UFW)
- [ ] Rate limiting working
- [ ] CORS configured properly
- [ ] Security headers present

## Maintenance Commands

### Daily Operations
```bash
# Check application status
./monitor.sh status

# View logs
./monitor.sh logs

# Check system health
./monitor.sh health

# Restart if needed
./monitor.sh restart
```

### Updates
```bash
# Deploy latest changes
./monitor.sh update

# Or manual update
git pull origin main
npm install --production
./monitor.sh reload
```

### Backup & Recovery
```bash
# Manual backup
./backup-db.sh

# Restore from backup (if needed)
tar -xzf /var/backups/farm-management/mongodb/farm_management-YYYYMMDD_HHMMSS.tar.gz
mongorestore --db farm_management /path/to/extracted/backup/farm_management
```

## Troubleshooting

### Common Issues
1. **Application not starting:**
   - Check PM2 logs: `pm2 logs`
   - Verify .env configuration
   - Check MongoDB connection

2. **502 Bad Gateway:**
   - Check if backend is running: `pm2 status`
   - Verify Nginx configuration: `sudo nginx -t`
   - Check firewall: `sudo ufw status`

3. **Database connection failed:**
   - Verify MongoDB service: `sudo systemctl status mongod`
   - Check MongoDB URI in .env
   - Verify network connectivity (for MongoDB Atlas)

### Log Locations
- Application logs: `pm2 logs farm-management-backend`
- Nginx access logs: `/var/log/nginx/access.log`
- Nginx error logs: `/var/log/nginx/error.log`
- System logs: `/var/log/syslog`

## Performance Optimization

### 1. PM2 Configuration
- [ ] Cluster mode enabled for multiple CPU cores
- [ ] Memory limit set to prevent leaks
- [ ] Auto-restart on crashes configured

### 2. Nginx Optimization
- [ ] Gzip compression enabled
- [ ] Static file caching configured
- [ ] Rate limiting implemented
- [ ] SSL optimization enabled

### 3. Database Optimization
- [ ] MongoDB indexes created for frequently queried fields
- [ ] Connection pooling configured
- [ ] Regular backups automated

## Security Hardening

### 1. Server Security
- [ ] SSH key authentication only
- [ ] Fail2ban installed and configured
- [ ] Regular security updates scheduled
- [ ] Non-root user for application

### 2. Application Security
- [ ] Environment variables secured
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation in place
- [ ] Security headers configured

### 3. Database Security
- [ ] MongoDB authentication enabled
- [ ] Database user with limited permissions
- [ ] Network access restricted
- [ ] Regular backups encrypted

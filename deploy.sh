#!/bin/bash

# Farm Management System Deployment Script for Ubuntu VPS
# Usage: ./deploy.sh

set -e

# Configuration
PROJECT_NAME="farm-management"
DEPLOY_PATH="/var/www/$PROJECT_NAME"
BACKUP_PATH="/var/backups/$PROJECT_NAME"
REPO_URL="https://github.com/lakkaru/farm_managment.git"  # Update with your repo URL
BRANCH="main"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting Farm Management System Deployment${NC}"

# Create backup directory
sudo mkdir -p $BACKUP_PATH

# Create logs directory
sudo mkdir -p $DEPLOY_PATH/logs

# Check if deployment directory exists
if [ -d "$DEPLOY_PATH" ]; then
    echo -e "${YELLOW}📦 Creating backup of current deployment${NC}"
    sudo cp -r $DEPLOY_PATH $BACKUP_PATH/backup-$(date +%Y%m%d-%H%M%S)
    
    echo -e "${YELLOW}🔄 Pulling latest changes${NC}"
    cd $DEPLOY_PATH
    sudo git pull origin $BRANCH
else
    echo -e "${YELLOW}📥 Cloning repository${NC}"
    sudo git clone -b $BRANCH $REPO_URL $DEPLOY_PATH
    cd $DEPLOY_PATH
fi

# Set proper permissions
sudo chown -R $USER:$USER $DEPLOY_PATH
sudo chmod -R 755 $DEPLOY_PATH

# Backend setup
echo -e "${YELLOW}⚙️  Setting up backend${NC}"
cd $DEPLOY_PATH/backend

# Install dependencies
npm install --production

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file from template${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please update the .env file with your production values${NC}"
fi

# Frontend setup
echo -e "${YELLOW}⚙️  Setting up frontend${NC}"
cd $DEPLOY_PATH/frontend

# Install dependencies
npm install

# Build frontend
npm run build

# Set up Nginx configuration
echo -e "${YELLOW}🌐 Setting up Nginx${NC}"
cd $DEPLOY_PATH

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/$PROJECT_NAME > /dev/null <<EOF
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Update with your domain
    
    # Frontend (Gatsby build)
    location / {
        root $DEPLOY_PATH/frontend/public;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, no-transform";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/$PROJECT_NAME /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# Start/restart application with PM2
echo -e "${YELLOW}🔄 Starting application with PM2${NC}"
cd $DEPLOY_PATH

# Stop existing processes
pm2 stop $PROJECT_NAME-backend 2>/dev/null || true
pm2 delete $PROJECT_NAME-backend 2>/dev/null || true

# Start with PM2
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Your application should be running on:${NC}"
echo -e "${GREEN}   - Frontend: http://your-server-ip${NC}"
echo -e "${GREEN}   - Backend API: http://your-server-ip/api${NC}"
echo -e "${YELLOW}⚠️  Don't forget to:${NC}"
echo -e "${YELLOW}   1. Update .env file with production values${NC}"
echo -e "${YELLOW}   2. Update Nginx server_name with your domain${NC}"
echo -e "${YELLOW}   3. Set up SSL certificate (certbot)${NC}"
echo -e "${YELLOW}   4. Configure MongoDB connection${NC}"

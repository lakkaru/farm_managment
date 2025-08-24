#!/bin/bash

# Ubuntu VPS Initial Setup for Farm Management System
# Usage: sudo ./setup-server.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Setting up Ubuntu VPS for Farm Management System${NC}"

# Update system packages
echo -e "${YELLOW}📦 Updating system packages${NC}"
apt update && apt upgrade -y

# Install essential packages
echo -e "${YELLOW}📦 Installing essential packages${NC}"
apt install -y curl wget git nginx software-properties-common ufw

# Install Node.js (LTS version)
echo -e "${YELLOW}📦 Installing Node.js${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt install -y nodejs

# Verify Node.js installation
node_version=$(node --version)
npm_version=$(npm --version)
echo -e "${GREEN}✅ Node.js installed: $node_version${NC}"
echo -e "${GREEN}✅ npm installed: $npm_version${NC}"

# Install PM2 globally
echo -e "${YELLOW}📦 Installing PM2${NC}"
npm install -g pm2

# Install MongoDB (optional - you might use MongoDB Atlas)
echo -e "${YELLOW}📦 Installing MongoDB${NC}"
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
apt update
apt install -y mongodb-org

# Start and enable MongoDB
systemctl start mongod
systemctl enable mongod

# Configure Nginx
echo -e "${YELLOW}🌐 Configuring Nginx${NC}"
systemctl start nginx
systemctl enable nginx

# Remove default Nginx site
rm -f /etc/nginx/sites-enabled/default

# Configure UFW Firewall
echo -e "${YELLOW}🔥 Configuring firewall${NC}"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 5000  # Backend port
ufw --force enable

# Create application user
echo -e "${YELLOW}👤 Creating application user${NC}"
if ! id "farmapp" &>/dev/null; then
    useradd -m -s /bin/bash farmapp
    usermod -aG sudo farmapp
    echo -e "${GREEN}✅ User 'farmapp' created${NC}"
fi

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure${NC}"
mkdir -p /var/www/farm-management
mkdir -p /var/log/farm-management
mkdir -p /var/backups/farm-management

# Set permissions
chown -R farmapp:farmapp /var/www/farm-management
chown -R farmapp:farmapp /var/log/farm-management

# Install SSL certificate tool (Certbot)
echo -e "${YELLOW}🔒 Installing Certbot for SSL${NC}"
snap install core; snap refresh core
snap install --classic certbot
ln -sf /snap/bin/certbot /usr/bin/certbot

# Create logrotate configuration
echo -e "${YELLOW}📋 Setting up log rotation${NC}"
tee /etc/logrotate.d/farm-management > /dev/null <<EOF
/var/log/farm-management/*.log {
    daily
    rotate 30
    compress
    delaycompress
    missingok
    notifempty
    create 0644 farmapp farmapp
    postrotate
        pm2 reloadLogs
    endscript
}
EOF

# Create systemd service for PM2 (backup)
echo -e "${YELLOW}⚙️  Creating PM2 systemd service${NC}"
tee /etc/systemd/system/pm2-farmapp.service > /dev/null <<EOF
[Unit]
Description=PM2 process manager for Farm Management
Documentation=https://pm2.keymetrics.io/
After=network.target

[Service]
Type=forking
User=farmapp
LimitNOFILE=infinity
LimitNPROC=infinity
LimitCORE=infinity
Environment=PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=PM2_HOME=/home/farmapp/.pm2
PIDFile=/home/farmapp/.pm2/pm2.pid
Restart=on-failure

ExecStart=/usr/bin/pm2 resurrect
ExecReload=/usr/bin/pm2 reload all
ExecStop=/usr/bin/pm2 kill

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload

echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${GREEN}🌐 Next steps:${NC}"
echo -e "${GREEN}   1. Switch to farmapp user: su - farmapp${NC}"
echo -e "${GREEN}   2. Clone your repository to /var/www/farm-management${NC}"
echo -e "${GREEN}   3. Run the deployment script: ./deploy.sh${NC}"
echo -e "${GREEN}   4. Configure SSL: certbot --nginx -d your-domain.com${NC}"
echo -e "${YELLOW}⚠️  MongoDB is installed locally. Update connection string in .env${NC}"

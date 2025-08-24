#!/bin/bash

# Farm Management System Process Monitor
# Usage: ./monitor.sh [start|stop|restart|status|logs]

set -e

# Configuration
APP_NAME="farm-management-backend"
LOG_DIR="/var/log/farm-management"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

case "$1" in
    start)
        echo -e "${GREEN}🚀 Starting Farm Management System${NC}"
        pm2 start ecosystem.config.js --env production
        ;;
    stop)
        echo -e "${YELLOW}🛑 Stopping Farm Management System${NC}"
        pm2 stop $APP_NAME
        ;;
    restart)
        echo -e "${YELLOW}🔄 Restarting Farm Management System${NC}"
        pm2 restart $APP_NAME
        ;;
    reload)
        echo -e "${YELLOW}🔄 Reloading Farm Management System (zero-downtime)${NC}"
        pm2 reload $APP_NAME
        ;;
    status)
        echo -e "${GREEN}📊 Application Status${NC}"
        pm2 status $APP_NAME
        echo
        echo -e "${GREEN}📈 System Resources${NC}"
        pm2 monit
        ;;
    logs)
        echo -e "${GREEN}📋 Application Logs${NC}"
        pm2 logs $APP_NAME --lines 50
        ;;
    error-logs)
        echo -e "${RED}❌ Error Logs${NC}"
        pm2 logs $APP_NAME --err --lines 50
        ;;
    health)
        echo -e "${GREEN}🏥 Health Check${NC}"
        
        # Check if PM2 process is running
        if pm2 list | grep -q $APP_NAME; then
            echo -e "${GREEN}✅ PM2 process is running${NC}"
        else
            echo -e "${RED}❌ PM2 process is not running${NC}"
        fi
        
        # Check if application responds
        if curl -f http://localhost:5000/api/health >/dev/null 2>&1; then
            echo -e "${GREEN}✅ Application is responding${NC}"
        else
            echo -e "${RED}❌ Application is not responding${NC}"
        fi
        
        # Check MongoDB connection (if local)
        if systemctl is-active --quiet mongod; then
            echo -e "${GREEN}✅ MongoDB is running${NC}"
        else
            echo -e "${YELLOW}⚠️  MongoDB service status unknown${NC}"
        fi
        
        # Check Nginx
        if systemctl is-active --quiet nginx; then
            echo -e "${GREEN}✅ Nginx is running${NC}"
        else
            echo -e "${RED}❌ Nginx is not running${NC}"
        fi
        
        # Disk space
        echo -e "${GREEN}💾 Disk Usage${NC}"
        df -h /var/www/farm-management
        ;;
    backup)
        echo -e "${GREEN}💾 Creating database backup${NC}"
        ./backup-db.sh
        ;;
    update)
        echo -e "${GREEN}🔄 Updating application${NC}"
        ./deploy.sh
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|reload|status|logs|error-logs|health|backup|update}"
        echo
        echo "Commands:"
        echo "  start       - Start the application"
        echo "  stop        - Stop the application"
        echo "  restart     - Restart the application"
        echo "  reload      - Zero-downtime reload"
        echo "  status      - Show application status"
        echo "  logs        - Show application logs"
        echo "  error-logs  - Show error logs only"
        echo "  health      - Perform health check"
        echo "  backup      - Create database backup"
        echo "  update      - Deploy latest changes"
        exit 1
        ;;
esac

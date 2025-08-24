#!/bin/bash

# MongoDB Backup Script for Farm Management System
# Usage: ./backup-db.sh

set -e

# Configuration
DB_NAME="farm_management"
BACKUP_DIR="/var/backups/farm-management/mongodb"
RETENTION_DAYS=30
DATE=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}📦 Starting MongoDB backup${NC}"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
echo -e "${YELLOW}💾 Creating backup: $DB_NAME-$DATE${NC}"

if command -v mongodump >/dev/null 2>&1; then
    # Local MongoDB backup
    mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE
    
    # Compress backup
    tar -czf $BACKUP_DIR/$DB_NAME-$DATE.tar.gz -C $BACKUP_DIR $DATE
    rm -rf $BACKUP_DIR/$DATE
    
    echo -e "${GREEN}✅ Backup created: $DB_NAME-$DATE.tar.gz${NC}"
else
    echo -e "${RED}❌ mongodump not found. Please install MongoDB tools${NC}"
    exit 1
fi

# Clean old backups
echo -e "${YELLOW}🧹 Cleaning old backups (older than $RETENTION_DAYS days)${NC}"
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Display backup info
echo -e "${GREEN}📊 Backup summary:${NC}"
echo -e "${GREEN}   Location: $BACKUP_DIR${NC}"
echo -e "${GREEN}   Latest: $DB_NAME-$DATE.tar.gz${NC}"
echo -e "${GREEN}   Size: $(du -h $BACKUP_DIR/$DB_NAME-$DATE.tar.gz | cut -f1)${NC}"

# List recent backups
echo -e "${GREEN}📋 Recent backups:${NC}"
ls -lh $BACKUP_DIR/*.tar.gz | tail -5

echo -e "${GREEN}✅ Database backup completed${NC}"

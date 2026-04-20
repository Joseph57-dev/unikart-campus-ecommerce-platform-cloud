#!/bin/bash
set -e

if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

cd /home/ubuntu/app/backend

# Stop existing process if running
pm2 delete unikart-backend || true

# Start application with PM2 using root ecosystem config
pm2 start /home/ubuntu/app/ecosystem.config.js --env production
pm2 save

# Setup startup script for system boot
pm2 startup systemd -u ubuntu --hp /home/ubuntu | tail -n 1 | bash

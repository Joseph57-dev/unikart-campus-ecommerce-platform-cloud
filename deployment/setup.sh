#!/bin/bash
# Unikart Development Quick Start Script
# Run this script to set up the entire development environment

set -e

echo "🚀 Unikart Development Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "\n${YELLOW}Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js$(node --version)${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $(npm --version)${NC}"

if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠ PostgreSQL client not found (Optional if using remote DB)${NC}"
else
    echo -e "${GREEN}✓ PostgreSQL$(psql --version)${NC}"
fi

# Backend Setup
echo -e "\n${YELLOW}Setting up Backend...${NC}"
cd backend

if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env created (Please update with your credentials)${NC}"
fi

echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"

# Frontend Setup
echo -e "\n${YELLOW}Setting up Frontend...${NC}"
cd ../frontend

echo -e "${YELLOW}Installing frontend dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

# Back to root
cd ..

# Database Setup (Optional)
read -p "Do you want to set up the database now? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Setting up PostgreSQL database...${NC}"
    
    if command -v psql &> /dev/null; then
        read -p "Enter PostgreSQL username (default: postgres): " db_user
        db_user=${db_user:-postgres}
        
        createdb -U $db_user unikart_db 2>/dev/null || echo "Database might already exist"
        psql -U $db_user -d unikart_db -f unikart_db_postgres.sql > /dev/null 2>&1
        echo -e "${GREEN}✓ Database initialized${NC}"
    else
        echo -e "${YELLOW}Please initialize database manually:${NC}"
        echo "  createdb unikart_db"
        echo "  psql -d unikart_db -f unikart_db_postgres.sql"
    fi
fi

# Display next steps
echo -e "\n${GREEN}✓ Setup Complete!${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo ""
echo "1. Update configuration files:"
echo "   - backend/.env (Database, AWS, JWT_SECRET)"
echo "   - frontend/.env.local (if needed)"
echo ""
echo "2. Start the backend:"
echo "   cd backend && npm run dev"
echo ""
echo "3. In another terminal, start the frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open in browser:"
echo "   https://localhost:5173"
echo ""
echo -e "${YELLOW}API Documentation:${NC}"
echo "   https://localhost:5000/health"
echo ""
echo "Happy coding! 🎉"

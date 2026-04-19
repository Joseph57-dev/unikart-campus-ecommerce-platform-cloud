#!/bin/bash

# Unikart AWS Deployment Script
# This script helps deploy the application to AWS

set -e

echo "🚀 Starting Unikart AWS Deployment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install it first."
    exit 1
fi

print_status "AWS CLI and Docker are available"

# Build Docker image
print_status "Building Docker image..."
cd src/backend
docker build -t unikart-backend:latest .
cd ../..

print_status "Docker image built successfully"

# Tag and push to ECR (if using ECR)
# Uncomment and modify the following lines if using ECR
# print_status "Pushing to Amazon ECR..."
# aws ecr get-login-password --region eu-north-1 | docker login --username AWS --password-stdin YOUR_ECR_URI
# docker tag unikart-backend:latest YOUR_ECR_URI/unikart-backend:latest
# docker push YOUR_ECR_URI/unikart-backend:latest

print_status "Deployment preparation complete!"
print_warning "Next steps:"
echo "1. Update your .env file with production values"
echo "2. Deploy to EC2 or use AWS CodeDeploy"
echo "3. Update your ALB target groups"
echo "4. Test the health endpoint: http://unikart-alb-296069847.eu-north-1.elb.amazonaws.com/health"

print_status "🎉 Deployment script completed successfully!"
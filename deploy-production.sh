#!/bin/bash

# LifeOS Production Deployment Script
# This script handles the complete production deployment process

set -e  # Exit on any error

echo "🚀 LifeOS Production Deployment Script"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_status "Starting production deployment..."

# Step 1: Environment Validation
print_status "Step 1: Validating production environment..."

if [ ! -f "backend/.env" ]; then
    print_error "Production .env file not found!"
    print_status "Please create backend/.env with production values"
    print_status "You can use backend/env-template-production.txt as a reference"
    exit 1
fi

# Check for required environment variables
required_vars=("NODE_ENV" "SUPABASE_URL" "SUPABASE_SERVICE_ROLE_KEY" "JWT_SECRET" "FRONTEND_URL")
missing_vars=()

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" backend/.env; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    print_error "Missing required environment variables: ${missing_vars[*]}"
    exit 1
fi

print_success "Environment validation passed"

# Step 2: Install Dependencies
print_status "Step 2: Installing dependencies..."

# Backend dependencies
print_status "Installing backend dependencies..."
cd backend
npm ci --production
cd ..

# Frontend dependencies
print_status "Installing frontend dependencies..."
npm ci --production

print_success "Dependencies installed successfully"

# Step 3: Build Frontend
print_status "Step 3: Building frontend for production..."

npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Step 4: Health Check
print_status "Step 4: Running health checks..."

# Check if backend is running
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_success "Backend health check passed"
else
    print_warning "Backend not running or health check failed"
    print_status "Starting backend server..."
    cd backend
    npm run start:prod &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 10
    
    if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
        print_success "Backend started successfully"
    else
        print_error "Failed to start backend"
        exit 1
    fi
fi

# Step 5: Production Tests
print_status "Step 5: Running production tests..."

# Test all critical endpoints
endpoints=(
    "http://localhost:3001/api/health"
    "http://localhost:3001/api/status"
    "http://localhost:3001/api/analytics"
    "http://localhost:3000/api/analytics"
)

for endpoint in "${endpoints[@]}"; do
    if curl -f "$endpoint" > /dev/null 2>&1; then
        print_success "✓ $endpoint"
    else
        print_error "✗ $endpoint"
        exit 1
    fi
done

# Step 6: Deployment Summary
print_status "Step 6: Deployment Summary"
echo ""
echo "🎉 Production deployment completed successfully!"
echo ""
echo "📊 Deployment Status:"
echo "  ✅ Environment: Validated"
echo "  ✅ Dependencies: Installed"
echo "  ✅ Frontend: Built"
echo "  ✅ Backend: Running"
echo "  ✅ Health Checks: Passed"
echo ""
echo "🌐 Access URLs:"
echo "  Frontend: http://localhost:3000"
echo "  Backend: http://localhost:3001"
echo "  Health: http://localhost:3001/api/health"
echo "  Status: http://localhost:3001/api/status"
echo ""
echo "📋 Next Steps:"
echo "  1. Set up your production domain"
echo "  2. Configure HTTPS/SSL certificates"
echo "  3. Set up monitoring and alerting"
echo "  4. Configure backup strategies"
echo "  5. Set up CI/CD pipeline"
echo ""

print_success "Deployment completed! 🚀"

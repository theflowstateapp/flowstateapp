#!/bin/bash
# CTO Agent Task: Deployment Script
# Automated deployment script for LifeOS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="LifeOS"
FRONTEND_PORT=3000
BACKEND_PORT=3001
DOCKER_COMPOSE_FILE="docker-compose.yml"

# Functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Check if Docker is installed
check_docker() {
    log "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
    fi
    
    success "Docker and Docker Compose are installed"
}

# Check if Node.js is installed
check_node() {
    log "Checking Node.js installation..."
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please install Node.js first."
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm is not installed. Please install npm first."
    fi
    
    success "Node.js and npm are installed"
}

# Install dependencies
install_dependencies() {
    log "Installing frontend dependencies..."
    npm install --legacy-peer-deps
    
    log "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    success "Dependencies installed"
}

# Run tests
run_tests() {
    log "Running tests..."
    
    # Frontend tests
    log "Running frontend tests..."
    npm test -- --coverage --watchAll=false --passWithNoTests
    
    # Backend tests
    log "Running backend tests..."
    cd backend && npm test && cd ..
    
    success "All tests passed"
}

# Build application
build_app() {
    log "Building application..."
    
    # Build frontend
    log "Building frontend..."
    npm run build
    
    # Build backend (if needed)
    log "Building backend..."
    cd backend && npm run build 2>/dev/null || true && cd ..
    
    success "Application built successfully"
}

# Start development environment
start_dev() {
    log "Starting development environment..."
    
    # Start backend
    log "Starting backend server..."
    cd backend && npm start &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    sleep 5
    
    # Start frontend
    log "Starting frontend server..."
    npm start &
    FRONTEND_PID=$!
    
    success "Development environment started"
    log "Frontend: http://localhost:$FRONTEND_PORT"
    log "Backend: http://localhost:$BACKEND_PORT"
    
    # Wait for user to stop
    echo "Press Ctrl+C to stop the development environment"
    wait $FRONTEND_PID $BACKEND_PID
}

# Build Docker images
build_docker() {
    log "Building Docker images..."
    
    # Build frontend image
    log "Building frontend Docker image..."
    docker build -f Dockerfile.frontend -t lifeos-frontend:latest .
    
    # Build backend image
    log "Building backend Docker image..."
    cd backend && docker build -t lifeos-backend:latest . && cd ..
    
    success "Docker images built successfully"
}

# Deploy with Docker Compose
deploy_docker() {
    log "Deploying with Docker Compose..."
    
    # Stop existing containers
    docker-compose down 2>/dev/null || true
    
    # Start services
    docker-compose up -d
    
    # Wait for services to be ready
    log "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        success "Frontend is running on http://localhost:$FRONTEND_PORT"
    else
        warning "Frontend might not be ready yet"
    fi
    
    if curl -f http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        success "Backend is running on http://localhost:$BACKEND_PORT"
    else
        warning "Backend might not be ready yet"
    fi
    
    success "Deployment completed"
}

# Stop services
stop_services() {
    log "Stopping services..."
    
    # Stop Docker Compose services
    docker-compose down 2>/dev/null || true
    
    # Stop any running Node.js processes
    pkill -f "npm start" 2>/dev/null || true
    pkill -f "node server.js" 2>/dev/null || true
    
    success "Services stopped"
}

# Clean up
cleanup() {
    log "Cleaning up..."
    
    # Remove unused Docker images
    docker image prune -f
    
    # Remove unused Docker volumes
    docker volume prune -f
    
    # Clean npm cache
    npm cache clean --force
    
    success "Cleanup completed"
}

# Show logs
show_logs() {
    log "Showing service logs..."
    docker-compose logs -f
}

# Health check
health_check() {
    log "Performing health check..."
    
    # Check frontend
    if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
        success "Frontend is healthy"
    else
        error "Frontend is not responding"
    fi
    
    # Check backend
    if curl -f http://localhost:$BACKEND_PORT/api/health > /dev/null 2>&1; then
        success "Backend is healthy"
    else
        error "Backend is not responding"
    fi
    
    success "All services are healthy"
}

# Show help
show_help() {
    echo "LifeOS Deployment Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  dev         Start development environment"
    echo "  test        Run tests"
    echo "  build       Build application"
    echo "  docker      Build Docker images"
    echo "  deploy      Deploy with Docker Compose"
    echo "  stop        Stop all services"
    echo "  logs        Show service logs"
    echo "  health      Perform health check"
    echo "  cleanup     Clean up unused resources"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev      # Start development environment"
    echo "  $0 deploy   # Deploy to production"
    echo "  $0 health  # Check service health"
}

# Main script
main() {
    case "${1:-help}" in
        "dev")
            check_node
            install_dependencies
            start_dev
            ;;
        "test")
            check_node
            install_dependencies
            run_tests
            ;;
        "build")
            check_node
            install_dependencies
            build_app
            ;;
        "docker")
            check_docker
            build_docker
            ;;
        "deploy")
            check_docker
            build_docker
            deploy_docker
            ;;
        "stop")
            stop_services
            ;;
        "logs")
            show_logs
            ;;
        "health")
            health_check
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Run main function
main "$@"
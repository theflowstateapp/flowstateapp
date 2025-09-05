#!/bin/bash

# LifeOS Automated Testing Script
# This script runs comprehensive tests for the LifeOS application

echo "🚀 Starting LifeOS Automated Testing Suite"
echo "=========================================="

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Playwright is installed
if ! npx playwright --version &> /dev/null; then
    print_warning "Playwright is not installed. Installing now..."
    npm install -D @playwright/test playwright
    npx playwright install
fi

# Create test results directory
mkdir -p test-results

print_status "Setting up test environment..."

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Creating template..."
    cat > .env << EOF
# OpenAI Configuration
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here
REACT_APP_OPENAI_API_URL=https://api.openai.com/v1

# Supabase Configuration
REACT_APP_SUPABASE_URL=your_supabase_url_here
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Test Configuration
REACT_APP_TEST_MODE=true
REACT_APP_MOCK_AI=true
EOF
    print_warning "Please update .env file with your actual API keys before running tests."
fi

# Function to run tests with different configurations
run_tests() {
    local test_type=$1
    local browser=$2
    local headed=$3
    
    print_status "Running $test_type tests on $browser..."
    
    if [ "$headed" = "true" ]; then
        npx playwright test --project=$browser --headed
    else
        npx playwright test --project=$browser
    fi
    
    if [ $? -eq 0 ]; then
        print_success "$test_type tests passed on $browser"
    else
        print_error "$test_type tests failed on $browser"
        return 1
    fi
}

# Function to run specific test suites
run_test_suite() {
    local suite_name=$1
    local test_file=$2
    
    print_status "Running $suite_name test suite..."
    
    npx playwright test $test_file
    
    if [ $? -eq 0 ]; then
        print_success "$suite_name test suite passed"
    else
        print_error "$suite_name test suite failed"
        return 1
    fi
}

# Main test execution
main() {
    local test_mode=${1:-"all"}
    local browser=${2:-"chromium"}
    local headed=${3:-"false"}
    
    case $test_mode in
        "all")
            print_status "Running all tests..."
            
            # Start the development server
            print_status "Starting development server..."
            npm start &
            SERVER_PID=$!
            
            # Wait for server to start
            sleep 10
            
            # Run tests
            run_tests "Complete System" $browser $headed
            
            # Stop the server
            kill $SERVER_PID
            ;;
            
        "core")
            print_status "Running core functionality tests..."
            run_test_suite "Core Functionality" "tests/e2e/lifeos-complete-system-test.spec.js"
            ;;
            
        "ai")
            print_status "Running AI integration tests..."
            run_test_suite "AI Integration" "tests/e2e/ai-integration-test.spec.js"
            ;;
            
        "pricing")
            print_status "Running pricing and billing tests..."
            run_test_suite "Pricing & Billing" "tests/e2e/pricing-billing-test.spec.js"
            ;;
            
        "performance")
            print_status "Running performance tests..."
            run_test_suite "Performance" "tests/e2e/performance-test.spec.js"
            ;;
            
        "ui")
            print_status "Running UI tests with Playwright UI..."
            npx playwright test --ui
            ;;
            
        "debug")
            print_status "Running tests in debug mode..."
            npx playwright test --debug
            ;;
            
        "headed")
            print_status "Running tests in headed mode..."
            npx playwright test --headed
            ;;
            
        *)
            print_error "Invalid test mode: $test_mode"
            print_status "Available modes: all, core, ai, pricing, performance, ui, debug, headed"
            exit 1
            ;;
    esac
}

# Function to generate test report
generate_report() {
    print_status "Generating test report..."
    
    if [ -f "test-results/results.json" ]; then
        # Convert JSON results to HTML report
        npx playwright show-report test-results/
        print_success "Test report generated. Opening in browser..."
    else
        print_warning "No test results found to generate report."
    fi
}

# Function to clean up test artifacts
cleanup() {
    print_status "Cleaning up test artifacts..."
    
    # Remove test screenshots and videos (keep failures)
    find test-results/ -name "*.png" -delete
    find test-results/ -name "*.webm" -delete
    
    # Remove temporary files
    rm -rf .playwright/
    
    print_success "Cleanup completed."
}

# Function to show help
show_help() {
    echo "LifeOS Automated Testing Script"
    echo "==============================="
    echo ""
    echo "Usage: $0 [test_mode] [browser] [headed]"
    echo ""
    echo "Test Modes:"
    echo "  all         - Run all tests (default)"
    echo "  core        - Run core functionality tests only"
    echo "  ai          - Run AI integration tests only"
    echo "  pricing     - Run pricing and billing tests only"
    echo "  performance - Run performance tests only"
    echo "  ui          - Run tests with Playwright UI"
    echo "  debug       - Run tests in debug mode"
    echo "  headed      - Run tests in headed mode"
    echo ""
    echo "Browsers:"
    echo "  chromium    - Chrome/Chromium (default)"
    echo "  firefox     - Firefox"
    echo "  webkit      - Safari/WebKit"
    echo ""
    echo "Options:"
    echo "  true        - Run in headed mode (show browser)"
    echo "  false       - Run in headless mode (default)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Run all tests on Chromium headless"
    echo "  $0 all chromium true  # Run all tests on Chromium headed"
    echo "  $0 core firefox       # Run core tests on Firefox"
    echo "  $0 ui                 # Run tests with UI"
    echo ""
    echo "Additional Commands:"
    echo "  $0 report             # Generate test report"
    echo "  $0 cleanup            # Clean up test artifacts"
    echo "  $0 help               # Show this help message"
}

# Parse command line arguments
case "${1:-all}" in
    "help"|"-h"|"--help")
        show_help
        exit 0
        ;;
    "report")
        generate_report
        exit 0
        ;;
    "cleanup")
        cleanup
        exit 0
        ;;
    *)
        main "${1:-all}" "${2:-chromium}" "${3:-false}"
        ;;
esac

# Final status
if [ $? -eq 0 ]; then
    echo ""
    print_success "🎉 All tests completed successfully!"
    print_status "Test results saved in: test-results/"
    print_status "To view detailed report: $0 report"
else
    echo ""
    print_error "❌ Some tests failed. Check the output above for details."
    print_status "To view detailed report: $0 report"
    exit 1
fi

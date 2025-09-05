# LifeOS Backend API

## 🚀 Enterprise-Grade Backend for LifeOS

A robust, scalable Node.js backend API for the LifeOS life management platform, featuring secure authentication, real-time synchronization, and comprehensive data management.

---

## 🏗️ Architecture

### **Technology Stack**
- **Runtime**: Node.js 18+ with Express.js
- **Database**: PostgreSQL with Supabase
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.IO
- **Caching**: Redis
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston
- **Validation**: Express-validator
- **Compression**: Compression middleware

### **Key Features**
- ✅ **Secure Authentication**: JWT-based auth with refresh tokens
- ✅ **Real-time Sync**: WebSocket connections for live updates
- ✅ **Rate Limiting**: API and general request rate limiting
- ✅ **Security Headers**: Comprehensive security middleware
- ✅ **Error Handling**: Global error handling and logging
- ✅ **Database Integration**: Supabase PostgreSQL integration
- ✅ **Validation**: Request validation and sanitization
- ✅ **Logging**: Structured logging with multiple transports

---

## 📦 Installation

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account and project
- Redis (optional, for caching)

### **Setup**
```bash
# Clone the repository
git clone <repository-url>
cd backend

# Install dependencies
npm install

# Copy environment template
cp env-template.txt .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

---

## ⚙️ Configuration

### **Environment Variables**

Copy `env-template.txt` to `.env` and configure:

```bash
# Server Configuration
NODE_ENV=development
PORT=3001

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_in_production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
CORS_ORIGIN=http://localhost:3000
```

---

## 🚀 Usage

### **Development**
```bash
# Start development server with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### **Production**
```bash
# Start production server
npm start
```

---

## 📡 API Endpoints

### **Authentication**
```
POST /api/auth/register     - Register new user
POST /api/auth/login        - Login user
POST /api/auth/logout       - Logout user
GET  /api/auth/me          - Get current user
POST /api/auth/refresh      - Refresh access token
```

### **Health Check**
```
GET /health                - Server health check
```

---

## 🔐 Security Features

### **Authentication & Authorization**
- JWT-based authentication with access and refresh tokens
- Token rotation and secure storage
- Role-based access control (RBAC)
- Resource ownership validation

### **Security Headers**
- Helmet.js for security headers
- CORS configuration
- Content Security Policy (CSP)
- XSS protection

### **Rate Limiting**
- General rate limiting: 100 requests per 15 minutes
- API rate limiting: 50 requests per 15 minutes
- Configurable limits per endpoint

### **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

---

## 🔌 Real-time Features

### **Socket.IO Integration**
- Real-time habit check-ins
- Live goal progress updates
- Multi-device synchronization
- Instant notifications

### **Event Types**
```javascript
// Client to Server
socket.emit('authenticate', token)
socket.emit('habit-checkin', { habitId, userId })
socket.emit('goal-progress', { goalId, progress })

// Server to Client
socket.on('authenticated', { success, message })
socket.on('habit-checkin-updated', { habitId, userId, timestamp })
socket.on('goal-progress-updated', { goalId, userId, progress, timestamp })
```

---

## 📊 Database Schema

The backend integrates with the comprehensive Supabase schema that includes:

### **Core Tables**
- `profiles` - User profiles and preferences
- `life_areas` - Life areas (PARA method)
- `projects` - Project management
- `goals` - Goal tracking
- `tasks` - Task management
- `habits` - Habit tracking
- `habit_checkins` - Habit check-in logs

### **Relationships**
- Many-to-many relationships between tasks, projects, and goals
- User ownership for all resources
- Hierarchical task structures
- Time tracking and analytics

---

## 🧪 Testing

### **Test Structure**
```
tests/
├── unit/           - Unit tests
├── integration/    - Integration tests
├── e2e/           - End-to-end tests
└── fixtures/      - Test data
```

### **Running Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 📝 Logging

### **Log Levels**
- `error` - Error messages
- `warn` - Warning messages
- `info` - Information messages
- `http` - HTTP request logs
- `debug` - Debug messages

### **Log Outputs**
- Console output (development)
- File output (production)
- Error log file
- Combined log file

---

## 🔧 Development

### **Project Structure**
```
backend/
├── src/
│   ├── config/        - Configuration files
│   ├── controllers/   - Route controllers
│   ├── middleware/     - Custom middleware
│   ├── models/         - Data models
│   ├── routes/         - API routes
│   ├── services/       - Business logic
│   └── utils/          - Utility functions
├── logs/              - Log files
├── tests/             - Test files
├── server.js          - Main server file
└── package.json       - Dependencies
```

### **Adding New Features**
1. Create controller in `src/controllers/`
2. Add routes in `src/routes/`
3. Create middleware if needed
4. Add validation rules
5. Write tests
6. Update documentation

---

## 🚀 Deployment

### **Environment Setup**
1. Set production environment variables
2. Configure database connections
3. Set up monitoring and logging
4. Configure SSL certificates
5. Set up load balancing

### **Deployment Options**
- **Railway**: Easy deployment with automatic scaling
- **Heroku**: Traditional PaaS deployment
- **AWS**: EC2 with load balancer
- **Docker**: Containerized deployment

---

## 📈 Monitoring

### **Health Checks**
- Database connectivity
- Redis connectivity
- External service status
- Response time monitoring

### **Metrics**
- Request/response times
- Error rates
- Database performance
- Memory usage
- CPU utilization

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the troubleshooting guide

---

## 🔄 Changelog

### **v1.0.0** - Initial Release
- ✅ Authentication system
- ✅ Real-time features
- ✅ Security middleware
- ✅ Database integration
- ✅ Comprehensive logging
- ✅ Error handling
- ✅ Rate limiting
- ✅ Health checks

# CodeSync - Real-Time Collaborative Code Editor

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![React](https://img.shields.io/badge/React-v19-blue.svg)
![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg)

CodeSync is a web-based collaborative code editor that enables real-time code editing, execution, and communication between multiple users. Built with modern web technologies, it provides a seamless experience for pair programming, technical interviews, and collaborative problem-solving.

## 🎯 Features

### Core Features
- **Real-Time Collaborative Editing** - Multiple users can edit code simultaneously with live cursor positions
- **Code Execution Engine** - Execute code and view output in real-time
- **Live Chat** - Communicate with collaborators during coding sessions
- **Problem Statements** - Create and share coding problems/challenges
- **Multiple Language Support** - Support for JavaScript, Python, Java, C++, and more
- **Session Management** - Create, join, and manage collaboration sessions

### Authentication & Security
- **OAuth 2.0 Integration** - Google Sign-in support
- **JWT Authentication** - Secure API endpoints
- **Password Management** - Secure registration and login with bcryptjs
- **Rate Limiting** - DDoS protection on all endpoints
- **Security Headers** - Helmet.js for HTTP security
- **Session Management** - MongoDB-backed persistent sessions

### User Features
- **User Profiles** - Customizable user profiles with avatar support
- **Dark/Light Theme** - Switchable theme support
- **Email Notifications** - OTP-based password recovery
- **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB with Mongoose ODM
- **Real-Time:** Socket.io for WebSocket communication
- **Authentication:** Passport.js (Local + Google OAuth)
- **Security:** Helmet, bcryptjs, JWT
- **File Upload:** Cloudinary
- **Email:** Nodemailer
- **Rate Limiting:** express-rate-limit
- **Server:** Node.js v18+

**Frontend:**
- **Library:** React 19
- **Build Tool:** Vite
- **UI Framework:** Material-UI (MUI)
- **State Management:** Redux Toolkit
- **Code Editor:** Monaco Editor
- **Real-Time:** Socket.io Client
- **HTTP Client:** Axios
- **Styling:** Emotion + Styled Components
- **Routing:** React Router v7

### Project Structure

```
CodeSync/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── cloudinary.js   # Cloudinary setup
│   │   ├── passport.js     # Authentication strategies
│   │   └── socket.io.js    # WebSocket configuration
│   ├── controller/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── email.controller.js
│   │   ├── profileDetail.controller.js
│   │   └── session.controller.js
│   ├── middleware/          # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/             # Database models
│   │   ├── User.js
│   │   ├── Problem.js
│   │   ├── CollaborationRoom.js
│   │   ├── session.model.js
│   │   ├── TestCase.js
│   │   ├── Otp.js
│   │   └── profile.model.js
│   ├── routes/             # API routes
│   │   ├── auth.js
│   │   ├── profile.js
│   │   └── session.route.js
│   ├── utils/              # Utility functions
│   │   └── mailer.js
│   ├── index.js            # Application entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── appButton.jsx
│   │   │   ├── appModal.jsx
│   │   │   ├── appTextField.jsx
│   │   │   ├── codeEditor.jsx
│   │   │   ├── navbar.jsx
│   │   │   ├── session/   # Session-specific components
│   │   │   └── landingPage/
│   │   ├── pages/          # Page components
│   │   │   ├── landing.jsx
│   │   │   ├── auth/       # Authentication pages
│   │   │   ├── session/    # Session pages
│   │   │   └── user/       # User profile pages
│   │   ├── redux/          # State management
│   │   │   ├── store.js
│   │   │   ├── userSlice.js
│   │   │   ├── sessionSlice.js
│   │   │   ├── loadingSlice.js
│   │   │   └── notificationSlice.js
│   │   ├── utils/          # Utility functions
│   │   │   ├── api.js
│   │   │   ├── httpClient.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── theme.js        # Theme configuration
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (Cloud Atlas recommended)
- **npm** or **yarn**
- **Git**

### Environment Variables

#### Backend (.env)

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/codesync

# Security
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_key_here

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Service (Nodemailer)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Session
SESSION_STORE_DB=codesync
```

#### Frontend (.env)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Installation & Setup

#### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

The backend will run on `http://localhost:3000`

#### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will run on `http://localhost:5173`

### First Run Checklist

1. ✅ Ensure MongoDB connection is established
2. ✅ Validate all required environment variables are set
3. ✅ Backend starts without errors on port 3000
4. ✅ Frontend loads successfully on localhost:5173
5. ✅ Test Google OAuth callback URL is configured
6. ✅ Email service credentials are valid

## 📖 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user with email |
| POST | `/auth/login` | Login with email and password |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/google` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| POST | `/auth/forgot-password` | Request password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/profile` | Get current user profile |
| PUT | `/user/profile` | Update user profile |
| GET | `/user/:userId` | Get user by ID |
| PUT | `/user/avatar` | Upload user avatar |

### Session Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/session/create` | Create new collaboration session |
| GET | `/session/:sessionId` | Get session details |
| PUT | `/session/:sessionId` | Update session |
| DELETE | `/session/:sessionId` | Delete session |
| GET | `/session` | List user's sessions |

### WebSocket Events

**Client → Server:**
- `code-change` - Broadcast code changes
- `cursor-move` - Share cursor position
- `chat-message` - Send chat message
- `execute-code` - Request code execution
- `join-session` - Join collaboration session
- `leave-session` - Leave collaboration session

**Server → Client:**
- `code-updated` - Receive code changes
- `cursor-updated` - Receive cursor updates
- `chat-message` - Receive chat messages
- `execution-result` - Receive code execution output
- `user-joined` - Notify user joined
- `user-left` - Notify user left

## 🔒 Security Features

### Implemented Security Measures

- **HTTPS Only Cookies** - In production environment
- **CORS Protection** - Configurable origins
- **Rate Limiting** - 200 requests per 15 minutes
- **SQL/NoSQL Injection Prevention** - Via Mongoose schema validation
- **XSS Protection** - Helmet.js security headers
- **CSRF Protection** - Session-based with secure cookies
- **Password Hashing** - bcryptjs with salt rounds
- **JWT Tokens** - Secure API authentication
- **Input Validation** - Schema-based validation
- **Helmet Security Headers** - HTTP security hardening

### Recommended Security Practices

1. Always use HTTPS in production
2. Rotate JWT_SECRET and SESSION_SECRET regularly
3. Use environment variables for all sensitive data
4. Implement request body size limits
5. Monitor rate limiting metrics
6. Log and audit authentication events
7. Regularly update dependencies

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Current Status

⚠️ **Note:** Test coverage is currently minimal. Add comprehensive tests before production deployment.

## 📦 Deployment

### Backend Deployment (Heroku/Railway/Render)

```bash
# Set environment variables in deployment platform
# Ensure MongoDB Atlas connection is whitelisted for deployment server IP
# Deploy using Git push or platform CLI
```

### Frontend Deployment (Vercel/Netlify)

```bash
# The frontend is configured for Vercel deployment
# Ensure VITE_API_URL points to production backend URL
# Deploy using platform CLI or Git integration

# Vercel deployment (already configured)
npm run build
vercel --prod
```

### Environment Variables for Production

Update all environment variables for production URLs:
- `CLIENT_URL` - Production frontend URL
- `VITE_API_URL` - Production backend API URL
- `VITE_SOCKET_URL` - Production WebSocket URL
- Email credentials - Use production email service
- Cloudinary - Production credentials

## 🐛 Troubleshooting

### Backend Issues

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check connection string and whitelist IP in MongoDB Atlas |
| Google OAuth fails | Verify CLIENT_ID, CLIENT_SECRET, and redirect URI |
| Rate limiting blocking requests | Adjust rate limit in production configuration |
| Email not sending | Verify email credentials and enable "Less secure apps" for Gmail |

### Frontend Issues

| Issue | Solution |
|-------|----------|
| API calls failing | Ensure backend is running and CORS is properly configured |
| Socket.io not connecting | Check VITE_SOCKET_URL and backend socket.io configuration |
| Build fails | Clear `node_modules` and `dist`, reinstall dependencies |
| Hot reload not working | Ensure Vite server is running on correct port |

## 📋 Requirements Met

### Functional Requirements
- ✅ Real-time collaborative code editing
- ✅ Multi-user session management
- ✅ Code execution and output display
- ✅ Live chat functionality
- ✅ User authentication and authorization
- ✅ User profile management
- ✅ Problem/challenge creation
- ✅ Session persistence

### Non-Functional Requirements
- ✅ Security (authentication, authorization, encryption)
- ✅ Scalability (MongoDB for horizontal scaling)
- ✅ Performance (Vite, optimized bundle)
- ✅ Availability (Session persistence, error recovery)
- ✅ Maintainability (Modular architecture, clear separation of concerns)

## 🚦 Production Readiness Checklist

- [ ] Comprehensive API documentation (Swagger/OpenAPI)
- [ ] Error handling middleware with structured logging
- [ ] Integration and unit tests (90%+ coverage)
- [ ] Database indexes optimized
- [ ] Request validation with Joi/Zod
- [ ] Monitoring and error tracking (Sentry)
- [ ] Performance monitoring (APM)
- [ ] Database backup strategy
- [ ] Rate limiting per endpoint
- [ ] Complete socket.io configuration
- [ ] Code execution sandboxing
- [ ] Automated CI/CD pipeline
- [ ] Security audit completed
- [ ] Load testing performed
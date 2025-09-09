# PrintFlow - Printing Workflow Management System

A comprehensive printing workflow management system designed for printing agencies, design studios, and print shops. PrintFlow streamlines project management, task tracking, print job scheduling, invoicing, and client communication in one integrated platform.

## 🚀 Features

### Core Functionality
- **Project Management**: Create, track, and manage printing projects from concept to delivery
- **Task Management**: Kanban-style task boards with drag-and-drop functionality
- **Print Job Scheduling**: Advanced print queue management with machine assignment
- **Invoice Management**: Multi-currency invoicing with automated calculations
- **File Management**: Secure file upload, versioning, and approval workflows
- **Real-time Notifications**: WebSocket-based live updates
- **Quality Control**: Built-in quality check workflows and approvals

### Multi-Currency Support
- Sudanese Pound (SDG) - Primary
- UAE Dirham (AED)
- Saudi Riyal (SAR)
- Egyptian Pound (EGP)
- US Dollar (USD)

### Multi-Language Support
- English (LTR)
- Arabic (RTL)

### Accounting & CRM Features
- Full accounting system tailored for printing industry
- Client relationship management (CRM)
- Automated invoice generation
- Payment tracking and reporting
- Cost estimation engine
- Profit margin analysis

### User Roles
- **Admin**: Full system access and configuration
- **Manager**: Project oversight and team management
- **Designer**: Creative tasks and file management
- **Client**: Project visibility and file approval
- **Operator**: Print job execution and quality control

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Cloudinary** for file storage
- **Stripe** for payment processing
- **Multer** for file uploads
- **Joi** for validation

### Frontend
- **React 18** with functional components and hooks
- **Material-UI (MUI)** for component library
- **Redux Toolkit** for state management
- **React Router** for navigation
- **React Query** for server state management
- **React Beautiful DnD** for drag-and-drop
- **i18next** for internationalization

### Infrastructure
- **Docker** containerization
- **Nginx** reverse proxy
- **Redis** for caching
- **MongoDB Atlas** for cloud database

## 📋 Prerequisites

- Node.js 16+ and npm
- MongoDB 6.0+
- Redis (optional, for caching)
- Docker and Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/printflow.git
   cd printflow
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/api-docs

### Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Access the Application**
   - Application: http://localhost
   - MongoDB: localhost:27017
   - Redis: localhost:6379

## 📁 Project Structure

```
printflow/
├── backend/                 # Node.js API server
│   ├── config/             # Database, Cloudinary, Stripe config
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication, validation, upload
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── seeds/             # Database seeders
│   └── server.js          # Express server entry point
├── frontend/              # React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── styles/        # CSS files
│   │   └── utils/         # Utility functions
│   └── package.json
├── docker-compose.yml     # Docker services configuration
├── .env.example          # Environment variables template
├── .gitignore           # Git ignore rules
└── README.md           # Project documentation
```

## 🔧 Configuration

### Environment Variables

Key environment variables to configure:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/printflow

# Authentication
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=7d

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Payment Processing
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key

# Email
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Multi-Currency Configuration

The system supports multiple currencies with automatic conversion:

- **Primary Currency**: Set in user preferences
- **Exchange Rates**: Auto-updated via external API
- **Invoice Currency**: Configurable per client/project

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset

### Project Management
- `GET /api/projects` - Get projects list
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Task Management
- `GET /api/tasks` - Get tasks list
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PUT /api/tasks/:id/status` - Update task status

### Print Jobs
- `GET /api/print-jobs` - Get print jobs list
- `POST /api/print-jobs` - Create print job
- `PUT /api/print-jobs/:id/status` - Update print job status

### Invoicing
- `GET /api/invoices` - Get invoices list
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `POST /api/invoices/:id/send` - Send invoice to client

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### Integration Testing
```bash
npm run test:integration
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized MongoDB indexes for common queries
- **Caching**: Redis caching for frequently accessed data
- **File Compression**: Automatic image optimization via Cloudinary
- **Code Splitting**: React lazy loading for better performance
- **Service Worker**: PWA features for offline functionality

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- File upload validation and scanning
- Rate limiting on API endpoints
- CORS configuration
- Input validation and sanitization
- Secure headers with Helmet.js

## 🌐 Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   NODE_ENV=production
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Build Frontend**
   ```bash
   cd frontend
   npm run build
   ```

4. **Start Services**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment Options

- **MongoDB Atlas**: Cloud database hosting
- **Cloudinary**: Image and file storage
- **Heroku/DigitalOcean**: Application hosting
- **Vercel/Netlify**: Frontend hosting
- **AWS/Azure**: Full infrastructure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development Team**: PrintFlow Development Team
- **UI/UX Design**: Design Studio
- **Project Management**: Project Lead

## 📞 Support

For support and inquiries:
- Email: support@printflow.com
- Documentation: https://docs.printflow.com
- Issues: GitHub Issues page

## 🗺 Roadmap

### Version 2.0 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] AI-powered cost estimation
- [ ] Integration with popular design tools

### Version 2.5 (Q3 2024)
- [ ] Multi-tenant architecture
- [ ] Advanced workflow automation
- [ ] Third-party integrations
- [ ] Enhanced reporting features

---

**PrintFlow** - Streamlining printing workflows for the digital age.

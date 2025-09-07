# Farm Management System

A comprehensive MERN stack application for managing farm operations with specialized features for Sri Lankan agriculture, particularly paddy cultivation.

## 🌾 Features

- **Crop Management**: Track crops from planting to harvest with detailed growth stages
- **Season Planning**: Specialized paddy cultivation planning with variety selection
- **Daily Remarks**: Document daily observations with photos and categorization
- **Expense Management**: Comprehensive expense tracking with 18 categories and auto-calculations
- **Accordion UI**: Collapsible sections for better space utilization and navigation
- **Cloud Image Storage**: Secure image storage using Cloudflare R2 with global CDN
- **HEIC Image Support**: Automatic conversion of iOS HEIC images with optimization
- **Livestock Management**: Monitor and manage farm animals
- **Inventory Tracking**: Keep track of seeds, fertilizers, and equipment
- **Weather Integration**: Climate-based recommendations for farming decisions
- **Yield Analytics**: Comprehensive reporting and analytics
- **Multi-user Support**: Role-based access control (Owner, Manager, Worker, Viewer)

## 🛠️ Tech Stack

### Frontend
- **React** with **Gatsby** - Static site generation and modern React features
- **Material-UI (MUI)** - Professional UI components and design system
- **React Context API** - State management for authentication and data
- **React Router** - Client-side routing
- **Day.js** - Date manipulation and formatting
- **React Toastify** - User notifications

### Backend
- **Node.js** with **Express.js** - RESTful API server
- **MongoDB Atlas** - Cloud database with Mongoose ODM
- **Cloudflare R2** - S3-compatible object storage for images with global CDN
- **AWS SDK** - S3-compatible client for R2 integration
- **HEIC Convert** & **Sharp** - Image processing and HEIC conversion
- **JWT Authentication** - Secure user authentication
- **bcryptjs** - Password hashing and security
- **Multer** - File upload handling with memory storage
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logging

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/lakkaru/farm_managment.git
   cd farm_managment
   ```

2. **Set up Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   NODE_ENV=development
   
   # Cloudflare R2 Configuration (for image storage)
   R2_ENDPOINT=https://YOUR_ACCOUNT_ID.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=farm-management-images
   R2_ACCOUNT_ID=your_cloudflare_account_id
   # R2_PUBLIC_URL=https://images.yourdomain.com  # Optional: custom domain
   ```
   
   > 📄 **Note**: For detailed R2 setup instructions, see [R2_MIGRATION_GUIDE.md](./R2_MIGRATION_GUIDE.md)

4. **Set up Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5000

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run develop
   ```
   Frontend will run on http://localhost:8000

## 📱 Application Structure

```
farm_managment/
├── backend/                 # Express.js API server
│   ├── controllers/        # Request handlers
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Server entry point
├── frontend/               # Gatsby React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Gatsby pages
│   │   ├── providers/     # Context providers
│   │   └── utils/         # Utility functions
│   ├── gatsby-config.js   # Gatsby configuration
│   └── package.json
└── README.md
```

## 🌾 Specialized Features

### Paddy Season Planning
- **Variety Selection**: Choose from 10+ Sri Lankan paddy varieties
- **Climate Zone Integration**: Recommendations based on district selection
- **Irrigation Planning**: Support for different irrigation methods
- **Fertilizer Scheduling**: Automated NPK scheduling based on soil conditions
- **Growth Stage Tracking**: Monitor paddy growth from planting to harvest

### User Roles
- **Farm Owner**: Full access to all features
- **Farm Manager**: Manage day-to-day operations
- **Worker**: Execute assigned tasks and update progress
- **Viewer**: Read-only access for reporting and monitoring

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Farm Management
- `GET /api/farms` - Get user's farms
- `POST /api/farms` - Create new farm
- `PUT /api/farms/:id` - Update farm details

### Season Planning
- `GET /api/paddy-varieties` - Get available paddy varieties
- `POST /api/season-plans` - Create season plan
- `GET /api/season-plans` - Get user's season plans

### Crops & Livestock
- `GET /api/crops` - Get crops
- `POST /api/crops` - Add new crop
- `GET /api/livestock` - Get livestock
- `POST /api/livestock` - Add livestock

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Sri Lankan Department of Agriculture for paddy variety data
- Material-UI team for the excellent component library
- MongoDB Atlas for reliable cloud database services

## 📧 Contact

For questions and support, please open an issue in the GitHub repository.

---

Built with ❤️ for Sri Lankan farmers and modern agriculture management.

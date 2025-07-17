# Himalaya Adventure - Trekking Website

## Overview

Himalaya Adventure is a comprehensive full-stack web application designed for trekking enthusiasts seeking authentic Himalayan experiences in Nepal. Built with modern technologies, it features a React-based frontend with a Django REST API backend, offering seamless user authentication, package browsing, booking management, and secure email verification systems.

## ✨ Key Features

### 🏔️ **Complete Trekking Platform**

- **Package Discovery**: Browse curated trekking packages with detailed itineraries, pricing, and difficulty levels
- **Advanced Search & Filtering**: Filter by region, difficulty, duration, price range with real-time search
- **Interactive Package Details**: Day-by-day itineraries, packing checklists, route maps, and comprehensive package information
- **Image Galleries**: High-quality image sliders showcasing trekking destinations

### 👤 **User Authentication & Profiles**

- **Secure Registration**: Complete user onboarding with email verification
- **Email Verification System**: SMTP-based email verification using Zoho mail service
- **User Profiles**: Comprehensive profile management with personal information, preferences, and notification settings
- **Password Management**: Secure password change and reset functionality with token-based verification

### 📧 **Email System**

- **Welcome Emails**: HTML-formatted welcome emails with verification links
- **Password Reset**: Secure password reset with time-limited tokens
- **Newsletter Subscription**: Optional newsletter and promotional offers subscription

### 🎯 **Booking Management**

- **Multi-Person Bookings**: Support for group bookings with individual traveler details
- **Room Sharing Options**: Intelligent room sharing system with automatic pairing
- **Price Calculation**: Dynamic pricing with transparent cost breakdown
- **Form Validation**: Comprehensive client and server-side validation

### 🎨 **Modern UI/UX**

- **Responsive Design**: Fully responsive design optimized for all devices
- **Motion Design**: Smooth animations using Framer Motion
- **Interactive Components**: Dynamic sliders, accordions, and expandable sections
- **Professional Layout**: Clean, modern design with consistent branding

### 🔐 **Security & Performance**

- **Token-based Authentication**: Secure JWT authentication system
- **CORS Configuration**: Properly configured cross-origin resource sharing
- **Input Validation**: Comprehensive validation on both frontend and backend
- **Error Handling**: Graceful error handling with user-friendly messages

## 🛠️ Tech Stack

### **Frontend**

- **React 18** with Vite for fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for smooth animations
- **React Router DOM** for client-side routing
- **Lucide React** & **Heroicons** for consistent iconography
- **React Slick** for image carousels and sliders

### **Backend**

- **Django 5.2.3** with Django REST Framework
- **PostgreSQL** database for robust data management
- **Token Authentication** for secure API access
- **Django CORS Headers** for cross-origin requests
- **Email Backend** with SMTP configuration (Zoho)

### **Additional Tools**

- **UUID** for secure token generation
- **Axios** for HTTP requests
- **Custom Hooks** for state management
- **Error Boundaries** for robust error handling

## 📁 Project Structure

```
trekkingwebsite/
├── backend/                    # Django backend
│   ├── api/                   # Main API application
│   │   ├── models.py         # Database models (Package, UserProfile, etc.)
│   │   ├── views.py          # API endpoints and business logic
│   │   ├── serializers.py    # Data serialization
│   │   ├── urls.py          # API route definitions
│   │   └── admin.py         # Django admin configuration
│   ├── backend/              # Django settings
│   │   ├── settings.py      # Configuration (DB, Email, CORS)
│   │   └── urls.py          # Main URL routing
│   └── media/               # User uploaded files
├── trekkingfrontend/          # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Homepage.jsx # Main landing page
│   │   │   ├── PackageList.jsx # Package browsing
│   │   │   ├── PackageDetails.jsx # Detailed package view
│   │   │   ├── Booking.jsx  # Booking system
│   │   │   ├── SignUp.jsx   # User registration
│   │   │   ├── Login.jsx    # User authentication
│   │   │   ├── Profile.jsx  # User profile management
│   │   │   ├── EmailVerification.jsx # Email verification
│   │   │   ├── About.jsx    # Company information
│   │   │   ├── ContactUs.jsx # Contact form
│   │   │   └── Navbar.jsx   # Navigation component
│   │   ├── contexts/        # React contexts
│   │   │   └── AuthContext.jsx # Authentication state management
│   │   └── utils/           # Utility functions
│   └── public/              # Static assets
└── README.md
```

## 🚀 API Endpoints

### **Authentication**

```
POST /api/auth/register/              # User registration
POST /api/auth/login/                 # User login
POST /api/auth/logout/                # User logout
GET  /api/auth/verify-email/<token>/  # Email verification
POST /api/auth/password-reset/        # Request password reset
POST /api/auth/password-reset/confirm/ # Confirm password reset
```

### **User Profile**

```
PUT /api/profile/update/              # Update user profile
PUT /api/profile/notifications/       # Update notification preferences
POST /api/profile/change-password/    # Change password
```

### **Packages**

```
GET /api/packages/                    # List all packages
GET /api/packages/<id>/               # Get package details
```

### **Admin (Staff Only)**

```
GET  /api/admin/packages/             # Admin package management
POST /api/admin/packages/<id>/images/ # Upload package images
```

## 🔧 Installation & Setup

### **Prerequisites**

- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL
- Git

### **1. Clone Repository**

```bash
git clone https://github.com/Allan0092/TrekkingWebsite.git
cd trekkingwebsite
```

### **2. Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

### **3. Frontend Setup**

```bash
cd trekkingfrontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### **4. Environment Configuration**

Create `.env` file in backend directory:

```env
# Database
DB_NAME=trek_data
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432

# Email Configuration
EMAIL_HOST_USER=your_email@zohomail.com
EMAIL_HOST_PASSWORD=your_app_password
DEFAULT_FROM_EMAIL=Himalaya Adventure <your_email@zohomail.com>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

## 🌐 Access Points

- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## 📊 Key Features Breakdown

### **User Journey**

1. **Discovery**: Browse packages with advanced filtering
2. **Registration**: Create account with email verification
3. **Profile Setup**: Complete profile with personal preferences
4. **Booking**: Multi-step booking process with group support
5. **Management**: Profile and notification management

### **Admin Features**

- Package management through Django admin
- Image upload system for packages
- User management and verification status
- Email system monitoring

### **Responsive Design**

- Mobile-first approach
- Tablet and desktop optimized layouts
- Touch-friendly interactions
- Optimized images and performance

## 🔒 Security Features

- **Authentication**: Token-based secure authentication
- **Email Verification**: Mandatory email verification for new accounts
- **Password Security**: Strong password requirements and secure reset
- **Data Validation**: Comprehensive input validation and sanitization
- **CORS Protection**: Configured cross-origin resource sharing
- **Error Handling**: Secure error messages without sensitive information exposure

## 🎯 Future Enhancements

- **Payment Integration**: Stripe/PayPal integration for online payments
- **Real-time Chat**: Customer support chat system
- **Review System**: User reviews and ratings for packages
- **Advanced Analytics**: User behavior and booking analytics
- **Multi-language Support**: Internationalization for global users

_Built with ❤️ for adventure seekers and mountain lovers_

# Islamic Learning Platform - Backend Server

A complete **Node.js + Express + MySQL** backend for an Islamic educational platform delivering religious audio lessons with user authentication, lecture management, categories, saved lectures, profile system, and full admin panel.

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18%2B-blue)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-blue)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- User authentication (Email/Password + Google OAuth)
- JWT with 24h expiry
- Role-based access (Admin / User)
- Audio lecture upload & streaming
- Lecture categories
- Save favorite lectures
- Full profile management + image upload
- OTP password reset via email
- Search, pagination & sorting
- Secure file handling
- Detailed logging (Winston)
- Admin dashboard routes

## Project Structure
```bash
├── .gitignore
├── controller
│   ├── categoryController.js
│   ├── homeController.js
│   ├── lectureController.js
│   ├── profileController.js
│   └── saved_lectureController.js
├── docApiRes.md              # API documentation (old)
├── middleware
│   ├── admin.js
│   ├── auth.js
│   ├── error.js
│   ├── upload.js
│   └── validationId.js
├── module
│   ├── Quran.sql             # Database schema
│   └── db.js
├── package-lock.json
├── package.json
├── public                    # Static test pages
│   ├── createLecture.html
│   ├── sda.html
│   ├── signAouth.html
│   └── updateProfile.html
├── router
│   ├── category.js
│   ├── home.js
│   ├── lecture.js
│   ├── profile.js
│   └── saved_lecture.js
├── server.js                 # Entry point
├── startup
│   ├── AouthConfig.js
│   ├── logging.js
│   └── router.js
└── utils
├── catchError.js
├── deleteFile.js
├── generateOtp.js
├── sendEmail.js
├── statuscode.js
└── validation.js
```
## Tech Stack

- Node.js + Express.js
- MySQL
- JWT + bcrypt
- Passport.js (Google OAuth)
- Joi Validation
- Multer (file upload)
- Winston (logging)
- Nodemailer (email + OTP)

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/mahmudmahmod519-code/server_islamatic_deploying.git
cd server_islamatic_deploying
```
### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file (in root)
```bash
PORT=5000
JWT_SECRET=your_very_strong_secret_key_here
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=islamic_learning

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_app_password

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

BASE_URL=http://localhost:5000
```

### 4. Import Database
```bash
 mysql -u root -p islamic_learning < module/Quran.sql
```
### 5. Start the server
```bash
 npm start
# or for development with auto-restart
npm run dev
Server will run on: http://localhost:5000
```
## 📖 API Base URL

```http://localhost:5000/api```

## 🔐 Authentication

    Include JWT in header for protected routes:

    Authorization: Bearer <your_jwt_token>
    
### Main Auth Endpoints
```bash
Method         Endpoint                 Description
-----------------------------------------------------
POST    /api/sign-in                   Login with email & password
POST    /api/sign-up                   Register new user
POST    /api/forget-passwordSend       OTP to email
POST    /api/varification,Verify       OTP & reset password
GET     /api/auth/google               Google login
```

### 🎵 Key API Endpoints
1. Lectures

```bash
GET /api/lectures → Paginated list (+ search)
GET /api/lectures/:id
POST /api/lectures → (Admin) Upload new lecture
DELETE /api/lectures/:id → (Admin)
```

2. Categories

```bash
GET /api/categories
POST /api/categories → (Admin)
GET /api/categories/:id/lectures
```

3. Saved Lectures

```bash
POST /api/saved-lectures
GET /api/saved-lectures
DELETE /api/saved-lectures/:id
```
4. Profile

```bash
GET /api/profiles/myProfile
PUT /api/profiles/ → Update profile
PATCH /api/profiles/resetPassword
PATCH /api/profiles/uploadImage
```

5. Admin Routes

```bash
GET /api/profiles/ → All users
PATCH /api/profiles/:id → Change user role
DELETE /api/profiles/:id
```
## 🛡️ Security

    Bcrypt password hashing
    JWT with 24h expiry
    Joi validation
    File type & size restrictions
    CORS configured
    SQL injection prevention
    Rate limiting (optional middleware ready)

## 📧 Email Features

    OTP-based password reset
    Welcome & verification emails
    Powered by Nodemailer + Gmail

## 🤝 Contributing

    Fork the project
    Create your feature branch (git checkout -b feature/amazing)
    Commit your changes (git commit -m 'Add amazing feature')
    Push to the branch (git push origin feature/amazing)
    Open a Pull Request

## 📄 License
    This project is licensed under the MIT License - see the LICENSE file for details.
    👨‍💻 Author & Support
    Developed with ❤️ by Mahmoud Mahmod
    For issues or support: Open an issue on GitHub or contact the team.


# note postman document api
1. HOME
- https://documenter.getpostman.com/view/35239363/2sB34eK2W1
2. Lecture
- https://documenter.getpostman.com/view/35239363/2sB34eK2aU
3. Save_Lecture
- https://documenter.getpostman.com/view/35239363/2sB34eK2oa
4. Category
- https://documenter.getpostman.com/view/35239363/2sB34eK2sz
5. Profile
- https://documenter.getpostman.com/view/35239363/2sB34eK2t6
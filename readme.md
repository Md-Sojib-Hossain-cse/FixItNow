# 🔧 FixItNow API

A scalable backend REST API for a **Home Service Marketplace** where customers can find skilled technicians, book home services, make payments, and leave reviews. Technicians can manage their services, availability, and bookings, while administrators oversee the entire platform.

Built with **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL** following a modular architecture.

---

# 🚀 Live API

```text
https://fix-it-now-ochre-two.vercel.app
```

---

# 🚀 Highlights

| Feature | Description |
|----------|-------------|
| 🔐 **JWT Authentication** | Secure authentication using Access & Refresh Tokens with Role-Based Access Control (RBAC). |
| 👥 **Multi-Role Architecture** | Dedicated workflows for Admin, Customer, and Technician with granular permissions. |
| 🛠 **Service Marketplace** | Manage services, technician profiles, and categories through RESTful APIs. |
| 📅 **Booking Management** | Availability scheduling, conflict-free bookings, and booking lifecycle management. |
| 💳 **Payment Integration** | Stripe and SSLCommerz integration for secure online payments. |
| ⭐ **Review System** | Customers can submit ratings and reviews after completed services. |
| 🔍 **Advanced Querying** | Search, filtering, sorting, and pagination for scalable API responses. |
| ⚡ **Performance Optimized** | Efficient Prisma queries, reusable middleware, and clean modular architecture. |
| 🛡 **Production-Ready Security** | Bcrypt password hashing, secure cookies, centralized error handling, and request validation. |
| 📦 **Developer Experience** | TypeScript, Prisma ORM, PostgreSQL (Neon), Zod validation, and standardized API responses. |

---

# 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Neon) |
| **ORM** | Prisma ORM |
| **Authentication** | JWT, Bcrypt.js |
| **Authorization** | Role-Based Access Control (RBAC) |
| **Payments** | SSLCommerz, Stripe |
| **API Testing** | Postman |
| **Development Tools** | TSX, TSUP, Prisma CLI |
| **Environment Management** | Dotenv |
| **HTTP Client** | Axios |
| **Utilities** | Cookie Parser, CORS, UUID, HTTP Status |
| **Database Driver** | pg, Prisma PostgreSQL Adapter |

---

# 📁 Project Structure

```text
fixitnow
│
├── prisma
│   ├── migrations
│   ├── models
│   │   ├── availability.prisma
│   │   ├── booking.prisma
│   │   ├── category.prisma
│   │   ├── enums.prisma
│   │   ├── payment.prisma
│   │   ├── review.prisma
│   │   ├── service.prisma
│   │   ├── technicianProfile.prisma
│   │   └── user.prisma
│   └── schema.prisma
│
├── src
│   ├── config
│   ├── errors
│   ├── lib
│   ├── middlewares
│   ├── modules
│   │   ├── admin
│   │   ├── auth
│   │   ├── availability
│   │   ├── booking
│   │   ├── category
│   │   ├── payment
│   │   ├── review
│   │   ├── service
│   │   ├── technician
│   │   └── user
│   ├── types
│   ├── utils
│   ├── app.ts
│   └── server.ts
│
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

---

# 🗃 Database Models

- User
- Technician Profile
- Category
- Service
- Availability
- Booking
- Payment
- Review

---

# 👥 User Roles

## 👤 Customer

- Register & Login
- Browse Services
- Search Technicians
- Book Services
- Make Payments
- Leave Reviews

---

## 👨‍🔧 Technician

- Create Technician Profile
- Manage Services
- Manage Availability
- Manage Bookings
- Complete Jobs

---

## 👑 Admin

- Manage Users
- Manage Categories
- Manage Services
- Manage Bookings
- Monitor Platform Activities

---

# 🔐 Authentication

The API uses **JWT-based Authentication** with **Role-Based Access Control (RBAC)**.

Protected endpoints accept the Access Token from either:

- **Authorization Header**

```http
Authorization: Bearer <access_token>
```

- **HTTP-Only Cookie**

```http
Cookie: accessToken=<access_token>
```

All protected requests are validated for token authenticity, user status, and role-based permissions.

---

# 📌 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /auth/register |
| POST | /auth/login |
| POST | /auth/refresh-token |
| POST | /auth/logout |

---

## Users

| Method | Endpoint |
|---------|----------|
| GET | /admin/users |
| GET | /admin/users/:id |
| GET | /api/auth/me |
| PATCH | /admin/users/:id |
| DELETE | /admin/users/:id |

---

## Categories

| Method | Endpoint |
|---------|----------|
| POST | /categories |
| GET | /categories |
| GET | /categories/:id |
| PATCH | /categories/:id |
| DELETE | /categories/:id |

---

## Technician

| Method | Endpoint |
|---------|----------|
| POST | /technicians |
| GET | /technicians |
| GET | /technicians/:id |
| PATCH | /technicians/:id |

---

## Services

| Method | Endpoint |
|---------|----------|
| POST | /services |
| GET | /services |
| GET | /services/:id |
| PATCH | /services/:id |
| DELETE | /services/:id |

---

## Availability

| Method | Endpoint |
|---------|----------|
| POST | /availability |
| GET | /availability |
| PATCH | /availability/:id |
| DELETE | /availability/:id |

---

## Bookings

| Method | Endpoint |
|---------|----------|
| POST | /bookings |
| GET | /bookings |
| GET | /bookings/:id |
| PATCH | /bookings/:id |
| DELETE | /bookings/:id |

---

## Reviews

| Method | Endpoint |
|---------|----------|
| POST | /reviews |
| GET | /reviews |
| PATCH | /reviews/:id |
| DELETE | /reviews/:id |

---

# 🔍 Query Features

Most listing APIs support:

### Pagination

```text
?page=1&limit=10
```

### Search

```text
?searchTerm=plumbing
```

### Sorting

```text
?sortBy=createdAt&sortOrder=desc
```

### Filtering

```text
?status=ACTIVE
?role=TECHNICIAN
?category=Electrical
```

---

# ⚙ Getting Started

## Clone Repository

```bash
https://github.com/Md-Sojib-Hossain-cse/FixItNow
```

```bash
cd FixItNow
```

---

## Install Dependencies

```bash
npm install
```

---

## 🔧 Environment Variables

Create a `.env` file in the project root and configure the following variables:

```env
# =========================
# Server Configuration
# =========================
PORT=5000

# =========================
# Database
# =========================
DATABASE_URL=your_postgresql_connection_string

# =========================
# Application URLs
# =========================
APP_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# =========================
# JWT Authentication
# =========================
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

JWT_ACCESS_EXPIRED_IN=7d
JWT_REFRESH_EXPIRED_IN=30d

# =========================
# Password Encryption
# =========================
BCRYPT_SALT_ROUND=10

# =========================
# SSLCommerz Configuration
# =========================
SSL_COMMERZ_STORE_ID=your_store_id
SSL_COMMERZ_STORE_PASSWORD=your_store_password

# =========================
# Payment Callback URLs
# =========================
PAYMENT_SUCCESS_URL=http://localhost:3000/payment/success
PAYMENT_FAIL_URL=http://localhost:3000/payment/fail
PAYMENT_CANCEL_URL=http://localhost:3000/payment/cancel
```

> **Note:** Replace all placeholder values with your own configuration before running the application. Never commit your actual `.env` file to version control. Instead, commit an `.env.example` file containing placeholder values like the ones above.

---

## Generate Prisma Client

```bash
npx prisma generate
```

---

## Run Database Migration

```bash
npx prisma migrate dev
```

---

## Start Development Server

```bash
npm run dev
```

---

# 📦 Build Project

```bash
npm run build
```

---

# ▶ Run Production

```bash
npm start
```

---

# 🧪 Useful Prisma Commands

Generate Prisma Client

```bash
npx prisma generate
```

Create Migration

```bash
npx prisma migrate dev --name init
```

Deploy Migration

```bash
npx prisma migrate deploy
```

Reset Database

```bash
npx prisma migrate reset
```

Open Prisma Studio

```bash
npx prisma studio
```

---

# 📄 API Response Format

All API responses follow a standardized structure for consistency.

---

## ✅ Success Response

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation completed successfully.",
  "data": {}
}
```

### Success Response with Pagination

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Users retrieved successfully.",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 50
  },
  "data": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    }
  ]
}
```

---

## ❌ Error Response

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Something went wrong!",
  "name": "Error",
  "error": "Stack trace..."
}
```

---

## ⚠️ Common Error Responses

| Status Code | Description |
|-------------|-------------|
| **400** | Bad Request / Validation Error |
| **401** | Unauthorized |
| **403** | Forbidden |
| **404** | Resource Not Found |
| **409** | Conflict (Duplicate Resource) |
| **500** | Internal Server Error |

---

## 🔍 Prisma Error Handling

The API gracefully handles common Prisma errors with user-friendly messages.

| Error Code | Description |
|------------|-------------|
| **P2002** | Duplicate key constraint violation |
| **P2003** | Foreign key constraint failed |
| **P2025** | Requested record not found |
| **P1000** | Database authentication failed |
| **P1001** | Unable to connect to the database |
| **Validation Error** | Invalid field or data type supplied |

---

# 👨‍💻 Author

**MD Sojib Hossain**

- Team Lead - Software Engineer (MERN)
- MERN Stack Developer
- Backend Developer
- TypeScript Enthusiast

---

# 📜 License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, don't forget to give it a **Star** on GitHub!
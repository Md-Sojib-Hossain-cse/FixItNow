# 🔧 FixItNow API

A scalable backend REST API for a **Home Service Marketplace** where customers can find skilled technicians, book home services, make payments, and leave reviews. Technicians can manage their services, availability, and bookings, while administrators oversee the entire platform.

Built with **Node.js, Express.js, TypeScript, Prisma ORM, and PostgreSQL** following a modular architecture.

---

# 🚀 Live API

```text
https://fix-it-now-ochre-two.vercel.app
```

---

# ✨ Features

- 🔐 JWT Authentication & Authorization
- 👥 Role-Based Access Control
- 👨‍🔧 Technician Profile Management
- 🛠️ Service Management
- 📅 Availability Scheduling
- 📖 Category Management
- 📦 Booking Management
- 💳 Payment Integration Ready
- ⭐ Review & Rating System
- 🔍 Search, Filter, Pagination & Sorting
- 🗑️ Soft Delete Support
- 🔒 Password Hashing with Bcrypt
- ⚡ Centralized Error Handling
- ✅ Request Validation using Zod
- 📄 RESTful API Design

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js
- TypeScript

## Database

- PostgreSQL
- Prisma ORM

## Authentication

- JWT
- Bcrypt

## Validation

- Zod

## Other Packages

- Cookie Parser
- CORS
- Dotenv
- HTTP Status
- TSX

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

Protected routes require an Access Token.

```http
Authorization: Bearer <access_token>
```

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
| GET | /users |
| GET | /users/:id |
| PATCH | /users/:id |
| DELETE | /users/:id |

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
git clone https://github.com/your-username/fixitnow-api.git
```

```bash
cd fixitnow-api
```

---

## Install Dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file.

```env
DATABASE_URL=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

JWT_ACCESS_EXPIRED_IN=
JWT_REFRESH_EXPIRED_IN=

BCRYPT_SALT_ROUNDS=10

NODE_ENV=development
PORT=5000
```

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

# 📄 Sample Success Response

```json
{
    "success": true,
    "message": "Users retrieved successfully.",
    "meta": {
        "page": 1,
        "limit": 10,
        "total": 25
    },
    "data": []
}
```

---

# ❌ Sample Error Response

```json
{
    "success": false,
    "statusCode": 404,
    "message": "Resource not found."
}
```

---

# 👨‍💻 Author

**MD Sojib Hossain**

- MERN Stack Developer
- Backend Developer
- TypeScript Enthusiast

---

# 📜 License

This project is licensed under the **MIT License**.

---

⭐ If you like this project, don't forget to give it a **Star** on GitHub!
# 🎟️ Digital Coupon Marketplace

> Full-Stack coupon marketplace with secure reseller API, atomic purchases, and server-side pricing logic.

![Node](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express.js-Backend-black)
![TypeScript](https://img.shields.io/badge/TypeScript-4+-blue)
![React](https://img.shields.io/badge/React-Frontend-61dafb)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ed)

---

## 📖 Overview

Digital Coupon Marketplace is a full-stack system that allows selling **digital coupons** through:

- direct customers via a web interface
- external resellers via a secure REST API

The system enforces **server-side pricing rules**, guarantees **atomic purchases**, and prevents coupons from being sold twice.

---

## ✨ Features

### Admin Dashboard

Admin users can manage coupons through full CRUD operations:

- create coupons
- set cost price
- configure margin
- manage availability

### Customer Storefront

Customers can browse and purchase coupons via the frontend application.

Features:

- real-time product listing
- secure purchase flow
- server-calculated pricing

### Reseller API

External partners can integrate using a secure **Bearer Token API**.

Capabilities:

- fetch available coupons
- view product details
- perform purchases programmatically

### Atomic Purchase System

Purchases use **database transactions** to guarantee:

- coupons cannot be sold twice
- concurrent requests are handled safely

### Server-Side Pricing Logic

```text
minimum_sell_price = cost × (1 + margin / 100)
```

This prevents price manipulation by clients or resellers.

---

## 🧰 Tech Stack

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM

### Database

- PostgreSQL

### Frontend

- React
- Vite
- Tailwind CSS
- Lucide Icons

### Infrastructure

- Docker
- Docker Compose

---

## 🏗 Project Structure

```text
.
├── backend/
│   ├── src
│   ├── prisma
│   └── seed.ts
│
├── frontend/
│   ├── src
│   └── components
│
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Prerequisites

Make sure you have installed:

- Node.js v18+
- Docker
- Docker Compose
- npm

---

## 🔧 Environment Setup

Create a `.env` file inside the **backend** directory.

```env
DATABASE_URL="postgresql://user:password@db:5432/marketplace?schema=public"

RESELLER_TOKEN="your_secret_reseller_token"

ADMIN_PASSWORD="your_secure_admin_password"

JWT_SECRET="your_jwt_secret_key"
```

---

## 🚀 Running the Project

### Step 1 — Install dependencies

Backend

```bash
cd backend
npm install
```

Frontend

```bash
cd frontend
npm install
```

---

### Step 2 — Start Docker containers

From the project root:

```bash
docker compose up --build -d
```

---

### Step 3 — Initialize the database

```bash
docker compose exec backend npx prisma migrate dev --name init
docker compose exec backend npx prisma generate
docker compose exec backend npx ts-node src/seed.ts
```

This creates:

- database tables
- admin user
- sample products

---

### Step 4 — Start the frontend

```bash
cd frontend
npm run dev
```

---

## 🌐 Application URLs

Frontend

```text
http://localhost:5173
```

Backend API

```text
http://localhost:3000
```

Prisma Studio

```bash
docker compose exec backend npx prisma studio
```

Then open:

```text
http://localhost:5555
```

---

## 🔑 API Authentication

Reseller API requests must include:

```text
Authorization: Bearer <token>
```

The token is defined in `.env`:

```text
RESELLER_TOKEN
```

---

## 📡 API Endpoints

### Get all products

```http
GET /api/v1/products
```

Returns all **unsold coupons**.

---

### Get product by ID

```http
GET /api/v1/products/:id
```

Returns detailed coupon information.

---

### Purchase product

```http
POST /api/v1/products/:id/purchase
```

Request body:

```json
{
  "reseller_price": 50
}
```

The purchase is executed using a **database transaction**.

---

## 👤 Default Credentials

After running the seed script:

Admin login

```text
Email: admin@example.com
Password: value defined in ADMIN_PASSWORD
```

Reseller authentication

```text
Bearer token: value defined in RESELLER_TOKEN
```

---

## 👩‍💻 Author

Full-stack project demonstrating:

- backend architecture
- REST API design
- authentication
- database transactions
- Dockerized environments
- modern React frontend

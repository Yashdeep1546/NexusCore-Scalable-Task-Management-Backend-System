# 🚀 NexusCore — Scalable Task Management & Backend System

**NexusCore** is a production-ready, full-stack application demonstrating a scalable architecture for a professional **Task Management System**. Built with a focus on **Security**, **Modularity**, and **Performance** using Node.js, Express, PostgreSQL, and React.

---

## 🌟 Key Features

### 🔒 Security & Authentication
- **JWT Authentication**: Secure, stateless user sessions with JSON Web Tokens.
- **Password Hashing**: Industry-standard encryption using `bcryptjs`.
- **Role-Based Access Control (RBAC)**: Granular permissions system distinguishing between **Standard Users** and **Administrators**.
- **Input Validation**: Strict schema-based validation for all API requests using **Zod**.

### 🛠️ Backend Architecture
- **RESTful API Design**: Clean, semantic endpoint structure following REST principles.
- **API Versioning**: Future-proof routing under `/api/v1`.
- **Database Management**: Managed via **Prisma ORM** for type-safe queries and automated migrations.
- **Global Error Handling**: Centralized middleware for consistent and descriptive API error responses.
- **API Documentation**: Automated **Swagger/OpenAPI** documentation.

### 💻 Frontend Experience
- **Modern React**: Built with Vite for ultra-fast development and optimized production builds.
- **State Management**: Robust authentication state handling via React Context API.
- **Premium UI**: Clean, responsive, and minimalist design using Vanilla CSS.

---

## 🏗️ System Architecture & Schema

### Database Schema
The application uses PostgreSQL with the following core entities:
- **User**: `id`, `email`, `password_hash`, `role` (user/admin), `createdAt`
- **Task**: `id`, `title`, `status` (pending/completed), `userId` (relation to User), `createdAt`

*Cascade deletes are configured so that removing a user automatically cleans up their associated tasks.*

---

## 📡 API Endpoints Overview

The API is mounted at `http://localhost:5000/api/v1`. Detailed Swagger documentation is available at `/api-docs`.

| Endpoint | Method | Access | Description |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Public | Register a new user account |
| `/auth/login` | `POST` | Public | Authenticate and receive JWT |
| `/tasks` | `POST` | User | Create a new personal task |
| `/tasks` | `GET` | User | Retrieve all personal tasks |
| `/tasks/:id` | `PUT` | User | Update task status (pending/completed) |
| `/tasks/:id` | `DELETE` | User | Delete a personal task |
| `/users/profile` | `GET` | User | Get current user's profile |
| `/admin/users` | `GET` | Admin | List all registered users |
| `/admin/users/:id` | `DELETE`| Admin | Delete any user (and their tasks) |
| `/admin/tasks` | `GET` | Admin | List all tasks across the system |
| `/admin/tasks/:id` | `DELETE`| Admin | Delete any task in the system |

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Axios, React Router 7 |
| **Backend** | Node.js, Express 5, JWT, Zod, Morgan |
| **Database** | PostgreSQL, Prisma ORM |
| **DevOps** | Docker, Docker Compose |

---

## 🚀 Quick Start

### 📋 Prerequisites
- Node.js (v18+)
- PostgreSQL (Local instance or Docker)

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure your environment:
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://postgres:1234@localhost:5432/postgres?schema=public"
   JWT_SECRET="your_super_secret_key"
   PORT=5000
   NODE_ENV="development"
   ```
4. Sync Database Schema:
   ```bash
   npx prisma db push
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```

---

## 🐳 Docker Deployment

**NexusCore** is fully containerized. To launch the entire stack (Database + Backend + Frontend) with a single command, ensure Docker Desktop is running and execute from the root directory:

```bash
docker-compose up --build
```
*Note: The frontend will be available at `http://localhost:5173` and backend at `http://localhost:5000`.*

---

## 📈 Scalability & Future Growth

This architecture is designed to grow from a MVP to a high-traffic production system:

### 1. Horizontal Scaling (Statelessness)
The API is completely **stateless** thanks to JWT. This allows us to deploy dozens of API instances behind a **Load Balancer** (like Nginx or AWS ELB) without worrying about session persistence.

### 2. Performance Optimization
- **Caching**: Integrate **Redis** to cache frequently accessed data like user profiles or global settings.
- **Read Replicas**: Configure Prisma to route read queries to PostgreSQL replicas, offloading the primary database.

### 3. Microservices Readiness
The modular folder structure (`controllers`, `services`, `routes`) allows for easy extraction of the **Auth** or **Task** modules into independent microservices if the system requirements become specialized.

### 4. Background Processing
For heavy tasks (e.g., email notifications or report generation), we can integrate **RabbitMQ** or **BullMQ** to process tasks asynchronously without blocking the main API thread.

---

## 📑 Interactive API Documentation

Once the backend is running, you can explore, test, and validate all API endpoints via the built-in Swagger UI at:

👉 `http://localhost:5000/api-docs`

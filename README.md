# 🛍️ Specialty Marketplace

A modular, full-stack e-commerce platform designed using Spring Boot (Java) for backend microservices and React with Tailwind CSS for the frontend.

[![React](https://img.shields.io/badge/React-18.2.0-%2361DAFB?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-%236DB33F?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-%23316192?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24.0.7-%232496ED?logo=docker)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-%23000000?logo=jsonwebtokens)](https://jwt.io/)

---
[![Netlify Status](https://api.netlify.com/api/v1/badges/07330990-2978-4619-9ada-133ee40fb75a/deploy-status)](https://app.netlify.com/projects/specalitymarketplace/deploys)


## 🧱 Project Architecture

This project follows a **simplified microservice architecture**:

### 🔐 1. User Service

Handles user authentication, profile management, and JWT-based security.

> Runs on `port 8081`

**Key Modules**:

* `controller`: `AuthController`, `UserController`
* `model`: `User`, `Role`
* `repository`: `UserRepository`
* `service`: `UserService`
* `security`: `JwtUtil`, `WebSecurityConfig`

### 📦 2. Product-Order Service

Manages products, categories, and orders in one cohesive service.

> Runs on `port 8082`

**Key Modules**:

* `controller`: `ProductController`, `CategoryController`, `OrderController`
* `model`: `Product`, `Category`, `Order`, `OrderItem`
* `repository`: `ProductRepository`, `OrderRepository`, etc.
* `service`: `ProductService`, `OrderService`
* `security`: `JwtRequestFilter`

---

## 🖥️ Frontend - React + Tailwind CSS

A responsive and modern UI powered by:

* `React Router` for routing
* `Context API` for auth and cart management
* `Tailwind CSS` for styling
* Protected routes using JWT tokens
* Functional pages: Login, Register, Profile, Cart, Products, Categories, Order Details

> Runs on `port 3000`

---

## ⚙️ Setup & Run

### Prerequisites

* Java 17+
* Node.js + npm
* PostgreSQL
* Maven

### Backend Setup

1. **User Service**

   ```bash
   cd user-service
   mvn spring-boot:run
   ```

2. **Product-Order Service**

   ```bash
   cd product-order-service
   mvn spring-boot:run
   ```

3. PostgreSQL databases:

   * `specialty_users`
   * `specialty_products_orders`

### Frontend Setup

```bash
cd frontend/specialty-marketplace
npm install
npm start
```

---

## 🔑 Sample Configuration

### `user-service/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/specialty_users
jwt.secret=specialty_marketplace_secret_key
```

### `product-order-service/application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/specialty_products_orders
jwt.secret=specialty_marketplace_secret_key
```

---

## 🚧 Development Guidelines

* Use Postman for testing APIs
* JWT token required for protected routes
* Modular services for easy scaling
* Docker support can be added for deployment

---

## 📁 Folder Structure

```bash
Specialty-Marketplace/
├── user-service/
├── product-order-service/
└── frontend/
    └── specialty-marketplace/
        ├── src/
        │   ├── pages/
        │   ├── context/
        │   └── styles/
        ├── tailwind.config.js
        └── postcss.config.js
```

---

## 📌 Features Summary

✅ Secure authentication (JWT)
✅ Product browsing & category filtering
✅ User profile and order history
✅ Cart management with dynamic subtotal
✅ Role-based route protection
✅ Responsive design (mobile-ready)

---

## 📄 License

This project is for educational and personal use. Feel free to extend it as per your needs.

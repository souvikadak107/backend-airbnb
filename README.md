🌍 **Live API (Render):** https://backend-staynight.onrender.com

# StayEase – Backend API

**StayEase Backend** is a RESTful backend service built with **Node.js, Express, and MongoDB (Mongoose)**.  
It provides authentication, property (home) management, and favorites/wishlist APIs for an Airbnb-style application.

This repository contains **backend code only**.

---

## ⭐ Features

### 🔐 Authentication
- User Signup / Login (Email + Password)
- Password hashing using **bcrypt**
- **JWT-based authentication (stateless)**
- Protected routes using authentication middleware
- Input validation using **express-validator**

### 🏠 Home Management
- Create new homes/properties
- Update existing homes
- Delete homes
- Fetch all homes
- Fetch homes by user

### ❤️ Favorites / Wishlist
- Add homes to favorites
- Remove homes from favorites
- Fetch user-specific favorites list

---

## 🧠 Architecture Highlights
- Modular MVC-style structure
- Separation of controllers, services, routes, and middleware
- Centralized error handling
- Environment-based configuration
- Stateless API design (JWT)

---

## 🚀 Deployment
- Deployed on **Render**
- Containerized using **Docker**

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT |
| Validation | express-validator |
| Containerization | Docker |
| Deployment | Render |

---

## 📥 Install Dependencies

npm install

## Run Locally 
npm start

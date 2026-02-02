# backend-airbnb
# 🏡 StayEase-(Node.js + Express + MongoDB)

StayEase is a beginner-friendly Airbnb-style web application built with **Node.js**, **Express**, **MongoDB**, **EJS**, and **TailwindCSS**.  
It allows users to sign up, log in, add homes, edit/delete homes, mark favorites, and browse properties in a clean and responsive UI.

---

## ⭐ Features

### 🔐 Authentication
- User Signup / Login (Email + Password)
- Password hashing using **bcrypt**
- Session-based authentication using **express-session**
- Sessions stored securely using **connect-mongodb-session**

### 🏠 Home Management
- Add new homes/properties
- Edit existing homes
- Delete homes
- View all homes on the homepage

###  Favorites / Wishlist
- Mark homes as favorites
- Remove favorites anytime
- Dedicated "My Favorites" page for each user

### UI & Views
- Built with **EJS** template engine
- Styled using **TailwindCSS**
- Fully responsive design

###  Deployment
- Deployed on **Render**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Template Engine | EJS |
| Database | MongoDB + Mongoose |
| Authentication | express-session + MongoDB store |
| Styling | TailwindCSS |
| Deployment | Render |
| Validation | express-validator |

---

## 📦 Project Structure
 StayEase
├── public/ # Tailwind output, static files
├── views/ # EJS templates
├── routes/ # App routes
├── controllers/ # Controller logic
├── models/ # Mongoose schemas
├── middleware/ # Auth middleware
├── app.js # Main Express app
├── tailwind.config.js
├── package.json
├── .env

## Install Dependecies 
  npm install

## Run 
  npm start
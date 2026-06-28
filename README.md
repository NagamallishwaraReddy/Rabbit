# 🐇 Rabbit E-Commerce Web App

A modern full-stack e-commerce web application built using the MERN stack (MongoDB, Express, React, Node.js). This project provides a smooth shopping experience with product browsing, filtering, cart management, and secure authentication.

🌐 Live Demo: https://rabbit-mm4u.vercel.app/

---

## 🚀 Features

- 🛍️ Product listing with images, price, and details
- 🔍 Product search and filtering by category
- 🛒 Add to cart / remove from cart functionality
- 🔐 User authentication (Login / Register)
- 📦 Checkout flow (order placement)
- 📱 Fully responsive UI (mobile + desktop)
- ⚡ Fast frontend powered by React + Vite
- 🌐 REST API backend using Express & Node.js

---

## 🧰 Tech Stack

### Frontend
- React.js
- Vite
- Redux Toolkit
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- CORS

### Deployment
- Frontend: Vercel
- Backend: Render / API Hosting
- Database: MongoDB Atlas

---

## 📁 Project Structure
rabbit/
│
├── frontend/ # React + Vite client
├── backend/ # Express + Node API
├── models/
├── routes/
├── controllers/
└── README.md

---

## ⚙️ Environment Variables

### Backend `.env`

env
PORT=9000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=https://rabbit-mm4u.vercel.app
Frontend .env
VITE_API_URL=https://your-backend-url.onrender.com/api
🛠️ Installation & Setup (Local)
1. Clone repository
git clone https://github.com/your-username/rabbit.git
cd rabbit
2. Install dependencies
Backend
cd backend
npm install
npm start
Frontend
cd frontend
npm install
npm run dev
📡 API Endpoints
Auth
POST /api/user/register
POST /api/user/login
Products
GET /api/products
GET /api/products/:id
Cart
POST /api/cart
DELETE /api/cart/:id
Orders
POST /api/order
GET /api/order/myorders
🧪 Future Improvements
Payment gateway integration (Stripe / Razorpay)
Admin dashboard
Product reviews & ratings
Wishlist feature
Order tracking system
👨‍💻 Author
Developed by: Malli Reddy
Project Type: Full Stack MERN E-Commerce App
📄 License

This project is for educational purposes only.


---

If you want, I can also:
- make this README more **professional (GitHub portfolio level)**
- add **screenshots section**
- or convert it into a **developer portfolio project card**

Just tell me 👍

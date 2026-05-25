# 🧠 BDA CRM (Business Development Analytics CRM)

A modern full-stack CRM (Customer Relationship Management) and Business Development Management platform designed for manufacturing companies. It helps BDA teams manage leads, track client interactions, assign tasks, and monitor team performance with analytics dashboards.

---

## 🌐 Live Demo

- 🔗 Frontend: https://bds-tan.vercel.app  

- 📂 GitHub: https://github.com/Palak216/BDS  

---

## ✨ Key Features

- 🔐 Secure authentication using JWT  
- 👥 Role-based access (Admin / User)  
- 📊 Lead management system (CRUD + filtering)  
- 📌 Task management with Kanban-style workflow  
- 📈 Team performance analytics dashboard  
- 🔎 Search & filter functionality  
- ⚡ Responsive UI using Tailwind CSS  

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- React Router DOM
- Axios
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- Node.js
- Express.js (MVC Architecture)
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🏗 Project Architecture


Client (React Frontend)
↓ Axios API Calls
Backend (Express Server)
↓
Controllers (Business Logic)
↓
Models (Mongoose Schemas)
↓
MongoDB Database

## 📁 Folder Structure


BDS/
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ └── server.js
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── layouts/
│ └── main.jsx


---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/Palak216/BDS.git
 ```
cd BDS
2. Backend Setup
cd backend
npm install

Create .env file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
NODE_ENV=development

Run backend:

npm start
3. Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs at:
```
http://localhost:5173
```
---
🔐 API Endpoints

Authentication
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

Leads

GET /api/leads
POST /api/leads
PUT /api/leads/:id
DELETE /api/leads/:id

Tasks

GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
DELETE /api/tasks/:id

Team

GET /api/team
GET /api/team/dashboard-stats

---
🔒 Security Features
Password hashing using bcrypt
JWT authentication
Protected routes middleware
Role-based authorization

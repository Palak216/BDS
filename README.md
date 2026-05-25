# BDA CRM Dashboard

A modern, full-stack CRM (Customer Relationship Management) and Business Development Management Dashboard built for manufacturing companies. This platform enables BDA teams to track client interactions, manage sales pipelines, assign actions, monitor Kanban-style tasks, and review individual team member conversions.

---

## Tech Stack
- **Frontend**: React.js (via Vite), React Router DOM, Axios, Tailwind CSS, Lucide React (Icons), Recharts (Analytics charts).
- **Backend**: Node.js, Express.js (MVC architectural pattern).
- **Database**: MongoDB (Mongoose Object Modeling).
- **Authentication**: JSON Web Token (JWT) with password hashing via bcryptjs.

---

## Project Folder Structure

```text
d:\BDS/
├── backend/
│   ├── config/             # DB Connection Config
│   │   └── db.js
│   ├── controllers/        # Business logic controllers
│   │   ├── authController.js
│   │   ├── leadController.js
│   │   ├── taskController.js
│   │   └── teamController.js
│   ├── middleware/         # Auth guards and error handlers
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── Lead.js
│   │   └── Task.js
│   ├── routes/             # Express routes mapping
│   │   ├── authRoutes.js
│   │   ├── leadRoutes.js
│   │   ├── taskRoutes.js
│   │   └── teamRoutes.js
│   ├── .env                # Server configuration variables
│   ├── package.json
│   └── server.js           # Server startup script
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Layout subcomponents
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Navbar.jsx
│   │   ├── layouts/        # Layout wrappers
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/          # Dashboard views
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   ├── Tasks.jsx
│   │   │   └── Team.jsx
│   │   ├── services/       # Service client (Axios api calls)
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── leadService.js
│   │   │   ├── taskService.js
│   │   │   └── teamService.js
│   │   ├── App.jsx         # App router mapping
│   │   ├── index.css       # Tailwind directives
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── index.html
└── README.md
```

---

## Installation & Setup Instructions

### 1. Database Setup
Ensure you have **MongoDB** running locally (`mongodb://127.0.0.1:27017/bda-crm`) or set up a cloud cluster on **MongoDB Atlas**.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Configure the environment variables. The `.env` file should contain:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```
4. Start the backend server in development mode:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Optional: Customize the API base URL by creating a `.env` file in the `frontend` folder:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the frontend Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser and go to `http://localhost:5173`.

---

## API Routes Documentation

### 1. Authentication
* **POST** `/api/auth/register` — Register a new BDA representative. (Note: The first registered user automatically becomes an `Admin`).
* **POST** `/api/auth/login` — Login user, returning JWT token.
* **GET** `/api/auth/me` — Return currently authenticated user profile. (Private)

### 2. Leads Management
* **GET** `/api/leads` — Query all leads. Supports parameters: `?search=`, `?status=`, `?assignedTo=`. (Private)
* **GET** `/api/leads/:id` — Query single lead details. (Private)
* **POST** `/api/leads` — Create a new lead. (Private)
* **PUT** `/api/leads/:id` — Update lead details. Only `Admin` can reassign leads. (Private)
* **DELETE** `/api/leads/:id` — Delete a lead. (Private, `Admin` only)

### 3. Task Board
* **GET** `/api/tasks` — Retrieve all tasks. Supports parameters: `?status=`, `?assignedUser=`. (Private)
* **POST** `/api/tasks` — Create a new task. (Private)
* **PUT** `/api/tasks/:id` — Update task details or move status. Non-admins can only edit tasks assigned to themselves. (Private)
* **DELETE** `/api/tasks/:id` — Delete a task. (Private)

### 4. Team & Analytics
* **GET** `/api/team` — Retrieve list of all team members along with calculated metrics (Leads count, conversion rates, pending tasks count). (Private)
* **GET** `/api/team/dashboard-stats` — Fetch aggregate pipeline summary stats, month-on-month sales performance data, and recent pipeline activities feed. (Private)

---

## Deployment Steps

The application is structured to be fully deployment-ready.

### 1. Deploying the Backend (e.g., Render, Heroku)
1. Set up a Web Service pointing to your Git repository.
2. Specify the root directory as `backend` or adjust your build commands:
   * Build Command: `npm install`
   * Start Command: `npm start`
3. Add the required Environment Variables in the hosting dashboard:
   * `MONGO_URI` (pointing to your MongoDB Atlas cluster)
   * `JWT_SECRET` (a strong random token)
   * `NODE_ENV` (`production`)
   * `PORT` (assigned automatically by the platform, defaults to 5000)

### 2. Deploying the Frontend (e.g., Vercel, Netlify)
1. Configure a static site deployment pointing to your Git repository.
2. Specify the root directory as `frontend` or build settings:
   * Build Command: `npm run build`
   * Output Directory: `dist`
3. Set the Environment Variable:
   * `VITE_API_URL` (pointing to your deployed backend API URL, e.g. `https://your-backend.onrender.com/api`)

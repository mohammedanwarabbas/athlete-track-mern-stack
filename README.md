# 🏃‍♂️ Athlete-Track

An interactive fitness tracker platform that allows athletes to monitor calories, track workouts, visualize performance, and more — all in a sleek, modern dashboard.

Athletes can:
🔹 Register & login securely
🔹 Log daily workouts and training sessions
🔹 View performance analytics in personal dashboard
🔹 Track progress with visual charts

Admin features:
🔹 Manage exercise database
🔹 Monitor all athlete activities
🔹 Generate system reports

---

## 📦 Tech Stack Overview(MERN stack)

> Built with modern full-stack technologies to ensure smooth performance, beautiful visuals, and robust security.

### 💻 Frontend
- ⚛️ **React 19** – Component-based UI
- ⚡ **Vite 7** – Lightning-fast builds
- 🎨 **MUI 7** + **Ant Design 5** – Sleek, accessible UI components
- 📊 **Recharts 3.1** – Beautiful interactive graphs
- 🌀 **Framer Motion** – Smooth animations
- 🧭 **React Router 7** – SPA routing
- 📬 **Axios 1.10** – API communication
- ✍️ **Formik + Yup** – Form handling & validation
- 🔐 **js-cookie** – Token management via cookies

### 🔧 Backend
- 🟢 **Node.js + Express 5** – RESTful API
- 🍃 **MongoDB + Mongoose 8** – NoSQL database
- 🔒 **JWT + bcryptjs** – Authentication
- 🧪 **Validator 13**, **CORS**, **dotenv** – Security & config

---

## 🛠️ Setup Guide

### ✅ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Vite](https://vitejs.dev/)

---

## ⚙️ Getting Started

### 1️⃣ Frontend Setup

```bash
cd athlete-track-frontend
npm install
npm run dev
```

App runs at: http://localhost:5173

#### 🗂️ Frontend .env
VITE_API_BASE_URL=http://localhost:5000


### 2️⃣ Backend Setup

```bash
cd athlete-track-backend
npm install
node server.js
```

API runs at: http://localhost:5000/api

#### 🗂️ Backend .env
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000

# secret key for vercel cron job
CRON_SECRET=your_cron_secret

# for admin seed
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_NAME=Admin

# for exercise seed
EXERCISE_DATA=[
  {"name":"Running (6 mph)","caloriesPerMin":10},
  {"name":"Cycling (moderate)","caloriesPerMin":8}
]
```


## 📁 File Structure

<pre>
.
├── athlete-track-backend
│   ├── config
│   │   └── db.js
│   ├── controllers
│   │   ├── adminController.js
│   │   ├── athleteController.js
│   │   ├── authController.js
│   │   └── demoDataController.js
│   ├── .env
│   ├── middlewares
│   │   └── authMiddleware.js
│   ├── models
│   │   ├── Exercise.js
│   │   ├── User.js
│   │   └── Workout.js
│   ├── package.json
│   ├── package-lock.json
│   ├── routes
│   │   ├── adminRoutes.js
│   │   ├── athleteRoutes.js
│   │   ├── authRoutes.js
│   │   └── demoDataRoutes.js
│   ├── scripts
│   │   ├── seedAdmin.js
│   │   ├── seedExercise.js
│   │   └── seedWorkouts.js
│   ├── server.js
│   └── vercel.json
├── athlete-track-frontend
│   ├── .env
│   ├── eslint.config.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   └── logo.png
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── fonts
│   │   │   ├── images
│   │   │   │   ├── exercising-man-2.jpg
│   │   │   │   ├── exercising-man.jpg
│   │   │   │   ├── logo.png
│   │   │   │   ├
│   │   │   │   ├── undraw_bike-ride.svg
│   │   │   │   ├── woman-doing-yoga.jpg
│   │   │   │   └── women-in-gym.jpeg
│   │   │   ├── react.svg
│   │   │   └── styles
│   │   │       ├── global.css
│   │   │       └── theme.js
│   │   ├── components
│   │   │   ├── auth
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── common
│   │   │   │   ├── ExerciseModal.jsx
│   │   │   │   ├── ExerciseScroller.jsx
│   │   │   │   ├── Testimonials.jsx
│   │   │   │   └── WorkoutModal.jsx
│   │   │   ├── layout
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   └── ui
│   │   │       └── Loader.jsx
│   │   ├── config.js
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── admin
│   │       │   ├── AthleteList.jsx
│   │       │   ├── Dashboard.jsx
│   │       │   ├── ExerciseList.jsx
│   │       │   └── WorkoutHistory.jsx
│   │       ├── athlete
│   │       │   ├── AddWorkout.jsx
│   │       │   ├── Dashboard.jsx
│   │       │   └── WorkoutHistory.jsx
│   │       ├── auth
│   │       │   ├── Login.jsx
│   │       │   ├── Register.jsx
│   │       │   └── UpdateProfile.jsx
│   │       ├── common
│   │       │   ├── NotFound.jsx
│   │       │   └── Unauthorized.jsx
│   │       └── core
│   │           ├── About.jsx
│   │           └── Home.jsx
│   └── vite.config.js
├── .gitignore
└── README.md
</pre>


## ✨ Features
✅ JWT-Based Auth
📊 Workout Stats Dashboard
📆 Timeframe Filters (Today, Week, Month, Year)
🔥 Top Calorie Burners
⏱️ Total Duration & Exercise Breakdown
🧠 Framer Motion Animations
🔄 Reusable Stat Cards and Charts
📱 Responsive UI for All Devices
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./assets/styles/global.css";
// pages
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
// public pages
import Home from "./pages/core/Home";
import About from "./pages/core/About";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// admin and athlete protected routes
import UpdateProfile from "./pages/auth/UpdateProfile";
// athlete pages
import AthleteDashboard from "./pages/athlete/Dashboard";
import AthleteWorkoutHistory from "./pages/athlete/WorkoutHistory";
import AddWorkout from "./pages/athlete/AddWorkout";
// admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminWorkoutHistory from "./pages/admin/WorkoutHistory";
import AthleteList from "./pages/admin/AthleteList";
import ExerciseList from "./pages/admin/ExerciseList";
// protected route component
import ProtectedRoute from "./components/auth/ProtectedRoute";
//common pages
import Unauthorized from "./pages/common/Unauthorized";
import NotFound from "./pages/common/NotFound";
import { ToastContainer } from "react-toastify";
import { useAuth } from "./context/AuthContext";

function App() {
  const { user } = useAuth();
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <Routes>
          {/* public routes */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/athlete/dashboard" replace />
                )
              ) : (
                <Home />
              )
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Athlete - protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["athlete"]} />}>
            <Route path="/athlete/dashboard" element={<AthleteDashboard />} />
            <Route
              path="/athlete/workout-history"
              element={<AthleteWorkoutHistory />}
            />
            <Route path="/athlete/add-workout" element={<AddWorkout />} />
          </Route>

          {/* Admin - protected routes */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/workout-history"
              element={<AdminWorkoutHistory />}
            />
            <Route path="/admin/athlete-list" element={<AthleteList />} />
            <Route path="/admin/exercise-list" element={<ExerciseList />} />
          </Route>

          {/* Admin ang Athlete protected routes */}
          <Route
            element={<ProtectedRoute allowedRoles={["admin", "athlete"]} />}
          >
            <Route path="/auth/profile" element={<UpdateProfile />} />
          </Route>

          {/* catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        <Footer />
      </div>
    </Router>
  );
}

export default App;

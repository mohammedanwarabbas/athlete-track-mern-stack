// description: A component to protect routes based on user authentication and role.
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />; // No user = redirect to login
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />; // Wrong role = 403
  }

  return <Outlet />; // Authorized = render child routes
};

export default ProtectedRoute;
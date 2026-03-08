import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // Get user from localStorage (set during your login call)
  const user = JSON.parse(localStorage.getItem("user"));

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to='/' replace />;
  }

  // 2. Optional: Check for Role-Based Access Control (RBAC)
  // If allowedRoles is provided, check if the user's role matches
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  // 3. If authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;

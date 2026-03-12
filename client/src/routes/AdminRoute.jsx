import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return <Navigate to='/' replace />;

  const role = user.role?.trim().toUpperCase();
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";

  return isAdmin ? children : <Navigate to='/dashboard/home' replace />;
};

export default AdminRoute;

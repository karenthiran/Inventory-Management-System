import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardLayout from "../components/layout/DashboardLayout";

// Dashboard Pages
import Home from "../pages/dashboard/Home";
import Inventory from "../pages/dashboard/Inventory";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard Layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        {/* Default Page */}
        <Route index element={<Home />} />

        <Route path="inventory" element={<Inventory />} />
      </Route>

      {/* Optional Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

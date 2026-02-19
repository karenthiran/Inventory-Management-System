import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/auth/Login";
import DashboardLayout from "../components/layout/DashboardLayout";

// Dashboard Pages
import Home from "../pages/dashboard/Home";
import Inventory from "../pages/dashboard/Inventory";
// import Categories from "../pages/dashboard/Categories";

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
        {/* <Route path="categories" element={<Categories />} /> */}
      </Route>

      {/* Optional Redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;

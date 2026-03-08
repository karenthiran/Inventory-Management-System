import { Route, Routes } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import ForgotPassword from "../pages/ForgotPassword";
import Home from "../pages/Home";
import InventoryItem from "../pages/InventoryItem";
import Issue from "../pages/Issue";
import Login from "../pages/Login";
import Maintenance from "../pages/Maintenance";
import Report from "../pages/Report";
import Return from "../pages/Return";
import Setting from "../pages/Settings";
import Userprofile from "../pages/UserProfile";
import EmailPage from "../pages/Email";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Dashboard Layout */}
      {/* <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="inventory" element={<InventoryItem />} />
        <Route path="issue" element={<Issue />} />
        <Route path="return" element={<Return />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="report" element={<Report />} />
        <Route path="setting" element={<Setting />} />
        <Route path="userprofile" element={<Userprofile />} />
        <Route path="email" element={<EmailPage />} /> */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} /> {/* ✅ FIXED */}
          <Route path="inventory" element={<InventoryItem />} />
          <Route path="issue" element={<Issue />} />
          <Route path="return" element={<Return />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="report" element={<Report />} />
          <Route path="setting" element={<Setting />} />
          <Route path="userprofile" element={<Userprofile />} />
          <Route path="email" element={<EmailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

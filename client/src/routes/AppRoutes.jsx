import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />} />
    </Routes>
  );
};

export default AppRoutes;

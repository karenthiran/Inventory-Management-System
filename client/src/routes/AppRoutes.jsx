import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/Home";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

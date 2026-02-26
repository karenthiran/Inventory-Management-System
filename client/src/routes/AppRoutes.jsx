import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/Home";
import InventoryItem from "../pages/InventoryItem";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="inventory" element={<InventoryItem />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

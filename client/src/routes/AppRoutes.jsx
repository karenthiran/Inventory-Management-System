import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/Home";
import InventoryItem from "../pages/InventoryItem";
import Issue from "../pages/Issue";
import Return from "../pages/Return";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="inventory" element={<InventoryItem />} />
        <Route path="issue" element={<Issue />} />
        <Route path="return" element={<Return />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

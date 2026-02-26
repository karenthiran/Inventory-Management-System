import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Home from "../pages/Home";
import InventoryItem from "../pages/InventoryItem";
import Issue from "../pages/Issue";
import Return from "../pages/Return";
import Maintenance from "../pages/Maintenance";
import Report from "../pages/Report";
import Setting from "../pages/Settings";
import Userprofile from "../pages/UserProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Home />} />
        <Route path="home" element={<Home />} />
        <Route path="inventory" element={<InventoryItem />} />
        <Route path="issue" element={<Issue />} />
        <Route path="return" element={<Return />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="report" element={<Report />} />
        <Route path="setting" element={<Setting />} />
        <Route path="userprofile" element={<Userprofile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

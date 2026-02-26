import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopNavbar from "../common/TopNavbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNavbar />

        {/* This is where page content changes */}
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

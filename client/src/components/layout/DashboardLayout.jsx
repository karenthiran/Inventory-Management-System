import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopNavbar from "../common/TopNavbar";

const DashboardLayout = () => {
  return (
    <div className="bg-gray-100">
      <Sidebar />

      {/* Main Content Area */}
      <div className="ml-64 flex flex-col min-h-screen">
        <TopNavbar />

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;

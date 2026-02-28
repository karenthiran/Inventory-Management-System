// import { Outlet } from "react-router-dom";
// import Sidebar from "../common/Sidebar";
// import TopNavbar from "../common/TopNavbar";

// const DashboardLayout = () => {
//   return (
//     <div className="bg-gray-100">
//       {/* Fixed Sidebar */}
//       <Sidebar />

//       {/* Fixed Topbar */}
//       <TopNavbar />

//       {/* Main Content */}
//       <div className="ml-64 mt-16 p-8 min-h-screen overflow-y-auto">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;

import { Outlet } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import TopNavbar from "../common/TopNavbar";

const DashboardLayout = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Fixed Topbar */}
      <TopNavbar />

      {/* Main Content */}
      <div className="ml-64 mt-16 p-8 min-h-screen overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

// import { Bell, LogOut, Search } from "lucide-react";
// import { useLocation, useNavigate } from "react-router-dom";
// import ThemeToggle from "./ThemeToggle";

// const Topbar = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const routeTitles = {
//     "/home": "Home",
//     "/inventory": "Inventory Item",
//     "/issue": "Issue",
//     "/return": "Return",
//     "/maintenance": "Maintenance",
//     "/report": "Reports",
//     "/setting": "Settings",
//     "/userprofile": "User Profile",
//   };

//   const title = routeTitles[location.pathname] || "Dashboard";

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // remove token if stored
//     localStorage.removeItem("user"); // remove user data if stored
//     navigate("/"); // redirect to Login page
//   };

//   return (
//     <div
//       className="fixed top-0 left-64 right-0 h-16
//                     bg-gray-100 dark:bg-gray-800
//                     px-8 flex items-center justify-between
//                     border-b border-gray-300 dark:border-gray-700
//                     z-40"
//     >
//       {/* Dynamic Title */}
//       <h1
//         className="text-2xl font-semibold
//                      text-indigo-600 dark:text-white"
//       >
//         {title}
//       </h1>

//       {/* Right Section */}
//       <div className="flex items-center gap-6">
//         {/* Search Bar */}
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2
//                        text-gray-400 dark:text-gray-300"
//           />
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-72 bg-gray-100 dark:bg-gray-700
//                        rounded-lg py-2 pl-10 pr-4 text-sm
//                        text-black dark:text-white
//                        outline outline-gray-300 dark:outline-gray-600
//                        focus:ring-2 focus:ring-indigo-300"
//           />
//         </div>

//         <Bell size={20} className="text-indigo-500 cursor-pointer" />

//         {/*  Theme Toggle Here */}
//         <ThemeToggle />
//         {/* ✅ Logout Click */}
//         <LogOut
//           size={20}
//           className="text-red-500 cursor-pointer"
//           onClick={handleLogout}
//         />
//       </div>
//     </div>
//   );
// };

// export default Topbar;

import { Bell, LogOut, Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeTitles = {
    "/dashboard/home": "Home",
    "/dashboard/inventory": "Inventory Item",
    "/dashboard/issue": "Issue",
    "/dashboard/return": "Return",
    "/dashboard/maintenance": "Maintenance",
    "/dashboard/report": "Reports",
    "/dashboard/setting": "Settings",
    "/dashboard/userprofile": "User Profile",
    "/dashboard/notification": "Notifications",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const openNotifications = () => {
    navigate("/dashboard/notification");
  };

  return (
    <div
      className="fixed top-0 left-64 right-0 h-16 
                    bg-gray-100 dark:bg-gray-800 
                    px-8 flex items-center justify-between 
                    border-b border-gray-300 dark:border-gray-700 
                    z-40"
    >
      {/* Dynamic Title */}
      <h1 className="text-2xl font-semibold text-indigo-600 dark:text-white">
        {title}
      </h1>

      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-72 bg-gray-100 dark:bg-gray-700 
                       rounded-lg py-2 pl-10 pr-4 text-sm 
                       text-black dark:text-white
                       outline outline-gray-300 dark:outline-gray-600
                       focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        {/* 🔔 Notification */}
        <Bell
          size={20}
          className="text-indigo-500 cursor-pointer hover:scale-110 transition"
          onClick={openNotifications}
        />

        {/* Theme */}
        <ThemeToggle />

        {/* Logout */}
        <LogOut
          size={20}
          className="text-red-500 cursor-pointer"
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default Topbar;

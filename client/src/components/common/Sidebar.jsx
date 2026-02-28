import { NavLink } from "react-router-dom";
import logo from "../../assets/Images/logoIMS2.png";
import {
  Box,
  ArrowRight,
  ArrowLeft,
  Wrench,
  FileText,
  Settings,
  HomeIcon,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: HomeIcon, path: "/home" },
    { name: "Inventory Item", icon: Box, path: "/inventory" },
    { name: "Issue", icon: ArrowRight, path: "/issue" },
    { name: "Return", icon: ArrowLeft, path: "/return" },
    { name: "Maintenance", icon: Wrench, path: "/maintenance" },
    { name: "Report", icon: FileText, path: "/report" },
    { name: "Setting", icon: Settings, path: "/setting" },
  ];

  return (
    <div
      className="fixed top-0 left-0 w-64 h-screen 
      bg-gray-100 dark:bg-gray-900 
      px-6 pb-4 flex flex-col 
      border-r border-gray-300 dark:border-gray-700 
      transition-colors duration-300"
    >
      {/* Logo Section */}
      <div
        className="flex flex-col items-center pt-2 pb-6 
        border-b border-gray-300 dark:border-gray-700"
      >
        <img src={logo} alt="IMS Logo" className="h-15 object-contain" />

        <p className="text-center text-gray-600 dark:text-gray-300 text-[10px] font-medium whitespace-nowrap">
          University of Jaffna, Faculty of Engineering
        </p>
      </div>

      {/* Navigation Section */}
      <div className="space-y-2 mt-6 flex-1">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-base font-medium">{name}</span>
          </NavLink>
        ))}
      </div>

      {/* User Profile Section */}
      <NavLink
        to="/userprofile"
        className={({ isActive }) =>
          `flex items-center border gap-4 px-2 py-1.5 rounded-2xl transition-all duration-300 ${
            isActive
              ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
              : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
          }`
        }
      >
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-base font-medium truncate">
          user@eng.jfn.ac.lk
        </span>
      </NavLink>
    </div>
  );
};

export default Sidebar;

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
    <div className="w-64 min-h-screen bg-gray-100 px-6 pb-6">
      {/* Logo Section */}
      <div className="flex justify-center pb-6 border-b border-gray-200">
        <img src={logo} alt="IMS Logo" className="h-20 object-contain" />
      </div>

      {/* Navigation Section */}
      <div className="space-y-2 mt-6">
        {menuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-200"
              }`
            }
          >
            <Icon size={20} />
            <span className="text-base font-medium">{name}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

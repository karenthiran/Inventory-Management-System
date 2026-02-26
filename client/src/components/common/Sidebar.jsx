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
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      {/* logo */}
      <div className="  flex justify-center">
        <img src={logo} alt="IMS Logo" className="h-50 object-contain" />
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={index}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300
                ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`
              }
            >
              <Icon size={20} />
              <span className="text-base font-medium">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;

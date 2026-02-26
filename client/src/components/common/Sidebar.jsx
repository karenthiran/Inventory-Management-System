import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  Box,
  FolderKanban,
  ArrowRight,
  ArrowLeft,
  Wrench,
  Users,
  Settings,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { name: "Home", icon: LayoutGrid, path: "/dashboard" },
    { name: "Inventory Item", icon: Box, path: "/dashboard/inventory" },
    { name: "Categories", icon: FolderKanban },
    { name: "Issue", icon: ArrowRight },
    { name: "Return", icon: ArrowLeft },
    { name: "Maintenance", icon: Wrench },
    { name: "User", icon: Users },
    { name: "Setting", icon: Settings },
  ];

  return (
    <div className="w-64 min-h-screen bg-gray-100 p-6">
      <h2 className="text-gray-700 text-lg font-medium mb-8">Navigation Bar</h2>

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

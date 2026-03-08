import axios from "axios";
import {
  ArrowLeft,
  ArrowRight,
  Box,
  FileText,
  HomeIcon,
  Settings,
  Wrench,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import logoLight from "../../assets/Images/logoIMS2.png";
import logoDark from "../../assets/Images/logoIMS21Darkmode.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Sidebar = () => {
  const [userName, setUserName] = useState("Loading...");

  const userRole = localStorage.getItem("role");
  const storedUsername = localStorage.getItem("username");

  useEffect(() => {
    if (storedUsername) {
      axios
        .get(`${API_BASE_URL}/api/users/profile/${storedUsername}`)
        .then((response) => {
          setUserName(response.data.username);
        })
        .catch((err) => {
          console.error("Sidebar fetch error:", err);
          setUserName("User Profile");
        });
    }
  }, [storedUsername]);

  const menuItems = [
    { name: "Home", icon: HomeIcon, path: "/dashboard/home" },
    { name: "Inventory Item", icon: Box, path: "/dashboard/inventory" },
    { name: "Issue", icon: ArrowRight, path: "/dashboard/issue" },
    { name: "Return", icon: ArrowLeft, path: "/dashboard/return" },
    {
      name: "Maintenance",
      icon: Wrench,
      path: "/dashboard/maintenance",
      adminOnly: true,
    },
    {
      name: "Report",
      icon: FileText,
      path: "/dashboard/report",
      adminOnly: true,
    },
    {
      name: "Setting",
      icon: Settings,
      path: "/dashboard/setting",
      adminOnly: true,
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.adminOnly) return true;
    if (!userRole) return false;

    const normalizedRole = userRole.trim().toUpperCase();
    // Validates against your Java Model roles
    return normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN";
  });

  return (
    <div className='fixed top-0 left-0 w-64 h-screen bg-gray-100 dark:bg-gray-900 px-6 pb-4 flex flex-col border-r border-gray-300 dark:border-gray-700 transition-colors duration-300'>
      <div className='flex flex-col items-center pt-2 pb-6 border-b border-gray-300 dark:border-gray-700'>
        <img
          src={logoLight}
          alt='IMS Logo'
          className='h-15 object-contain block dark:hidden'
        />
        <img
          src={logoDark}
          alt='IMS Logo Dark'
          className='h-15 object-contain hidden dark:block'
        />
        <p className='text-center text-gray-600 dark:text-gray-300 text-[10px] font-medium whitespace-nowrap'>
          University of Jaffna, Faculty of Engineering
        </p>
      </div>

      <div className='space-y-2 mt-6 flex-1'>
        {filteredMenuItems.map(({ name, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-2xl transition-all duration-300 ${
                isActive
                  ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={20} />
            <span className='text-base font-medium'>{name}</span>
          </NavLink>
        ))}
      </div>

      <div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
        <NavLink
          to='/dashboard/userprofile'
          className={({ isActive }) =>
            `flex items-center border gap-4 px-2 py-1.5 rounded-2xl transition-all duration-300 ${
              isActive
                ? "bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                : "text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`
          }
        >
          <div className='w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0'>
            {userName !== "Loading..." ? userName.charAt(0).toUpperCase() : "?"}
          </div>
          <span className='text-sm font-medium truncate'>{userName}</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;

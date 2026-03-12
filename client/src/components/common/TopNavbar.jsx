import { LogOut, Mail, Search } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Email from "../../pages/Email";
import ThemeToggle from "./ThemeToggle";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  const routeTitles = {
    "/dashboard/home": "Home",
    "/dashboard/inventory": "Inventory Item",
    "/dashboard/issue": "Issue",
    "/dashboard/return": "Return",
    "/dashboard/maintenance": "Maintenance",
    "/dashboard/report": "Reports",
    "/dashboard/setting": "Settings",
    "/dashboard/userprofile": "User Profile",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className='fixed top-0 left-64 right-0 h-16 bg-gray-100 dark:bg-gray-900 px-8 flex items-center justify-between border-b border-gray-300 dark:border-gray-700 z-40'>
        <h1 className='text-2xl font-semibold text-indigo-600 dark:text-white'>
          {title}
        </h1>
        <div className='flex items-center gap-6'>
          <div className='relative'>
            <Search
              size={18}
              className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
            <input
              type='text'
              placeholder='Search...'
              className='w-72 bg-gray-200 dark:bg-gray-800 rounded-lg py-2 pl-10 pr-4 text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-400'
            />
          </div>
          <button onClick={() => setIsEmailOpen(true)} className='relative'>
            <Mail
              size={20}
              className='text-indigo-500 hover:scale-110 transition cursor-pointer'
            />
          </button>
          <ThemeToggle />
          <LogOut
            size={20}
            className='text-red-500 cursor-pointer hover:scale-110 transition'
            onClick={handleLogout}
          />
        </div>
      </div>

      <Email isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
    </>
  );
};

export default Topbar;

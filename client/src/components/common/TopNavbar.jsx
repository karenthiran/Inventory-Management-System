import { Bell, Moon, LogOut, Search } from "lucide-react";
import { useLocation } from "react-router-dom";

const Topbar = () => {
  const location = useLocation();

  const routeTitles = {
    "/home": "Home",
    "/inventory": "Inventory Item",
    "/issue": "Issue Item",
    "/return": "Return Item",
    "/maintenance": "Maintenance",
    "/report": "Reports",
    "/setting": "Settings",
    "/userprofile": "User Profile",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  return (
    <div className="fixed top-0 left-64 right-0 h-16 bg-gray-100 px-8 flex items-center justify-between border-b border-gray-300 z-40">
      {/* Dynamic Title */}
      <h1 className="text-2xl font-semibold text-indigo-600">{title}</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="w-72 bg-gray-100 rounded-lg py-2 pl-10 pr-4 text-sm outline outline-1 outline-gray-300 focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <Bell size={20} className="text-indigo-500 cursor-pointer" />
        <Moon size={20} className="text-black cursor-pointer" />
        <LogOut size={20} className="text-red-500 cursor-pointer" />
      </div>
    </div>
  );
};

export default Topbar;

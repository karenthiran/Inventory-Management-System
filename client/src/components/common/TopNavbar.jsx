import { Bell, Search } from "lucide-react";

const TopNavbar = () => {
  return (
    <div
      className="h-16 px-8 flex items-center justify-between 
                    bg-gray-100 border-b border-gray-200"
    >
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-semibold text-gray-700">Dashboard</h1>

        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-64 rounded-xl 
                       bg-white shadow-sm 
                       focus:outline-none 
                       focus:ring-2 
                       focus:ring-indigo-500 
                       text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notification */}
        <div className="relative cursor-pointer p-2 rounded-xl hover:bg-white transition">
          <Bell size={22} className="text-gray-600" />
          <span
            className="absolute top-1 right-1 
           bg-red-500
           text-white text-xs w-4 h-4 
           flex items-center justify-center rounded-full"
          >
            3
          </span>
        </div>

        {/* User Profile */}
        <div
          className="flex items-center gap-3 cursor-pointer 
                        hover:bg-white px-3 py-2 rounded-xl transition"
        >
          <div
            className="w-9 h-9 rounded-full 
                          bg-gradient-to-r from-indigo-500 to-purple-500 
                          text-white flex items-center justify-center 
                          font-semibold shadow-md"
          >
            A
          </div>

          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">Anton</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;

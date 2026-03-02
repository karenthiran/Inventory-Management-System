import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, MapPin, UserCircle } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">

      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold mb-10">Settings</h1>

      {/* NAVIGATION BUTTONS */}
      <div className="flex gap-8 flex-wrap">

        {/* CATEGORY */}
        <button
          onClick={() => navigate("/dashboard/category")}
          className="flex items-center gap-4 px-12 py-6
          border-2 border-blue-400
          rounded-2xl
          bg-white dark:bg-gray-800
          hover:bg-blue-50 dark:hover:bg-gray-700
          transition duration-200"
        >
          <BookOpen size={26} />
          <span className="text-lg font-semibold">Category</span>
        </button>

        {/* LOCATION */}
        <button
          onClick={() => navigate("/dashboard/location")}
          className="flex items-center gap-4 px-12 py-6
          border-2 border-blue-400
          rounded-2xl
          bg-white dark:bg-gray-800
          hover:bg-blue-50 dark:hover:bg-gray-700
          transition duration-200"
        >
          <MapPin size={26} />
          <span className="text-lg font-semibold">Location</span>
        </button>

        {/* USER MANAGEMENT */}
        <button
          onClick={() => navigate("/dashboard/usermanagement")}
          className="flex items-center gap-4 px-12 py-6
          border-2 border-blue-400
          rounded-2xl
          bg-white dark:bg-gray-800
          hover:bg-blue-50 dark:hover:bg-gray-700
          transition duration-200"
        >
          <UserCircle size={26} />
          <span className="text-lg font-semibold">User Management</span>
        </button>

      </div>
    </div>
  );
};

export default Settings;
import { LucideBookOpen, MapPinnedIcon, Tag, UserCircle } from "lucide-react";
import { useState } from "react";

import CategorySettings from "../components/layout/settings/CategorySettings";
import ItemTypeSettings from "../components/layout/settings/ItemTypeSettings";
import LocationSettings from "../components/layout/settings/LocationSettings";
import UserSettings from "../components/layout/settings/UserSettings";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("category");
  const userRole = localStorage.getItem("role");

  const tabBtn = (tab) =>
    `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
    ${
      activeTab === tab
        ? "bg-indigo-600 text-white shadow"
        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700"
    }`;

  return (
    <div className='min-h-screen bg-gray-100 dark:bg-gray-900 text-slate-800 dark:text-white transition-colors duration-300 px-6 py-10 lg:px-20'>
      {/* Toggle Buttons */}
      <div className='flex flex-wrap gap-4 justify-center mb-10'>
        <button
          onClick={() => setActiveTab("category")}
          className={tabBtn("category")}
        >
          <LucideBookOpen size={18} /> Category
        </button>

        <button
          onClick={() => setActiveTab("location")}
          className={tabBtn("location")}
        >
          <MapPinnedIcon size={18} /> Location
        </button>

        <button
          onClick={() => setActiveTab("itemType")}
          className={tabBtn("itemType")}
        >
          <Tag size={18} /> Item Type
        </button>

        {userRole == "SUPER_ADMIN" && (
          <button
            onClick={() => setActiveTab("user")}
            className={tabBtn("user")}
          >
            <UserCircle size={18} /> Users
          </button>
        )}
      </div>

      {/* Content Card */}
      <div className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-6 transition-all'>
        {activeTab === "category" && <CategorySettings />}
        {activeTab === "location" && <LocationSettings />}
        {activeTab === "itemType" && <ItemTypeSettings />}
        {activeTab === "user" && <UserSettings />}
      </div>
    </div>
  );
};

export default Settings;

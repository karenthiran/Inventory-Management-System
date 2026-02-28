import React from "react";
import DashboardCard from "../components/common/DashboardCard";

import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Wrench,
  LayoutGrid,
} from "lucide-react";

const Maintenance = () => {
  const cardData = [
    {
      title: "Total Damaged Items",
      value: 234,
      subtitle: "All reported damaged inventory",
      icon: <AlertTriangle size={18} />,
      gradient: "from-orange-500 to-amber-600",
    },
    {
      title: "Partially Damaged",
      value: 125,
      subtitle: "Can be repaired or reused",
      icon: <AlertCircle size={18} />,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      title: "Fully Damaged",
      value: 87,
      subtitle: "Not usable – replacement required",
      icon: <XCircle size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
    {
      title: "Submitted for Repair",
      value: 22,
      subtitle: "Currently under maintenance",
      icon: <Wrench size={18} />,
      gradient: "from-blue-600 to-indigo-700",
    },
  ];

  return (
    <div
      className="px-6 py-4 
    bg-gray-100 dark:bg-gray-900 
    min-h-screen transition-colors duration-300"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
          <LayoutGrid
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <h1
          className="text-xl font-semibold 
        text-gray-800 dark:text-gray-200"
        >
          Overview
        </h1>
      </div>

      {/* Cards */}
      <div
        className="max-w-7xl mx-auto 
      grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 
      gap-8 mb-12"
      >
        {cardData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default Maintenance;

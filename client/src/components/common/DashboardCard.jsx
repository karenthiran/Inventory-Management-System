import React from "react";

const DashboardCard = ({
  title = "Total Items",
  value = "0",
  subtitle = "Total inventory item",
  icon,
  gradient = "from-indigo-500 to-purple-600",
}) => {
  return (
    <div
      className={`relative w-64 h-40 rounded-xl px-5 py-4 text-white 
      bg-gradient-to-br ${gradient} shadow-lg 
      transition-transform duration-300 hover:scale-105`}
    >
      {/* Top Section */}
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-white/20 p-2 rounded-md">{icon}</div>
        <h3 className="text-sm font-medium opacity-90">{title}</h3>
      </div>

      {/* Main Value (More Dominant) */}
      <h1 className="text-5xl font-extrabold leading-none text-center">
        {value}
      </h1>

      {/* Subtitle */}
      <p className="text-xs text-center mt-1 opacity-80">{subtitle}</p>
    </div>
  );
};

export default DashboardCard;

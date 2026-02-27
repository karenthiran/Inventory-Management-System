import React from "react";
import { ArrowRight, FileCheck, Package, LayoutGrid } from "lucide-react";
import DashboardCard from "../components/common/DashboardCard";

const cardData = [
  {
    title: "Total Items",
    value: "359",
    subtitle: "Total inventory items",
    icon: <Package size={20} />,
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    title: "Issued Items",
    value: "359",
    subtitle: "Currently in use",
    icon: <ArrowRight size={20} />,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Available Items",
    value: "345",
    subtitle: "Ready to issue",
    icon: <FileCheck size={20} />,
    gradient: "from-emerald-500 to-green-600",
  },
];

const Home = () => {
  return (
    <div className="p-0">
      {/* 🔹 Top Left Header Section */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <LayoutGrid className="text-indigo-600" size={22} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
      </div>

      {/* 🔹 Cards Section */}
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

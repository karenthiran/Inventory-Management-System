import React from "react";
import { ArrowRight, FileCheck, Package } from "lucide-react";
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
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <DashboardCard key={index} {...card} />
      ))}
    </div>
  );
};

export default Home;

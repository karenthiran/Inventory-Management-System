import React from "react";
import { Package } from "lucide-react";
import DashboardCard from "../components/common/DashboardCard";

const Home = () => {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard
        title="Total Items"
        value="359"
        subtitle="Total inventory item"
        icon={<Package size={20} />}
        gradient="from-indigo-500 to-blue-600"
      />
    </div>
  );
};

export default Home;

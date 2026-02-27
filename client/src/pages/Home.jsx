import React from "react";
import {
  ArrowRight,
  FileCheck,
  Package,
  LayoutGrid,
  CalendarClock,
  AlertTriangle,
} from "lucide-react";

import DashboardCard from "../components/common/DashboardCard";
import HomeDataTable from "../components/layout/Home/HomeDataTable";

/* =========================================================
   📊 Dashboard Cards Data
========================================================= */
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

/* Table Configuration */
const columns = [
  { header: "Item Id", accessor: "itemId" },
  { header: "Item Name", accessor: "itemName" },
  { header: "User Name", accessor: "userName" },
  { header: "Due Date", accessor: "dueDate" },
];

/*  Due Soon Data */
const dueSoonItems = [
  {
    itemId: "UOJPC001",
    itemName: "PC",
    userName: "A.Croos",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC002",
    itemName: "Laptop",
    userName: "K.Karen",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC003",
    itemName: "Desktop",
    userName: "T.Shaki",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC004",
    itemName: "Mouse",
    userName: "L.Lakshmi",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC005",
    itemName: "Table",
    userName: "J.Vithu",
    dueDate: "5/8/2025",
  },
];

/*  Overdue Data */
const overDueItems = [
  {
    itemId: "UOJPC001",
    itemName: "PC",
    userName: "A.Croos",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC002",
    itemName: "Laptop",
    userName: "A.Velmurugan",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC003",
    itemName: "Desktop",
    userName: "K.Karen",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC004",
    itemName: "Mouse",
    userName: "T.Shaki",
    dueDate: "5/8/2025",
  },
  {
    itemId: "UOJPC005",
    itemName: "Table",
    userName: "L.Lakshmi",
    dueDate: "5/8/2025",
  },
];

/* =================Home Component================== */
const Home = () => {
  return (
    <div className="px-6 py-4">
      {/* ================= Header ================= */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <LayoutGrid size={22} className="text-indigo-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
      </div>

      {/* ================= Cards Section ================= */}
      <section className="flex justify-center mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* ================= Tables Section ================= */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 🔹 Due Soon */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <CalendarClock size={18} className="text-indigo-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Due Soon</h2>
            </div>

            <HomeDataTable columns={columns} data={dueSoonItems} />
          </div>

          {/* 🔹 Overdue */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-red-100 p-2 rounded-lg">
                <AlertTriangle size={18} className="text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Overdue</h2>
            </div>

            <HomeDataTable columns={columns} data={overDueItems} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

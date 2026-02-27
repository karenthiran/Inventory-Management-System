import React from "react";
import DashboardCard from "../components/common/DashboardCard";
import InventoryTable from "../components/layout/inventory/InventoryTable";
import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Wrench,
  LayoutGrid,
} from "lucide-react";

const InventoryItem = () => {
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

  const tableColumns = [
    { header: "NO.", accessor: "no" },
    { header: "Item Number", accessor: "itemNumber" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Category", accessor: "category" },
    { header: "Location", accessor: "location" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "View",
      render: () => (
        <button className="text-indigo-600 font-medium hover:underline">
          Detail
        </button>
      ),
    },
  ];

  const tableData = [
    {
      no: "01",
      itemNumber: "228-3844-931-7689",
      itemName: "Laptop",
      category: "Computing",
      location: "COL-01",
      quantity: 5,
    },
    {
      no: "02",
      itemNumber: "661-7963 - 661-7963",
      itemName: "Oscilloscope",
      category: "Electronic",
      location: "COL-02",
      quantity: 7,
    },
    {
      no: "03",
      itemNumber: "958-4030-182-0187",
      itemName: "Printer",
      category: "Computing",
      location: "EML-01",
      quantity: 12,
    },
  ];

  return (
    <div className="px-6 py-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <LayoutGrid size={22} className="text-indigo-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">
          Inventory Overview
        </h1>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cardData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          Inventory Item List
        </h2>

        <InventoryTable columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
};

export default InventoryItem;

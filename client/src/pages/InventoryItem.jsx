import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../components/layout/inventory/InventoryTable";
import PaginationBar from "../components/common/PaginationBar";
import { LayoutGrid, Plus } from "lucide-react";

const InventoryItem = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

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
      itemNumber: "661-7963-661-7963",
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
    {
      no: "04",
      itemNumber: "114-7821-556-9021",
      itemName: "Projector",
      category: "Electronic",
      location: "COL-03",
      quantity: 3,
    },
    {
      no: "05",
      itemNumber: "771-2290-443-1188",
      itemName: "Router",
      category: "Networking",
      location: "NET-01",
      quantity: 9,
    },
    {
      no: "06",
      itemNumber: "662-9033-781-5520",
      itemName: "Multimeter",
      category: "Electronic",
      location: "EML-02",
      quantity: 15,
    },
    {
      no: "07",
      itemNumber: "905-3321-667-4412",
      itemName: "Desktop Computer",
      category: "Computing",
      location: "COL-04",
      quantity: 6,
    },
    {
      no: "08",
      itemNumber: "318-7740-902-6631",
      itemName: "Keyboard",
      category: "Accessories",
      location: "COL-05",
      quantity: 25,
    },
    {
      no: "09",
      itemNumber: "440-1288-554-9902",
      itemName: "Mouse",
      category: "Accessories",
      location: "COL-05",
      quantity: 30,
    },
    {
      no: "10",
      itemNumber: "552-6671-223-8044",
      itemName: "Power Supply Unit",
      category: "Hardware",
      location: "HW-01",
      quantity: 8,
    },
  ];

  // Pagination Logic
  const totalPages = Math.ceil(tableData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = tableData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="h-full flex flex-col px-6 py-4">
      {/* Header with Button */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <LayoutGrid size={22} className="text-indigo-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-800">
            Inventory Item List
          </h1>
        </div>

        {/* Right */}
        <button
          onClick={() => navigate("/add-item")}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
        >
          <Plus size={18} />
          Add New Item
        </button>
      </div>

      {/* Table Section */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-4">
        <div className="flex-1 overflow-hidden">
          <InventoryTable columns={tableColumns} data={paginatedData} />
        </div>

        {/* Pagination */}
        <div className="mt-4">
          <PaginationBar
            totalResults={tableData.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;

import React from "react";
import InventoryCard from "../../components/inventory/InventoryCard";

const Inventory = () => {
  // ✅ Fake Data
  const inventoryItems = [
    {
      id: 1,
      name: "Dell Laptop XPS 15",
      code: "LAP-001",
      category: "Laptops",
      qty: 25,
      available: 18,
      price: 1299.99,
      warehouse: "Warehouse A",
    },
    {
      id: 2,
      name: "HP Printer LaserJet",
      code: "PRI-015",
      category: "Printers",
      qty: 12,
      available: 4,
      price: 399.99,
      warehouse: "Warehouse B",
    },
    {
      id: 3,
      name: 'MacBook Pro 16"',
      code: "LAP-012",
      category: "Laptops",
      qty: 5,
      available: 0,
      price: 2499.99,
      warehouse: "Warehouse A",
    },
  ];

  const handleView = (item) => {
    console.log("View:", item);
  };

  const handleEdit = (item) => {
    console.log("Edit:", item);
  };

  const handleDelete = (item) => {
    console.log("Delete:", item);
  };

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-700">
          Inventory Items
        </h1>

        <button className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition">
          + Add New Item
        </button>
      </div>

      {/* INVENTORY GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default Inventory;

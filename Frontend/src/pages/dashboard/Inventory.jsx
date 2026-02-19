import React from "react";

const Inventory = () => {
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
        <InventoryCard
          color="from-green-500 to-emerald-600"
          name="Dell Laptop XPS 15"
          code="LAP-001"
          category="Laptops"
          qty="25"
          available="18"
          price="$1299.99"
          status="in"
          warehouse="Warehouse A"
        />

        <InventoryCard
          color="from-green-500 to-emerald-600"
          name="HP Printer LaserJet"
          code="PRI-015"
          category="Printers"
          qty="12"
          available="7"
          price="$399.99"
          status="in"
          warehouse="Warehouse B"
        />

        <InventoryCard
          color="from-green-500 to-emerald-600"
          name="Logitech Wireless Mouse"
          code="ACC-042"
          category="Accessories"
          qty="150"
          available="145"
          price="$29.99"
          status="in"
          warehouse="Storage Room 1"
        />

        <InventoryCard
          color="from-orange-500 to-amber-500"
          name='Samsung Monitor 27"'
          code="MON-023"
          category="Monitors"
          qty="5"
          available="2"
          price="$349.99"
          status="low"
          warehouse="Warehouse A"
        />

        <InventoryCard
          color="from-pink-500 to-rose-600"
          name='MacBook Pro 16"'
          code="LAP-012"
          category="Laptops"
          qty="0"
          available="0"
          price="$2499.99"
          status="out"
          warehouse="Warehouse A"
        />

        <InventoryCard
          color="from-green-500 to-emerald-600"
          name='iPad Pro 12.9"'
          code="TAB-009"
          category="Tablets"
          qty="15"
          available="12"
          price="$1099.99"
          status="in"
          warehouse="Warehouse B"
        />
      </div>
    </div>
  );
};

/* ================= COMPONENT ================= */

const InventoryCard = ({
  color,
  name,
  code,
  category,
  qty,
  available,
  price,
  status,
  warehouse,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition">
      {/* TOP COLOR SECTION */}
      <div
        className={`h-20 bg-gradient-to-r ${color} flex items-center justify-center`}
      >
        <div className="w-10 h-10 border-2 border-white rounded-md"></div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-semibold text-gray-800">{name}</h3>
          <p className="text-xs text-gray-500">Code: {code}</p>
        </div>

        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Category:</span>
            <span>{category}</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span>{qty}</span>
          </div>
          <div className="flex justify-between">
            <span>Available:</span>
            <span className="text-blue-600 font-medium">{available}</span>
          </div>
          <div className="flex justify-between">
            <span>Price:</span>
            <span className="text-blue-600 font-medium">{price}</span>
          </div>
        </div>

        {/* STATUS BADGE */}
        <div>
          {status === "in" && (
            <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full">
              In Stock
            </span>
          )}
          {status === "low" && (
            <span className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full">
              Low Stock
            </span>
          )}
          {status === "out" && (
            <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>

        <p className="text-xs text-gray-400">{warehouse}</p>

        {/* ACTIONS */}
        <div className="flex items-center gap-2 pt-2">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg text-sm hover:opacity-90">
            View
          </button>

          <button className="w-8 h-8 bg-gray-100 rounded-lg text-gray-600 text-sm">
            ✎
          </button>

          <button className="w-8 h-8 bg-red-100 rounded-lg text-red-600 text-sm">
            🗑
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;

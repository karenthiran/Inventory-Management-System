import React from "react";
import {
  Eye,
  Pencil,
  Trash2,
  Package,
  Layers,
  Warehouse,
  DollarSign,
  Boxes,
} from "lucide-react";

const InventoryCard = ({ item, onView, onEdit, onDelete }) => {
  if (!item) return null;

  const { name, code, category, qty, available, price, warehouse } = item;

  const getStatus = () => {
    if (available === 0) return "out";
    if (available <= 5) return "low";
    return "in";
  };

  const status = getStatus();

  const statusStyles = {
    in: "bg-purple-100 text-purple-700",
    low: "bg-amber-100 text-amber-700",
    out: "bg-red-100 text-red-600",
  };

  const statusText = {
    in: "In Stock",
    low: "Low Stock",
    out: "Out of Stock",
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition duration-300">
      {/* TOP SECTION */}
      <div className="h-16 bg-purple-50 flex items-center justify-center border-b border-purple-100">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
          <Package size={18} />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        {/* Title + Status */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{name}</h3>
            <p className="text-xs text-gray-500">Code: {code}</p>
          </div>

          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyles[status]}`}
          >
            {statusText[status]}
          </span>
        </div>

        {/* Details */}
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Layers size={14} /> Category
            </span>
            <span className="text-gray-800 font-medium">{category}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Boxes size={14} /> Total Qty
            </span>
            <span>{qty}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <Package size={14} /> Available
            </span>
            <span className="text-purple-600 font-semibold">{available}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="flex items-center gap-2">
              <DollarSign size={14} /> Price
            </span>
            <span className="text-purple-600 font-semibold">
              ${Number(price).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Warehouse */}
        <div className="flex items-center gap-2 bg-purple-50 text-purple-700 text-xs px-3 py-2 rounded-lg">
          <Warehouse size={14} />
          {warehouse}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2 pt-2">
          <button
            onClick={() => onView?.(item)}
            className="flex-1 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-300 transition"
          >
            <Eye size={16} />
            View Details
          </button>

          <button
            onClick={() => onEdit?.(item)}
            className="w-9 h-9 flex items-center justify-center bg-purple-100 rounded-lg text-purple-700 hover:bg-purple-200 transition"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete?.(item)}
            className="w-9 h-9 flex items-center justify-center bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCard;

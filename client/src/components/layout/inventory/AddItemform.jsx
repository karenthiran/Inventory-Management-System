import React, { useState } from "react";
import { X } from "lucide-react";

const AddItemForm = ({ onClose, onAddItem }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    category: "",
    location: "",
    quantity: 0,
    itemType: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.itemName ||
      !formData.itemCode ||
      !formData.category ||
      !formData.location ||
      formData.quantity === "" ||
      formData.quantity < 0 ||
      !formData.itemType
    ) {
      alert("Please fill all required fields correctly");
      return;
    }

    onAddItem(formData);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 
        text-gray-800 dark:text-gray-200
        w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative 
        border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-red-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Add A New Item
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fill the Details to add a new inventory Item
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Item Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Item Name</label>
            <input
              type="text"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              placeholder="Enter Item Name"
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition"
            />
          </div>

          {/* Item Code */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Item Code</label>
            <input
              type="text"
              name="itemCode"
              value={formData.itemCode}
              onChange={handleChange}
              placeholder="Enter Item Code"
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              transition"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              <option>Electronics</option>
              <option>Furniture</option>
            </select>
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Location</option>
              <option>Lab 1</option>
              <option>Store Room</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Quantity</label>
            <div
              className="flex items-center 
            border border-gray-300 dark:border-gray-600 
            rounded-lg overflow-hidden 
            focus-within:ring-2 focus-within:ring-indigo-500"
            >
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(0, Number(prev.quantity) - 1),
                  }))
                }
                className="px-4 py-2 
                bg-gray-200 dark:bg-gray-700
                hover:bg-gray-300 dark:hover:bg-gray-600
                font-bold transition"
              >
                −
              </button>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                min="0"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity:
                      e.target.value === ""
                        ? ""
                        : Math.max(0, Number(e.target.value)),
                  }))
                }
                className="w-full text-center 
                bg-white dark:bg-gray-800 
                outline-none py-2"
              />

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(prev.quantity) + 1,
                  }))
                }
                className="px-4 py-2 
                bg-gray-200 dark:bg-gray-700
                hover:bg-gray-300 dark:hover:bg-gray-600
                font-bold transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Item Type */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Item Type</label>
            <select
              name="itemType"
              value={formData.itemType}
              onChange={handleChange}
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Type</option>
              <option>Permanent</option>
              <option>Consumable</option>
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2 flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Description{" "}
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                (Optional)
              </span>
            </label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Small Description"
              className="bg-white dark:bg-gray-800
              border border-gray-300 dark:border-gray-600
              rounded-lg px-3 py-2 resize-none
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-center gap-8 mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 
              text-white px-8 py-2 rounded-lg 
              font-semibold transition"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 
              text-white px-8 py-2 rounded-lg 
              font-semibold transition"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItemForm;

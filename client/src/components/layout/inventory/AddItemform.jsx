import React, { useState } from "react";
import { X } from "lucide-react";

const AddItemForm = ({
  onClose,
  onAddItem,
  categories = [],
  locations = [],
  itemTypes = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    category: "",
    location: "",
    quantity: 0,
    itemType: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     Validation Function
  ========================== */
  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required";

    if (!formData.itemCode.trim()) newErrors.itemCode = "Item Code is required";

    if (!formData.category) newErrors.category = "Please select a category";

    if (!formData.location) newErrors.location = "Please select a location";

    if (formData.quantity === "" || formData.quantity < 0)
      newErrors.quantity = "Quantity must be 0 or more";

    if (!formData.itemType) newErrors.itemType = "Please select item type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =========================
     Handle Change
  ========================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? value === ""
            ? ""
            : Math.max(0, Number(value))
          : value,
    }));

    // remove error when user types
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* =========================
     Submit
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onAddItem({
      ...formData,
      quantity: Number(formData.quantity),
    });
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
          aria-label="Close Modal"
          className="absolute top-4 right-4 text-red-500 hover:text-red-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Add A New Item
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fill the details to add a new inventory item
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* ================= Item Name ================= */}
          <InputField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            error={errors.itemName}
            placeholder="Enter Item Name"
          />

          {/* ================= Item Code ================= */}
          <InputField
            label="Item Code"
            name="itemCode"
            value={formData.itemCode}
            onChange={handleChange}
            error={errors.itemCode}
            placeholder="Enter Item Code"
          />

          {/* ================= Category ================= */}
          <SelectField
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={categories}
          />

          {/* ================= Location ================= */}
          <SelectField
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            options={locations}
          />

          {/* ================= Quantity ================= */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Quantity</label>
            <div
              className={`flex items-center border rounded-lg overflow-hidden 
              ${
                errors.quantity
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }
              focus-within:ring-2 focus-within:ring-indigo-500`}
            >
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(0, Number(prev.quantity) - 1),
                  }))
                }
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold"
              >
                −
              </button>

              <input
                type="number"
                name="quantity"
                min="0"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full text-center bg-white dark:bg-gray-800 outline-none py-2"
              />

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Number(prev.quantity) + 1,
                  }))
                }
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold"
              >
                +
              </button>
            </div>
            {errors.quantity && (
              <span className="text-red-500 text-xs mt-1">
                {errors.quantity}
              </span>
            )}
          </div>

          {/* ================= Item Type ================= */}
          <SelectField
            label="Item Type"
            name="itemType"
            value={formData.itemType}
            onChange={handleChange}
            error={errors.itemType}
            options={itemTypes}
          />

          {/* ================= Description ================= */}
          <div className="col-span-2 flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Description
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <textarea
              rows="3"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Small Description"
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* ================= Buttons ================= */}
          <div className="col-span-2 flex justify-center gap-8 mt-4">
            <button
              type="button"
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-8 py-2 rounded-lg font-semibold"
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   Reusable Input Component
========================= */
const InputField = ({ label, name, value, onChange, error, placeholder }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rounded-lg px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

/* =========================
   Reusable Select Component
========================= */
const SelectField = ({ label, name, value, onChange, error, options = [] }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-lg px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
    >
      <option value="">Select {label}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export default AddItemForm;

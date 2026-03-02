import React, { useState } from "react";
import { X } from "lucide-react";

const IssueItemForm = ({ onClose, onIssueItem, loading = false }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemNo: "",
    quantity: 1,
    issueTo: "",
    issueDate: "",
    dueDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  /* =========================
     Validation
  ========================== */
  const validate = () => {
    const newErrors = {};

    if (!formData.itemName.trim()) newErrors.itemName = "Item Name is required";

    if (!formData.itemNo.trim()) newErrors.itemNo = "Item Number is required";

    if (!formData.issueTo.trim())
      newErrors.issueTo = "Issue To field is required";

    if (!formData.issueDate) newErrors.issueDate = "Issue Date is required";

    if (!formData.dueDate) newErrors.dueDate = "Due Date is required";

    if (formData.quantity <= 0)
      newErrors.quantity = "Quantity must be at least 1";

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
      [name]: name === "quantity" ? Math.max(1, Number(value)) : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* =========================
     Submit
  ========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    await onIssueItem(formData);
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

        {/* Title */}
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Issue Item
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fill the details to issue an item to a user
        </p>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Item Name */}
          <InputField
            label="Item Name"
            name="itemName"
            value={formData.itemName}
            onChange={handleChange}
            error={errors.itemName}
            placeholder="Desktop PC"
          />

          {/* Item Number */}
          <InputField
            label="Item No"
            name="itemNo"
            value={formData.itemNo}
            onChange={handleChange}
            error={errors.itemNo}
            placeholder="UOJPC001"
          />

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1">Quantity</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              className={`rounded-lg px-3 py-2 border ${
                errors.quantity
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.quantity && (
              <span className="text-red-500 text-xs mt-1">
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Issue To */}
          <InputField
            label="Issue To (User / Lab)"
            name="issueTo"
            value={formData.issueTo}
            onChange={handleChange}
            error={errors.issueTo}
            placeholder="COL - 01"
          />

          {/* Issue Date */}
          <DateField
            label="Issue Date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            error={errors.issueDate}
          />

          {/* Due Date */}
          <DateField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
          />

          {/* Notes */}
          <div className="col-span-2 flex flex-col">
            <label className="text-sm font-semibold mb-1">
              Notes
              <span className="text-gray-500 text-xs ml-1">(Optional)</span>
            </label>
            <textarea
              rows="3"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-center gap-8 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-8 py-2 rounded-lg font-semibold"
            >
              {loading ? "Issuing..." : "Issue Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
   Reusable Input
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
   Reusable Date Field
========================= */
const DateField = ({ label, name, value, onChange, error }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1">{label}</label>
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-lg px-3 py-2 border ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
    />
    {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
  </div>
);

export default IssueItemForm;

import { X } from "lucide-react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const InventoryDetails = ({ onClose }) => {
  const [formData, setFormData] = useState({
    itemName: "",
    itemCode: "",
    category: "",
    location: "",
    quantity: 0,
    itemType: "",
    description: "",
  });

  return (
    <div
      className='fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative border border-gray-200 dark:border-gray-700'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-red-500 border border-red-500 rounded-sm hover:text-white hover:bg-red-500'
        >
          <X size={20} />
        </button>

        <h2 className='text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2'>
          Add A New Item
        </h2>
        <p className='text-gray-600 dark:text-gray-400 mb-6'>
          Fill the details to add a new inventory item
        </p>

        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
          <InputField
            label='Item Name'
            name='itemName'
            value={formData.itemName}
            onChange={handleChange}
            error={errors.itemName}
            placeholder='Enter Item Name'
          />
          <InputField
            label='Item Code'
            name='itemCode'
            value={formData.itemCode}
            onChange={handleChange}
            error={errors.itemCode}
            placeholder='Enter Item Code'
          />

          <SelectField
            label='Category'
            name='category'
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            options={categories}
            dataKey='categoryId'
            displayKey='categoryName'
          />
          <SelectField
            label='Location'
            name='location'
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            options={locations}
            dataKey='locationId'
            displayKey='locationName'
          />

          {/* Quantity with +/- Buttons */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1'>Quantity</label>
            <div
              className={`flex items-center border rounded-lg overflow-hidden ${errors.quantity ? "border-red-500" : "border-gray-300 dark:border-gray-600"} focus-within:ring-2 focus-within:ring-indigo-500`}
            >
              <button
                type='button'
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    quantity: Math.max(0, Number(p.quantity || 0) - 1),
                  }))
                }
                className='px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold'
              >
                −
              </button>
              <input
                type='number'
                name='quantity'
                value={formData.quantity}
                onChange={handleChange}
                className='w-full text-center bg-white dark:bg-gray-800 outline-none py-2'
              />
              <button
                type='button'
                onClick={() =>
                  setFormData((p) => ({
                    ...p,
                    quantity: Number(p.quantity || 0) + 1,
                  }))
                }
                className='px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold'
              >
                +
              </button>
            </div>
            {errors.quantity && (
              <span className='text-red-500 text-xs mt-1'>
                {errors.quantity}
              </span>
            )}
          </div>

          {/* Item Type Dropdown */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1'>Item Type</label>
            <select
              name='itemType'
              value={formData.itemType}
              onChange={handleChange}
              className={`rounded-lg px-3 py-2 border ${errors.itemType ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800`}
            >
              <option value=''>Select Type</option>
              {itemTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className='col-span-2 flex flex-col'>
            <label className='text-sm font-semibold mb-1'>
              Description{" "}
              <span className='text-gray-500 text-xs ml-1'>(Optional)</span>
            </label>
            <textarea
              rows='3'
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='Small Description'
              className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          <div className='col-span-2 flex justify-center gap-8 mt-4'>
            <button
              type='button'
              className='bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold'
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* =========================
    REUSABLE COMPONENTS
========================== */

const InputField = ({ label, name, value, onChange, error, placeholder }) => (
  <div className='flex flex-col'>
    <label className='text-sm font-semibold mb-1'>{label}</label>
    <input
      type='text'
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`rounded-lg px-3 py-2 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
    />
    {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
  </div>
);

const SelectField = ({
  label,
  name,
  value,
  onChange,
  error,
  options,
  dataKey,
  displayKey,
}) => (
  <div className='flex flex-col'>
    <label className='text-sm font-semibold mb-1'>{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-lg px-3 py-2 border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800`}
    >
      <option value=''>Select {label}</option>
      {options.map((opt) => (
        <option key={opt[dataKey]} value={opt[dataKey]}>
          {opt[displayKey]}
        </option>
      ))}
    </select>
    {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
  </div>
);

export default InventoryDetails;

import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInventory } from "../../../context/InventoryContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const AddItemForm = ({ onClose }) => {
  const { addItem, loading } = useInventory();

  /* STATE & DROP-DOWN DATA */
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);

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
      FETCH FROM BACKEND
  ========================== */
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const [catRes, locRes, itmRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/categories/all`),
          axios.get(`${API_BASE_URL}/api/locations/all`),
          axios.get(`${API_BASE_URL}/api/itemtypes/all`),
        ]);
        setCategories(catRes.data);
        setLocations(locRes.data);
        setItemTypes(itmRes.data);
      } catch (err) {
        console.error("Failed to load backend data:", err);
      }
    };
    fetchDropdowns();
  }, []);

  /* =========================
      HANDLERS & VALIDATION
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

  //handleChange — when itemType changes to Capital, force quantity to 1
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // ✅ If user selects Capital item type, lock quantity to 1
    if (name === "itemType") {
      const selectedType = itemTypes.find(
        (t) => String(t.typeId) === String(value),
      );
      const isCapital = selectedType?.typeName?.toLowerCase() === "capital";
      setFormData((prev) => ({
        ...prev,
        itemType: value,
        quantity: isCapital ? 1 : prev.quantity,
      }));
      return;
    }

    if (name === "quantity") {
      if (value === "") {
        setFormData((prev) => ({ ...prev, quantity: "" }));
        return;
      }
      const numericValue = parseInt(value, 10);
      if (isNaN(numericValue) || numericValue < 0) return;
      setFormData((prev) => ({ ...prev, quantity: numericValue }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Replace handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      itemCode: formData.itemCode,
      itemName: formData.itemName,
      quantity: Number(formData.quantity),
      description: formData.description,
      itemType: { typeId: formData.itemType },
      category: { categoryId: formData.category },
      location: { locationId: formData.location },
    };

    const result = await addItem(payload);

    if (result?.success) {
      onClose();
      toast.success(`"${formData.itemName}" added to inventory successfully!`);
    } else {
      toast.error(result?.message || "Failed to add item. Please try again.");
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 dark:bg-black/70 flex items-center justify-center z-50'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative border border-gray-200 dark:border-gray-700'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-red-500 border border-red-500 rounded-sm hover:text-white hover:bg-red-500 transition-colors'
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

          <SelectField
            label='Item Type'
            name='itemType'
            value={formData.itemType}
            onChange={handleChange}
            error={errors.itemType}
            options={itemTypes}
            dataKey='typeId'
            displayKey='typeName'
          />
          {/* Quantity */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1'>
              Quantity
              {/* ✅ Show hint when Capital is selected */}
              {(() => {
                const selectedType = itemTypes.find(
                  (t) => String(t.typeId) === String(formData.itemType),
                );
                return selectedType?.typeName?.toLowerCase() === "capital" ? (
                  <span className='text-xs text-indigo-500 ml-2 font-normal'>
                    (Capital items are always qty 1)
                  </span>
                ) : null;
              })()}
            </label>
            {(() => {
              const selectedType = itemTypes.find(
                (t) => String(t.typeId) === String(formData.itemType),
              );
              const isCapital =
                selectedType?.typeName?.toLowerCase() === "capital";
              return (
                <div
                  className={`flex items-center border rounded-lg overflow-hidden ${
                    errors.quantity
                      ? "border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } ${isCapital ? "opacity-60" : ""} focus-within:ring-2 focus-within:ring-indigo-500`}
                >
                  <button
                    type='button'
                    disabled={isCapital} // ✅ locked for Capital
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        quantity: Math.max(1, Number(p.quantity || 1) - 1),
                      }))
                    }
                    className='px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:cursor-not-allowed'
                  >
                    −
                  </button>
                  <input
                    type='number'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    readOnly={isCapital} // ✅ locked for Capital
                    className='w-full text-center bg-white dark:bg-gray-800 outline-none py-2 disabled:cursor-not-allowed'
                  />
                  <button
                    type='button'
                    disabled={isCapital} // ✅ locked for Capital
                    onClick={() =>
                      setFormData((p) => ({
                        ...p,
                        quantity: Number(p.quantity || 1) + 1,
                      }))
                    }
                    className='px-4 py-2 bg-gray-200 dark:bg-gray-700 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 disabled:cursor-not-allowed'
                  >
                    +
                  </button>
                </div>
              );
            })()}
            {errors.quantity && (
              <span className='text-red-500 text-xs mt-1'>
                {errors.quantity}
              </span>
            )}
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
              className='bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 resize-none focus:ring-2 focus:ring-indigo-500 outline-none'
            />
          </div>

          <div className='col-span-2 flex justify-center gap-8 mt-4'>
            <button
              type='button'
              className='bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg font-semibold transition-colors'
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={loading}
              className='bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white px-8 py-2 rounded-lg font-semibold transition-colors'
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
      className={`rounded-lg px-3 py-2 border outline-none transition-all ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
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
      className={`rounded-lg px-3 py-2 border outline-none transition-all ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      } bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500`}
    >
      <option value=''>Select {label}</option>
      {options &&
        options.map((opt) => (
          <option key={opt[dataKey]} value={opt[dataKey]}>
            {opt[displayKey]}
          </option>
        ))}
    </select>
    {error && <span className='text-red-500 text-xs mt-1'>{error}</span>}
  </div>
);

export default AddItemForm;

import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const EditItemForm = ({ item, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    ...item,
    itemName: item.itemName || "",
    quantity: item.quantity || 0,
    description: item.description || "",
    // Store IDs for the selections
    categoryId: item.category?.id || "",
    locationId: item.location?.id || "",
    itemType: item.itemType || "STOCK", // Assuming a default or existing type
  });

  const [options, setOptions] = useState({ categories: [], locations: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= FETCH OPTIONS ================= */
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, locRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/categories/all`),
          fetch(`${API_BASE_URL}/api/locations/all`),
        ]);
        const categories = await catRes.json();
        const locations = await locRes.json();
        setOptions({ categories, locations });
      } catch (err) {
        console.error("Failed to fetch dropdown options:", err);
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventory/update/${item.itemCode}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Update failed");

      const updatedItem = await response.json();
      onUpdate(updatedItem);
      onClose();
    } catch (err) {
      console.error("Error updating item:", err);
      alert("Failed to update item.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-gray-200";
  const labelClass =
    "block text-[10px] font-bold uppercase text-gray-500 mb-1 tracking-tight";

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4'>
      <div className='bg-white dark:bg-gray-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
        <div className='flex justify-between items-center p-5 border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50'>
          <div>
            <h3 className='text-lg font-bold text-gray-800 dark:text-white'>
              Edit Inventory Item
            </h3>
            <p className='text-[10px] text-gray-500 uppercase font-semibold'>
              Code: {item.itemCode}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className='p-5 space-y-4 max-h-[80vh] overflow-y-auto'
        >
          {/* Row 1: Name & Type */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className={labelClass}>Item Name</label>
              <input
                type='text'
                className={inputClass}
                value={formData.itemName}
                onChange={(e) =>
                  setFormData({ ...formData, itemName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className={labelClass}>Item Type</label>
              <select
                className={inputClass}
                value={formData.itemType}
                onChange={(e) =>
                  setFormData({ ...formData, itemType: e.target.value })
                }
              >
                <option value='STOCK'>Stock Item</option>
                <option value='ASSET'>Fixed Asset</option>
                <option value='CONSUMABLE'>Consumable</option>
              </select>
            </div>
          </div>

          {/* Row 2: Category & Location */}
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                disabled={loadingOptions}
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
              >
                <option value=''>Select Category</option>
                {options.categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <select
                className={inputClass}
                disabled={loadingOptions}
                value={formData.locationId}
                onChange={(e) =>
                  setFormData({ ...formData, locationId: e.target.value })
                }
              >
                <option value=''>Select Location</option>
                {options.locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.locationName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Quantity */}
          <div>
            <label className={labelClass}>Stock Quantity</label>
            <input
              type='number'
              min='0'
              className={inputClass}
              value={formData.quantity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  quantity: parseInt(e.target.value) || 0,
                })
              }
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className={labelClass}>Description / Notes</label>
            <textarea
              className={`${inputClass} h-20 resize-none italic`}
              placeholder='Enter item details...'
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className='flex justify-end gap-3 pt-4 dark:border-gray-800'>
            <button
              type='button'
              onClick={onClose}
              className='px-5 py-2 text-sm font-semibold text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
            >
              Discard
            </button>
            <button
              type='submit'
              disabled={isSubmitting || loadingOptions}
              className='bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all active:scale-95'
            >
              {isSubmitting ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                "Update Record"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;

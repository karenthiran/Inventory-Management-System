import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const IssueItemForm = ({
  onClose,
  onIssueItem,
  loading: externalLoading = false,
}) => {
  const [internalLoading, setInternalLoading] = useState(false);
  const [allInventoryItems, setAllInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const [formData, setFormData] = useState({
    itemName: "",
    categoryId: "",
    itemCodes: [],
    userName: "",
    quantity: "0",
    issueTo: "",
    issueDate: getTodayDate(),
    dueDate: "",
    notes: "",
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showItemCodeDropdown, setShowItemCodeDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const [catRes, invRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/categories/all`),
          axios.get(`${API_BASE_URL}/api/inventory/all`),
        ]);
        setCategories(
          catRes.data.sort((a, b) =>
            a.categoryName.localeCompare(b.categoryName),
          ),
        );
        setAllInventoryItems(invRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableItemCodes = useMemo(() => {
    if (!formData.itemName) return [];
    return allInventoryItems.filter(
      (item) =>
        item.category?.categoryName === formData.itemName &&
        !formData.itemCodes.includes(item.itemCode),
    );
  }, [allInventoryItems, formData.itemName, formData.itemCodes]);

  const handleCategorySelect = (catObj) => {
    setFormData((prev) => ({
      ...prev,
      itemName: catObj.categoryName,
      categoryId: catObj.categoryId,
      itemCodes: [],
      quantity: "0",
    }));
    setShowCategoryDropdown(false);
  };

  const handleToggleItemCode = (code) => {
    setFormData((prev) => {
      const isSelected = prev.itemCodes.includes(code);
      const updatedCodes = isSelected
        ? prev.itemCodes.filter((c) => c !== code)
        : [...prev.itemCodes, code];
      return {
        ...prev,
        itemCodes: updatedCodes,
        quantity: updatedCodes.length.toString(),
      };
    });

    // Close dropdown after selection
    setShowItemCodeDropdown(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.categoryId) newErrors.itemName = "Category is required";
    if (formData.itemCodes.length === 0)
      newErrors.itemCodes = "Select at least one code";
    if (!formData.userName.trim())
      newErrors.userName = "Admin name is required";
    if (!formData.issueTo.trim()) newErrors.issueTo = "Location is required";
    if (!formData.issueDate) newErrors.issueDate = "Issue date is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || internalLoading || externalLoading) return;

    setInternalLoading(true);
    try {
      const payload = {
        // 1. Nested Category Object
        category: {
          categoryId: formData.categoryId,
          categoryName: formData.itemName,
        },
        // 2. Matches 'private String username' in Java
        username: formData.userName,
        // 3. Array of strings for @ElementCollection
        itemCodes: formData.itemCodes,
        quantity: parseInt(formData.quantity, 10),
        // 4. FIXED: changed 'issueTo' to 'issuedTo' to match Java @Column
        issuedTo: formData.issueTo,
        // 5. Dates (ensure YYYY-MM-DD format)
        issueDate: formData.issueDate,
        dueDate: formData.dueDate || null,
        notes: formData.notes || "",
        isReturned: false,
      };

      console.log("Sending Payload:", payload); // Debugging line

      const response = await axios.post(
        `${API_BASE_URL}/api/inventory/issue/issue`,
        payload,
      );

      if (response.status === 200 || response.status === 201) {
        if (onIssueItem) await onIssueItem(response.data);
        onClose();
      }
    } catch (error) {
      // Better error message extraction
      const errorMsg = error.response?.data || "Submit failed.";
      setErrors({
        api: typeof errorMsg === "string" ? errorMsg : "Check backend logs.",
      });
      console.error("Submission Error:", error.response);
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-red-500"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
          Issue Item
        </h2>

        {errors.api && (
          <p className="text-red-500 text-sm mb-4 bg-red-100 dark:bg-red-500/10 p-2 rounded">
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Category Selector */}
          <div className="flex flex-col relative">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Select Category
            </label>

            <div
              onClick={() =>
                !dataLoading && setShowCategoryDropdown(!showCategoryDropdown)
              }
              className={`flex items-center justify-between rounded-lg px-3 py-2 border cursor-pointer bg-gray-100 dark:bg-[#1f2937] ${
                errors.itemName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              <span
                className={
                  formData.itemName
                    ? "text-gray-900 dark:text-gray-100"
                    : "text-gray-500"
                }
              >
                {dataLoading
                  ? "Loading..."
                  : formData.itemName || "Select Category"}
              </span>

              <ChevronDown
                size={18}
                className={`text-gray-500 dark:text-gray-400 transition-transform ${
                  showCategoryDropdown ? "rotate-180" : ""
                }`}
              />
            </div>

            {showCategoryDropdown && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl z-[9999]">
                {categories.map((cat) => (
                  <div
                    key={cat.categoryId}
                    onClick={() => handleCategorySelect(cat)}
                    className="px-4 py-2.5 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-indigo-500 hover:text-white border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    {cat.categoryName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin Name */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Admin Name
            </label>

            <input
              type="text"
              name="userName"
              placeholder="Enter admin name"
              value={formData.userName}
              onChange={handleChange}
              className={`rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] text-gray-900 dark:text-white ${
                errors.userName
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            />
          </div>

          {/* Item Codes */}
          <div className="flex flex-col relative col-span-2">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Item Codes
            </label>

            <div
              onClick={() =>
                formData.itemName &&
                setShowItemCodeDropdown(!showItemCodeDropdown)
              }
              className={`flex flex-wrap gap-2 items-center min-h-[42px] rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] ${
                !formData.itemName ? "opacity-50" : "cursor-pointer"
              } ${
                errors.itemCodes
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              }`}
            >
              {formData.itemCodes.length > 0 ? (
                formData.itemCodes.map((code) => (
                  <span
                    key={code}
                    className="bg-indigo-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                  >
                    {code}
                    <X
                      size={14}
                      className="cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleItemCode(code);
                      }}
                    />
                  </span>
                ))
              ) : (
                <span className="text-gray-500">Select Item Codes</span>
              )}

              <ChevronDown
                size={18}
                className="ml-auto text-gray-500 dark:text-gray-400"
              />
            </div>

            {showItemCodeDropdown && formData.itemName && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl max-h-56 overflow-y-auto z-[9999]">
                {availableItemCodes.map((item) => (
                  <div
                    key={item.itemCode}
                    onClick={() => handleToggleItemCode(item.itemCode)}
                    className="px-4 py-2.5 cursor-pointer text-gray-800 dark:text-gray-200 hover:bg-indigo-500 hover:text-white border-b border-gray-200 dark:border-gray-700 last:border-0"
                  >
                    {item.itemCode}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issue To */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Issue To
            </label>

            <input
              type="text"
              name="issueTo"
              placeholder="Enter receiver name"
              value={formData.issueTo}
              onChange={handleChange}
              className="rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
            />
          </div>

          {/* Quantity */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Total Quantity
            </label>

            <input
              type="number"
              value={formData.quantity}
              readOnly
              className="rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#111827] text-indigo-600 dark:text-indigo-400 font-bold"
            />
          </div>

          {/* Dates */}
          <DateField
            label="Issue Date"
            name="issueDate"
            value={formData.issueDate}
            onChange={handleChange}
            error={errors.issueDate}
          />

          <DateField
            label="Due Date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            error={errors.dueDate}
          />

          {/* Notes */}
          <div className="flex flex-col col-span-2">
            <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
              Notes (Optional)
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-[#1f2937] text-gray-900 dark:text-white resize-none focus:outline-none focus:border-indigo-500"
              placeholder="Add any additional details here..."
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 dark:text-gray-400 px-6 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={externalLoading || internalLoading}
              className="bg-indigo-600 text-white px-10 py-2.5 rounded-lg font-bold disabled:bg-gray-400 dark:disabled:bg-gray-700 hover:bg-indigo-700 transition-colors"
            >
              {internalLoading ? "Processing..." : "Confirm Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DateField = ({ label, name, value, onChange, error }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
      {label}
    </label>

    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className={`rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] text-gray-900 dark:text-white ${
        error ? "border-red-500" : "border-gray-300 dark:border-gray-600"
      }`}
    />
  </div>
);

export default IssueItemForm;

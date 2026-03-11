import axios from "axios";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

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
  const [uniqueItemNames, setUniqueItemNames] = useState([]);
  const [availableItemCodes, setAvailableItemCodes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);

  const loggedInUser = localStorage.getItem("username") || "Admin";

  const [formData, setFormData] = useState({
    itemName: "",
    itemCodes: [],
    userName: loggedInUser,
    quantity: "0",
    issueToEmail: "",
    locationId: "",
    issueDate: getTodayDate(),
    dueDate: "",
    notes: "",
  });

  const [showItemNameDropdown, setShowItemNameDropdown] = useState(false);
  const [showItemCodeDropdown, setShowItemCodeDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      setDataLoading(true);
      try {
        const [namesRes, locRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/issues/unique-items`),
          axios.get(`${API_BASE_URL}/api/locations/all`),
          axios.get(`${API_BASE_URL}/api/users/all`),
        ]);
        setUniqueItemNames(namesRes.data);
        setLocations(locRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        toast.error("Failed to load initial form data.");
      } finally {
        setDataLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchCodes = async () => {
      if (!formData.itemName) {
        setAvailableItemCodes([]);
        return;
      }
      try {
        const [codesRes, activeMaintenanceRes] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/api/issues/available-codes/${formData.itemName}`,
          ),
          axios.get(`${API_BASE_URL}/api/maintenance/active-codes`),
        ]);

        const allAvailableCodes = codesRes.data;
        const activeMaintenanceCodes = activeMaintenanceRes.data; // string[]

        // ✅ Filter out any codes currently in active maintenance
        const filteredCodes = allAvailableCodes.filter(
          (code) => !activeMaintenanceCodes.includes(code),
        );

        setAvailableItemCodes(filteredCodes);
      } catch (err) {
        toast.error("Could not fetch available codes.");
      }
    };
    fetchCodes();
  }, [formData.itemName]);
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
    setShowItemCodeDropdown(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.itemName) newErrors.itemName = "Item Name is required";
    if (formData.itemCodes.length === 0)
      newErrors.itemCodes = "Select at least one code";
    if (!formData.issueToEmail)
      newErrors.issueToEmail = "Recipient is required";
    if (!formData.locationId) newErrors.locationId = "Location is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || internalLoading) return;

    setInternalLoading(true);
    try {
      const payload = {
        itemName: formData.itemName,
        // ✅ Convert array to comma-separated string for backend
        itemCodesSnapshot: formData.itemCodes.join(","),
        issuedBy: loggedInUser,
        issuedTo: { email: formData.issueToEmail },
        location: { locationId: formData.locationId },
        quantity: parseInt(formData.quantity, 10),
        issueDate: formData.issueDate,
        expectedReturnDate: formData.dueDate,
        notes: formData.notes || "",
        isReturned: false,
      };

      await axios.post(`${API_BASE_URL}/api/issues/create`, payload);
      toast.success("Item(s) issued successfully!");
      if (onIssueItem) await onIssueItem();
      onClose();
    } catch (error) {
      toast.error(error.response?.data || "Submit failed.");
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50'
      onClick={onClose}
    >
      <style>
        {`
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}
      </style>

      <div
        className='bg-white dark:bg-[#111827] w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative border border-gray-200 dark:border-gray-700'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type='button'
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-500 hover:text-red-500'
        >
          <X size={20} />
        </button>
        <h2 className='text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6'>
          Issue Item
        </h2>

        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-6'>
          {/* Item Name */}
          <div className='flex flex-col relative'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Item Name
            </label>
            <div
              onClick={() => setShowItemNameDropdown(!showItemNameDropdown)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] ${errors.itemName ? "border-red-500" : "border-gray-300 dark:border-gray-600"} cursor-pointer`}
            >
              <span className='dark:text-white'>
                {formData.itemName || "Select Item"}
              </span>
              <ChevronDown size={18} />
            </div>
            {showItemNameDropdown && (
              <div className='absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1f2937] border rounded-lg shadow-xl z-[9999] max-h-40 overflow-y-auto hide-scrollbar'>
                {uniqueItemNames.map((name) => (
                  <div
                    key={name}
                    onClick={() => {
                      setFormData({
                        ...formData,
                        itemName: name,
                        itemCodes: [],
                      });
                      setShowItemNameDropdown(false);
                    }}
                    className='px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer border-b last:border-0 dark:border-gray-700 dark:text-gray-200'
                  >
                    {name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Issued By */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Issued By
            </label>
            <input
              type='text'
              readOnly
              value={formData.userName}
              className='rounded-lg px-3 py-2 border bg-gray-200 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed border-gray-300 dark:border-gray-600 font-medium'
            />
          </div>

          {/* Available Item Codes */}
          <div className='col-span-2 flex flex-col relative'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Available Item Codes
            </label>
            <div
              onClick={() =>
                formData.itemName &&
                setShowItemCodeDropdown(!showItemCodeDropdown)
              }
              className={`min-h-[42px] rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] flex flex-wrap gap-2 cursor-pointer ${errors.itemCodes ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            >
              {formData.itemCodes.map((code) => (
                <span
                  key={code}
                  className='bg-indigo-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1'
                >
                  {code}
                  <X
                    size={12}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItemCode(code);
                    }}
                  />
                </span>
              ))}
            </div>
            {showItemCodeDropdown && (
              <div className='absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1f2937] border rounded-lg shadow-xl z-[9999] max-h-40 overflow-y-auto hide-scrollbar'>
                {availableItemCodes
                  .filter((c) => !formData.itemCodes.includes(c))
                  .map((code) => (
                    <div
                      key={code}
                      onClick={() => handleToggleItemCode(code)}
                      className='px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer dark:text-gray-200'
                    >
                      {code}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Issued To */}
          <div className='flex flex-col relative'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Issued To (User)
            </label>
            <div
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] ${errors.issueToEmail ? "border-red-500" : "border-gray-300 dark:border-gray-600"} cursor-pointer`}
            >
              <span className='dark:text-white truncate'>
                {formData.issueToEmail || "Select User"}
              </span>
              <ChevronDown size={18} />
            </div>
            {showUserDropdown && (
              <div className='absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1f2937] border rounded-lg shadow-xl z-[9999] max-h-52 overflow-y-auto hide-scrollbar'>
                {users.map((u) => (
                  <div
                    key={u.email}
                    onClick={() => {
                      setFormData({ ...formData, issueToEmail: u.email });
                      setShowUserDropdown(false);
                    }}
                    className='px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer border-b last:border-0 dark:border-gray-700'
                  >
                    <div className='text-sm font-bold'>{u.username}</div>
                    <div className='text-[10px] opacity-80'>{u.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Location
            </label>
            <select
              value={formData.locationId}
              onChange={(e) =>
                setFormData({ ...formData, locationId: e.target.value })
              }
              className='rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] dark:text-white border-gray-300 dark:border-gray-600'
            >
              <option value=''>Select Location</option>
              {locations.map((loc) => (
                <option key={loc.locationId} value={loc.locationId}>
                  {loc.locationName}
                </option>
              ))}
            </select>
          </div>

          {/* Issue Date */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Issue Date
            </label>
            <input
              type='date'
              readOnly
              value={formData.issueDate}
              className='rounded-lg px-3 py-2 border bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed border-gray-300 dark:border-gray-600'
            />
          </div>

          {/* Due Date */}
          <div className='flex flex-col'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Due Date
            </label>
            <input
              type='date'
              min={formData.issueDate}
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className={`rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] dark:text-white ${errors.dueDate ? "border-red-500" : "border-gray-300 dark:border-gray-600"}`}
            />
          </div>

          {/* Notes */}
          <div className='col-span-2 flex flex-col'>
            <label className='text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200'>
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows='2'
              className='rounded-lg px-3 py-2 border bg-gray-100 dark:bg-[#1f2937] dark:text-white border-gray-300 dark:border-gray-600 resize-none'
            />
          </div>

          {/* Buttons */}
          <div className='col-span-2 flex justify-end gap-4 mt-2'>
            <button
              type='button'
              onClick={onClose}
              className='text-gray-500 px-4'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={internalLoading}
              className='bg-indigo-600 text-white px-10 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors'
            >
              {internalLoading ? "Confirming..." : "Confirm Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueItemForm;

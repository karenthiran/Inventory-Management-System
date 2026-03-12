import { Calendar, X } from "lucide-react";
import { useState } from "react";

const EditDueDateModal = ({ data, onClose, onUpdate, loading }) => {
  const today = new Date().toISOString().split("T")[0];
  const [newDate, setNewDate] = useState(data.dueDate || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(data.dbId, newDate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Extend Due Date
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Item: {data.itemName}
            </label>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1f2937] border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2">
              <Calendar
                size={18}
                className="text-indigo-500 dark:text-indigo-400"
              />

              <input
                type="date"
                min={today}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="bg-transparent text-gray-800 dark:text-gray-200 outline-none w-full"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                loading
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? "Updating..." : "Update Date"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDueDateModal;

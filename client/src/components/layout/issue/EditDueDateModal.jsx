import { Calendar, X } from "lucide-react";
import { useState } from "react";

const EditDueDateModal = ({ data, onClose, onUpdate, loading }) => {
  const [newDate, setNewDate] = useState(data.dueDate || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(data.dbId, newDate);
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      <div className='bg-[#111827] w-full max-w-md rounded-xl shadow-2xl border border-gray-800 animate-in zoom-in duration-200'>
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-800'>
          <h2 className='text-xl font-bold text-indigo-400'>Extend Due Date</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-6 space-y-4'>
          <div className='space-y-2'>
            <label className='text-xs font-semibold text-gray-400 uppercase'>
              Item: {data.itemName}
            </label>
            <div className='flex items-center gap-2 bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2'>
              <Calendar size={18} className='text-indigo-400' />
              <input
                type='date'
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className='bg-transparent text-gray-200 outline-none w-full'
                required
              />
            </div>
          </div>

          <div className='flex justify-end gap-3 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 text-gray-400 hover:text-white text-sm'
            >
              Cancel
            </button>
            <button
              type='submit'
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

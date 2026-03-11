import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardEdit,
  User,
  X,
} from "lucide-react";
import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const ReturnItemModal = ({ data, onClose, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  // Custom Toast State
  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const [formData, setFormData] = useState({
    returnedBy: "",
    returnDate: new Date().toISOString().split("T")[0],
    conditionStatus: "Good",
    remarks: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmReturn = async () => {
    if (!formData.returnedBy.trim()) {
      alert("Please enter who is returning the item.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        // Nested object matches your IssuedItem.java @ManyToOne link
        issuedItem: {
          id: data.dbId,
        },
        returnDate: formData.returnDate,
        returnedBy: formData.returnedBy.trim(),
        conditionStatus: formData.conditionStatus,
        remarks: formData.remarks.trim(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/api/inventory/issue/return`,
        payload,
      );

      if (response.status === 200) {
        // Wait 2 seconds so user sees the message before modal unmounts
        setTimeout(async () => {
          await onRefresh();
          onClose();
        }, 1000);

        // Trigger Success Toast
        setSuccessToast({
          show: true,
          message: "Return processed successfully!",
        });
      }
    } catch (error) {
      const errorMsg = error.response?.data || "Backend Error";
      console.error("Return Process Failed:", errorMsg);
      alert(
        typeof errorMsg === "string" ? errorMsg : "Check console for details",
      );
      setLoading(false);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4'
      onClick={onClose}
    >
      {/* --- Custom Success Toast --- */}
      {successToast.show && (
        <div className='fixed top-5 right-5 z-110 flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-right-4 duration-300'>
          <CheckCircle2 size={20} />
          <span className='font-medium'>{successToast.message}</span>
        </div>
      )}

      <div
        className='bg-[#111827] w-full max-w-md rounded-2xl p-6 border border-gray-700 shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-xl font-bold text-white flex items-center gap-2'>
            <AlertCircle className='text-amber-500' /> Process Return
          </h3>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-white transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        <div className='space-y-4'>
          {/* Quick Summary */}
          <div className='p-3 bg-gray-800/50 rounded-lg border border-gray-700'>
            <p className='text-xs text-gray-500 uppercase font-bold mb-1'>
              Item Details
            </p>
            <p className='text-sm text-gray-200 font-medium'>{data.itemName}</p>
            <p className='text-[10px] text-indigo-400 font-mono mt-1'>
              Codes: {data.categoryCode}
            </p>
          </div>

          {/* Return Date */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-300 flex items-center gap-2'>
              <Calendar size={14} className='text-indigo-400' /> Return Date
            </label>
            <input
              type='date'
              name='returnDate'
              value={formData.returnDate}
              onChange={handleChange}
              className='w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500'
            />
          </div>

          {/* Returned By */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-300 flex items-center gap-2'>
              <User size={14} className='text-indigo-400' /> Returned By
            </label>
            <input
              type='text'
              name='returnedBy'
              value={formData.returnedBy}
              onChange={handleChange}
              placeholder='Enter person name'
              className='w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500'
            />
          </div>

          {/* Condition Status */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-300'>
              Condition Status
            </label>
            <select
              name='conditionStatus'
              value={formData.conditionStatus}
              onChange={handleChange}
              className='w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500'
            >
              <option value='Good'>Good / Functional</option>
              <option value='Damaged'>Damaged</option>
              <option value='Under Repair'>Under Repair</option>
              <option value='Lost'>Lost</option>
            </select>
          </div>

          {/* Remarks */}
          <div className='flex flex-col gap-1'>
            <label className='text-sm font-semibold text-gray-300 flex items-center gap-2'>
              <ClipboardEdit size={14} className='text-indigo-400' /> Remarks
            </label>
            <textarea
              name='remarks'
              value={formData.remarks}
              onChange={handleChange}
              placeholder='Any observations or notes...'
              rows='2'
              className='w-full bg-[#1f2937] border border-gray-600 rounded-lg px-3 py-2 text-white outline-none resize-none focus:border-indigo-500'
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-3 mt-6'>
          <button
            type='button'
            onClick={onClose}
            className='px-4 py-2 text-gray-400 hover:text-white transition-colors'
          >
            Cancel
          </button>
          <button
            type='button'
            onClick={handleConfirmReturn}
            disabled={loading}
            className='bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg font-bold disabled:bg-gray-800 transition-all flex items-center justify-center min-w-35'
          >
            {loading
              ? successToast.show
                ? "Success!"
                : "Processing..."
              : "Complete Return"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnItemModal;

import {
  Calendar,
  Hash,
  MapPin,
  Package,
  StickyNote,
  User,
  X,
} from "lucide-react";

const IssueDetailModal = ({ data, onClose }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4'>
      {/* Increased width from max-w-lg to max-w-2xl */}
      <div className='bg-[#111827] w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in zoom-in duration-200'>
        {/* Header - slightly tighter padding */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-800'>
          <div>
            <h2 className='text-xl font-bold text-indigo-400'>Issue Details</h2>
            <p className='text-gray-400 text-xs mt-0.5'>
              Detailed view of the issued inventory item
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors'
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - reduced space-y and padding */}
        <div className='p-6 space-y-4'>
          {/* Row 1: Category & Username */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <Package size={14} className='text-indigo-400' /> Category
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.itemName}
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <User size={14} className='text-indigo-400' /> Issued By
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.user}
              </div>
            </div>
          </div>

          {/* Row 2: Item Code & Issued To */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <Hash size={14} className='text-indigo-400' /> Item Code
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.categoryCode || "N/A"}
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <MapPin size={14} className='text-indigo-400' /> Issued To
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.location}
              </div>
            </div>
          </div>

          {/* Row 3: Dates */}
          <div className='grid grid-cols-2 gap-6'>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <Calendar size={14} className='text-indigo-400' /> Issue Date
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.issueDate}
              </div>
            </div>
            <div className='space-y-1.5'>
              <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
                <Calendar size={14} className='text-indigo-400' /> Due Date
              </label>
              <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 text-sm'>
                {data.dueDate}
              </div>
            </div>
          </div>

          {/* Row 4: Notes - reduced min-height */}
          <div className='space-y-1.5'>
            <label className='flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider'>
              <StickyNote size={14} className='text-indigo-400' /> Internal
              Notes
            </label>
            <div className='w-full bg-[#1f2937] border border-gray-700 rounded-lg px-4 py-3 text-gray-400 italic text-sm min-h-[80px]'>
              {data.notes ||
                "No additional notes provided for this transaction."}
            </div>
          </div>
        </div>

        {/* Footer - tighter padding */}
        <div className='px-6 py-4 bg-[#0f172a] border-t border-gray-800 flex justify-end'>
          <button
            onClick={onClose}
            className='px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;

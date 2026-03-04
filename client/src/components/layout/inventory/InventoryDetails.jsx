import { Hash, Info, Layers, MapPin, Package, Tag, X } from "lucide-react";

const InventoryDetails = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200 max-h-[95vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          <X size={18} />
        </button>

        {/* Header - Reduced margin bottom */}
        <header className='mb-6 border-b border-gray-100 dark:border-gray-800 pb-3'>
          <h2 className='text-2xl font-bold text-indigo-600 dark:text-indigo-400'>
            Item Details
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            Record View for {item.itemCode}
          </p>
        </header>

        {/* Grid - Reduced vertical gap */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5'>
          <DetailBlock
            icon={<Package size={16} />}
            label='Item Name'
            value={item.itemName}
          />
          <DetailBlock
            icon={<Hash size={16} />}
            label='Item Code'
            value={item.itemCode}
          />
          <DetailBlock
            icon={<Tag size={16} />}
            label='Category'
            value={item.category}
          />
          <DetailBlock
            icon={<MapPin size={16} />}
            label='Location'
            value={item.location}
          />

          {/* Styled Quantity Box - Tighter padding */}
          <div className='flex flex-col bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800'>
            <label className='text-[10px] font-bold uppercase text-indigo-500 dark:text-indigo-400 mb-0.5'>
              Stock Level
            </label>
            <div className='flex items-baseline gap-2'>
              <span className='text-2xl font-black text-gray-900 dark:text-white'>
                {item.quantity}
              </span>
              <span className='text-xs font-medium text-gray-500'>
                {item.itemType || "Units"}
              </span>
            </div>
          </div>

          <DetailBlock
            icon={<Layers size={16} />}
            label='Item Type'
            value={item.itemType}
          />

          {/* Description - Reduced top padding */}
          <div className='col-span-1 md:col-span-2 flex flex-col pt-3 border-t border-gray-100 dark:border-gray-800'>
            <div className='flex items-center gap-2 mb-1 text-gray-400'>
              <Info size={14} />
              <label className='text-[10px] font-bold uppercase'>
                Description
              </label>
            </div>
            <p className='text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-3 rounded-lg italic'>
              {item.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Footer - Reduced top margin */}
        <div className='flex justify-end mt-6'>
          <button
            className='bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-semibold transition-all shadow-md text-sm'
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailBlock = ({ label, value, icon }) => (
  <div className='flex flex-col border-l-2 border-indigo-500/20 pl-4'>
    <div className='flex items-center gap-2 mb-0.5 text-gray-400'>
      {icon}
      <label className='text-[10px] font-bold uppercase tracking-wider'>
        {label}
      </label>
    </div>
    <span className='text-base font-semibold'>{value || "—"}</span>
  </div>
);

export default InventoryDetails;

import { Hash, Info, Layers, MapPin, Package, Tag, X } from "lucide-react";

const InventoryDetails = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div
      className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4'
      onClick={onClose}
    >
      <div
        className='bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 w-full max-w-2xl rounded-2xl shadow-2xl p-8 relative border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in duration-200'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className='absolute top-5 right-5 text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800'
        >
          <X size={20} />
        </button>

        <header className='mb-8 border-b border-gray-100 dark:border-gray-800 pb-4'>
          <h2 className='text-3xl font-bold text-indigo-600 dark:text-indigo-400'>
            Item Details
          </h2>
          <p className='text-gray-500 dark:text-gray-400'>
            Record View for {item.itemCode}
          </p>
        </header>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
          <DetailBlock
            icon={<Package size={18} />}
            label='Item Name'
            value={item.itemName}
          />
          <DetailBlock
            icon={<Hash size={18} />}
            label='Item Code'
            value={item.itemCode}
          />
          <DetailBlock
            icon={<Tag size={18} />}
            label='Category'
            value={item.category}
          />
          <DetailBlock
            icon={<MapPin size={18} />}
            label='Location'
            value={item.location}
          />

          {/* Styled Quantity Box */}
          <div className='flex flex-col bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800'>
            <label className='text-xs font-bold uppercase text-indigo-500 dark:text-indigo-400 mb-1'>
              Stock Level
            </label>
            <div className='flex items-baseline gap-2'>
              <span className='text-3xl font-black text-gray-900 dark:text-white'>
                {item.quantity}
              </span>
              <span className='text-sm font-medium text-gray-500'>
                {item.itemType || "Units"}
              </span>
            </div>
          </div>

          <DetailBlock
            icon={<Layers size={18} />}
            label='Item Type'
            value={item.itemType}
          />

          {/* Description */}
          <div className='col-span-1 md:col-span-2 flex flex-col pt-4 border-t border-gray-100 dark:border-gray-800'>
            <div className='flex items-center gap-2 mb-2 text-gray-400'>
              <Info size={16} />
              <label className='text-xs font-bold uppercase'>Description</label>
            </div>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800/40 p-4 rounded-lg italic'>
              {item.description || "No description provided."}
            </p>
          </div>
        </div>

        <div className='flex justify-end mt-10'>
          <button
            className='bg-gray-900 dark:bg-indigo-600 hover:bg-gray-800 dark:hover:bg-indigo-700 text-white px-10 py-2.5 rounded-xl font-semibold transition-all shadow-lg'
            onClick={onClose}
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailBlock = ({ label, value, icon }) => (
  <div className='flex flex-col border-l-2 border-indigo-500/20 pl-4'>
    <div className='flex items-center gap-2 mb-1 text-gray-400'>
      {icon}
      <label className='text-xs font-bold uppercase tracking-wider'>
        {label}
      </label>
    </div>
    <span className='text-lg font-semibold'>{value || "—"}</span>
  </div>
);

export default InventoryDetails;

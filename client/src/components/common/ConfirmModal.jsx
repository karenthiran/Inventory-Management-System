import { AlertTriangle, X } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onClose,
  confirmText = "Delete",
  isDanger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm'>
      <div className='bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden'>
        <div className='flex justify-end p-2'>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          >
            <X size={20} />
          </button>
        </div>
        <div className='px-6 pb-6 text-center'>
          <div
            className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${isDanger ? "bg-red-100 dark:bg-red-900/30 text-red-600" : "bg-indigo-100 text-indigo-600"}`}
          >
            <AlertTriangle size={24} />
          </div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            {title}
          </h3>
          <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
            {message}
          </p>
          <div className='mt-6 flex gap-3'>
            <button
              onClick={onClose}
              className='flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 transition'
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-indigo-600 hover:bg-indigo-700"}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;

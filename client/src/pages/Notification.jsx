import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const navigate = useNavigate();

  const closePopup = () => {
    navigate(-1);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-end z-50">
      <div className="w-96 h-full bg-white dark:bg-gray-800 shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Notifications
          </h2>

          <X size={20} className="cursor-pointer" onClick={closePopup} />
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            Item issued successfully
          </div>

          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            Low stock warning
          </div>

          <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
            Maintenance scheduled
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;

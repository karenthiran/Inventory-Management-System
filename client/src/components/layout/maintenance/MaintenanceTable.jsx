import React from "react";
import { Pencil } from "lucide-react";

const MaintenanceTable = ({
  currentRows,
  setFormData,
  setEditId,
  setShowRequest,
}) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
      case "In-progress":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "Completed":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      default:
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    }
  };

  return (
    <div
      className="
        rounded-2xl border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-800
        shadow-sm overflow-hidden
        transition-colors duration-300
      "
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* HEADER (Same as ReturnTable) */}
          <thead
            className="
              bg-gray-100 dark:bg-gray-700
              text-gray-600 dark:text-gray-300
              text-xs uppercase tracking-wider
            "
          >
            <tr>
              <th className="px-6 py-4 text-left font-semibold">User ID</th>
              <th className="px-6 py-4 text-left font-semibold">Item Code</th>
              <th className="px-6 py-4 text-left font-semibold">Item Name</th>
              <th className="px-6 py-4 text-left font-semibold">User</th>
              <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">
                Submitted Date
              </th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-center font-semibold">Action</th>
            </tr>
          </thead>

          {/* BODY (Same row structure style as ReturnTable) */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentRows.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="py-10 text-center text-gray-500 dark:text-gray-400"
                >
                  No maintenance records found.
                </td>
              </tr>
            ) : (
              currentRows.map((item) => (
                <tr
                  key={item.id}
                  className="
                    hover:bg-gray-50 dark:hover:bg-gray-700/40
                    transition-colors duration-200
                  "
                >
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200 font-medium">
                    {item.userId}
                  </td>

                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {item.number}
                  </td>

                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {item.name}
                  </td>

                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {item.user}
                  </td>

                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {item.date}
                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                        item.status,
                      )}`}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setFormData({
                          userId: item.userId,
                          username: item.user,
                          itemName: item.name,
                          itemCode: item.number,
                          quantity: item.quantity || "",
                          type: "",
                          description: "",
                          status: item.status,
                        });

                        setEditId(item.id);
                        setShowRequest(true);
                      }}
                      className="
                        inline-flex items-center justify-center
                        p-2 rounded-lg
                        bg-indigo-50 dark:bg-indigo-900/40
                        text-indigo-600 dark:text-indigo-300
                        hover:bg-indigo-100 dark:hover:bg-indigo-900
                        transition
                      "
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;

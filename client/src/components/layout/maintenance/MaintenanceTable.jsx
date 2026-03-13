const MaintenanceTable = ({
  currentRows,
  setFormData,
  setEditId,
  setShowRequest,
  onStatusChange,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user.role?.trim().toUpperCase();

  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className='bg-[#f9fafb] dark:bg-gray-800 rounded-2xl overflow-hidden transition-colors duration-300'>
      <div className='overflow-x-auto'>
        <table className='w-full table-fixed text-sm text-center border-none'>
          <thead className='bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[15px] font-semibold uppercase'>
            <tr>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-200'>
                ID
              </th>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-200'>
                Item Name
              </th>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-200'>
                Type
              </th>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-200'>
                Received From
              </th>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 text-center dark:text-gray-200'>
                Qty
              </th>
              <th className='p-4 text-xs font-bold uppercase text-gray-600 dark:text-gray-200'>
                Status
              </th>
              {role === "SUPER_ADMIN" && (
                <th className='p-4 text-xs font-bold uppercase text-gray-600 text-center dark:text-gray-200'>
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row) => (
              <tr
                key={row.requestId}
                className='hover:bg-gray-100 dark:hover:bg-gray-700/60 transition duration-200'
              >
                <td className='p-4 text-sm dark:text-gray-300'>
                  #{row.requestId}
                </td>
                <td className='px-6 py-4'>
                  <div className='flex flex-col'>
                    <span className='text-sm font-bold dark:text-white'>
                      {row.itemName}
                    </span>
                    <span className='text-xs text-gray-500'>
                      Code: {row.itemCode}
                    </span>
                  </div>
                </td>
                <td className='p-4 text-sm dark:text-gray-400'>
                  {row.itemType}
                </td>
                <td className='p-4 text-sm dark:text-gray-300'>
                  {row.receivedFrom}
                </td>
                <td className='p-4 text-sm dark:text-gray-300 text-center'>
                  {row.quantity}
                </td>

                <td className='px-6 py-4'>
                  <select
                    value={row.status}
                    onChange={(e) =>
                      onStatusChange(row.requestId, e.target.value)
                    }
                    className={`text-[10px] font-bold px-2 py-1 rounded-full outline-none cursor-pointer ${getStatusStyles(row.status)}`}
                  >
                    <option value='PENDING'>PENDING</option>
                    <option value='IN_PROGRESS'>IN PROGRESS</option>
                    <option value='COMPLETED'>COMPLETED</option>
                  </select>
                </td>

                {role === "SUPER_ADMIN" && (
                  <td className='p-4 text-center'>
                    <button
                      onClick={() => {
                        setFormData(row);
                        setEditId(row.requestId);
                        setShowRequest(true);
                      }}
                      className='text-indigo-600 hover:text-indigo-800 font-bold text-sm'
                    >
                      Edit
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenanceTable;

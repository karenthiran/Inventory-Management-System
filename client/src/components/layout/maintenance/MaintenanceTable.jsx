const MaintenanceTable = ({
  currentRows,
  setFormData,
  setEditId,
  setShowRequest,
  onStatusChange,
}) => {
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
    <div className='overflow-x-auto'>
      <table className='w-full text-left'>
        <thead className='bg-gray-50 dark:bg-gray-700'>
          <tr>
            <th className='p-4 text-xs font-bold uppercase text-gray-500'>
              ID
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500'>
              Item Name
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500'>
              Type
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500'>
              Received From
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500 text-center'>
              Qty
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500'>
              Status
            </th>
            <th className='p-4 text-xs font-bold uppercase text-gray-500 text-center'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
          {currentRows.map((row) => (
            <tr
              key={row.requestId}
              className='hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors'
            >
              <td className='p-4 text-sm dark:text-gray-300'>
                #{row.requestId}
              </td>
              <td className='p-4'>
                <div className='flex flex-col'>
                  <span className='text-sm font-bold dark:text-white'>
                    {row.itemName}
                  </span>
                  <span className='text-xs text-gray-500'>
                    Code: {row.itemCode}
                  </span>
                </div>
              </td>
              <td className='p-4 text-sm dark:text-gray-400'>{row.itemType}</td>
              <td className='p-4 text-sm dark:text-gray-300'>
                {row.receivedFrom}
              </td>
              <td className='p-4 text-sm dark:text-gray-300 text-center'>
                {row.quantity}
              </td>

              <td className='p-4'>
                <select
                  value={row.status}
                  onChange={(e) =>
                    onStatusChange(row.requestId, e.target.value)
                  }
                  className={`text-[10px] font-bold px-2 py-1 rounded-full border outline-none cursor-pointer ${getStatusStyles(row.status)}`}
                >
                  <option value='PENDING'>PENDING</option>
                  <option value='IN_PROGRESS'>IN PROGRESS</option>
                  <option value='COMPLETED'>COMPLETED</option>
                </select>
              </td>

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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;

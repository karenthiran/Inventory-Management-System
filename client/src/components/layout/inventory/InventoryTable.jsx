const InventoryTable = ({ columns, data }) => {
  return (
    <div className="bg-[#f9fafb] rounded-2xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          {/* Header */}
          <thead className="bg-gray-100 text-gray-500 text-xs font-semibold uppercase">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-8 py-5 tracking-wide">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-gray-100 hover:bg-gray-50 transition duration-200"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-8 py-6 text-gray-700 font-medium"
                  >
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;

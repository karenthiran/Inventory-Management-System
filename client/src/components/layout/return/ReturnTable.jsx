const ReturnTable = ({ columns, data }) => {
  const getColWidth = (col) => {
    const key = (col.accessor || col.header || "").toLowerCase();

    if (key.includes("no")) return "w-[70px]";
    if (key.includes("item")) return "w-[200px]"; // Wider for Item Category names
    if (key.includes("issued to")) return "w-[180px]";
    if (key.includes("returned by")) return "w-[180px]";
    if (key.includes("date")) return "w-[150px]";
    if (key.includes("condition")) return "w-[130px]";
    if (key.includes("view")) return "w-[90px]";

    return "w-auto";
  };

  const getAlignClass = (col) => {
    const key = (col.accessor || col.header || "").toLowerCase();

    if (key.includes("no")) return "text-left";
    if (key.includes("date") || key.includes("condition")) return "text-center";
    if (key.includes("action") || key.includes("view")) return "text-center";

    return "text-left";
  };

  const getNoWrap = (col) => {
    const key = (col.accessor || col.header || "").toLowerCase();
    if (
      key.includes("date") ||
      key.includes("issued to") ||
      key.includes("returned by")
    ) {
      return "whitespace-nowrap";
    }
    return "";
  };

  return (
    <div
      className='bg-[#f9fafb] dark:bg-gray-800 
    rounded-2xl border border-gray-200 dark:border-gray-700 
    overflow-hidden transition-colors duration-300'
    >
      <div className='overflow-x-auto'>
        <table className='w-full table-fixed text-sm text-left'>
          {/* Column widths */}
          <colgroup>
            {columns.map((col, index) => (
              <col key={index} className={getColWidth(col)} />
            ))}
          </colgroup>

          {/* Header */}
          <thead
            className='bg-gray-200 dark:bg-gray-700 
          text-gray-600 dark:text-gray-300 
          text-[15px] font-semibold uppercase'
          >
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 tracking-wide 
                  ${getAlignClass(col)} ${getNoWrap(col)}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className='border-t border-gray-200 dark:border-gray-700 
                  hover:bg-gray-100 dark:hover:bg-gray-700/60 
                  transition duration-200'
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 
                      text-neutral-900 dark:text-gray-200 
                      text-[13px] font-medium align-middle 
                      ${getAlignClass(col)} ${getNoWrap(col)}`}
                    >
                      {/* Passing rowIndex as the second argument fixes the NaN issue */}
                      {col.render
                        ? col.render(row, rowIndex)
                        : row[col.accessor] || "—"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className='px-6 py-10 text-center text-gray-500 dark:text-gray-400'
                >
                  No return records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReturnTable;

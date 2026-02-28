import React from "react";

const HomeDataTable = ({ columns, data }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 
    rounded-2xl shadow-sm dark:shadow-none 
    border border-gray-200 dark:border-gray-700 
    overflow-hidden transition-colors duration-300"
    >
      <table className="w-full text-sm text-left">
        {/* Header */}
        <thead
          className="bg-gray-100 dark:bg-gray-700 
        text-gray-600 dark:text-gray-300 
        uppercase text-xs"
        >
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/60 
              transition-colors duration-200"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-6 py-4 text-gray-700 dark:text-gray-200"
                >
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeDataTable;

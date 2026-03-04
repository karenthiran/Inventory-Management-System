// import React, { useState, useMemo, useEffect } from "react";
// import {
//   LayoutGrid,
//   FileText,
//   Filter,
//   DownloadCloud,
//   Trash2,
//   Calendar,
// } from "lucide-react";
// import PaginationBar from "../components/common/PaginationBar";

// const Report = () => {
//   const pageSize = 5;

//   const [downloadOpen, setDownloadOpen] = useState(false);
//   const [reportFormat, setReportFormat] = useState("PDF");
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [filterOption, setFilterOption] = useState("All");
//   const [typeFilter, setTypeFilter] = useState("");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);

//   const tableData = [
//     { type: "Issued", date: "2023-07-10" },
//     { type: "Return", date: "2023-07-11" },
//     { type: "Maintenance", date: "2023-07-12" },
//     { type: "Complete Report", date: "2023-07-13" },
//     { type: "Return", date: "2023-07-14" },
//     { type: "Issued", date: "2023-07-15" },
//     { type: "Maintenance", date: "2023-07-16" },
//     { type: "Return", date: "2023-07-17" },
//     { type: "Complete Report", date: "2023-07-18" },
//     { type: "Issued", date: "2023-07-19" },
//     { type: "Return", date: "2023-07-20" },
//   ];

//   // ================= FILTER =================
//   const filteredData = useMemo(() => {
//     return tableData.filter((item) => {
//       const matchDropdown =
//         filterOption === "All" || item.type === filterOption;

//       const matchType =
//         typeFilter === "" ||
//         item.type.toLowerCase().includes(typeFilter.toLowerCase());

//       const matchFrom = !fromDate || item.date >= fromDate;
//       const matchTo = !toDate || item.date <= toDate;

//       return matchDropdown && matchType && matchFrom && matchTo;
//     });
//   }, [filterOption, typeFilter, fromDate, toDate]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [filterOption, typeFilter, fromDate, toDate]);

//   const totalPages = Math.ceil(filteredData.length / pageSize);
//   const paginatedData = filteredData.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   // ================= GENERATE =================
//   const handleGenerate = () => {
//     if (!fromDate || !toDate) {
//       alert("Please select Date From and Date To");
//       return;
//     }

//     const content = filteredData
//       .map((item, index) => `${index + 1}. ${item.type} - ${item.date}`)
//       .join("\n");

//     const blob = new Blob([content], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `report.${reportFormat.toLowerCase()}`;
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
//       {/* ================= OVERVIEW ================= */}
//       <div className="mb-12">
//         <div className="flex items-center gap-2 mb-6">
//           <LayoutGrid size={18} className="text-indigo-600" />
//           <h2 className="text-lg font-semibold">Overview</h2>
//         </div>

//         <div className="flex items-center gap-4 flex-wrap">
//           {/* FORMAT DROPDOWN */}
//           <div className="px-6 py-3 rounded-2xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
//             <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
//               Generate Report by
//             </span>
//           </div>

//           {/* TYPE */}
//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="px-6 py-3 border rounded-2xl bg-white dark:bg-gray-800"
//           >
//             <option value="">Select type</option>
//             <option value="Issued">Issued</option>
//             <option value="Return">Return</option>
//             <option value="Maintenance">Maintenance</option>
//             <option value="Complete Report">Complete Report</option>
//           </select>

//           <div className="relative">
//             <Calendar
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//             />

//             <input
//               type="text"
//               placeholder="Date From"
//               value={fromDate}
//               onFocus={(e) => (e.target.type = "date")}
//               onBlur={(e) => {
//                 if (!e.target.value) e.target.type = "text";
//               }}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="pl-12 pr-4 py-3 w-56
//     rounded-2xl
//     border border-gray-300 dark:border-gray-600
//     bg-white dark:bg-gray-800
//     text-gray-800 dark:text-gray-100
//     focus:outline-none focus:ring-2 focus:ring-indigo-500
//     transition"
//             />
//           </div>

//           {/* DATE TO */}
//           <div className="relative">
//             <Calendar
//               size={18}
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
//             />

//             <input
//               type="text"
//               placeholder="Date To"
//               value={toDate}
//               onFocus={(e) => (e.target.type = "date")}
//               onBlur={(e) => {
//                 if (!e.target.value) e.target.type = "text";
//               }}
//               onChange={(e) => setToDate(e.target.value)}
//               className="pl-12 pr-4 py-3 w-56
//     rounded-2xl
//     border border-gray-300 dark:border-gray-600
//     bg-white dark:bg-gray-800
//     text-gray-800 dark:text-gray-100
//     focus:outline-none focus:ring-2 focus:ring-indigo-500
//     transition"
//             />
//           </div>

//           <button
//             onClick={handleGenerate}
//             className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700"
//           >
//             Generate
//           </button>
//         </div>
//       </div>

//       {/* ================= RECENT REPORTS ================= */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex items-center gap-2">
//           <FileText size={18} className="text-indigo-600" />
//           <h2 className="text-lg font-semibold">Recent Reports</h2>
//         </div>

//         <div className="relative">
//           <button
//             onClick={() => setFilterOpen(!filterOpen)}
//             className="flex items-center gap-2 px-6 py-2 border rounded-2xl bg-white dark:bg-gray-800"
//           >
//             <Filter size={16} />
//             Filter by {filterOption !== "All" && `: ${filterOption}`}
//           </button>

//           {filterOpen && (
//             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-xl shadow-lg">
//               {[
//                 "All",
//                 "Issued",
//                 "Return",
//                 "Maintenance",
//                 "Complete Report",
//               ].map((item) => (
//                 <div
//                   key={item}
//                   onClick={() => {
//                     setFilterOption(item);
//                     setFilterOpen(false);
//                   }}
//                   className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
//                 >
//                   {item}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border overflow-hidden">
//         <table className="w-full text-left text-sm">
//           <thead className="bg-gray-200 dark:bg-gray-700">
//             <tr className="uppercase text-blue-600 dark:text-blue-400 font-bold text-xs">
//               <th className="px-6 py-4">NO.</th>
//               <th className="px-6 py-4">REPORT TYPE</th>
//               <th className="px-6 py-4">DATE</th>
//               <th className="px-6 py-4">VIEW</th>
//               <th className="px-6 py-4">ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedData.map((item, index) => (
//               <tr
//                 key={index}
//                 className="border-t hover:bg-gray-50 dark:hover:bg-gray-700"
//               >
//                 <td className="px-6 py-4">{index + 1}</td>
//                 <td className="px-6 py-4">{item.type}</td>
//                 <td className="px-6 py-4">{item.date}</td>
//                 <td className="px-6 py-4 text-indigo-600">
//                   <DownloadCloud size={16} />
//                 </td>
//                 <td className="px-6 py-4 text-red-500">
//                   <Trash2 size={16} />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= PAGINATION ================= */}
//       <div className="flex justify-between items-center mt-6">
//         <span>
//           Page {currentPage} of {totalPages}
//         </span>

//         <div className="flex gap-2">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Prev
//           </button>

//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             className="px-3 py-1 border rounded disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;

import React, { useState, useMemo, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Filter,
  DownloadCloud,
  Trash2,
  Calendar,
} from "lucide-react";
import PaginationBar from "../components/common/PaginationBar";

const Report = () => {
  const pageSize = 5;

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const [typeFilter, setTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [tableData, setTableData] = useState([
    { id: 1, type: "Issued", date: "2023-07-10" },
    { id: 2, type: "Return", date: "2023-07-11" },
    { id: 3, type: "Maintenance", date: "2023-07-12" },
    { id: 4, type: "Complete Report", date: "2023-07-13" },
    { id: 5, type: "Return", date: "2023-07-14" },
    { id: 6, type: "Issued", date: "2023-07-15" },
    { id: 7, type: "Maintenance", date: "2023-07-16" },
    { id: 8, type: "Return", date: "2023-07-17" },
    { id: 9, type: "Complete Report", date: "2023-07-18" },
    { id: 10, type: "Issued", date: "2023-07-19" },
    { id: 11, type: "Return", date: "2023-07-20" },
  ]);

  //handle delete

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this report?",
    );

    if (!confirmDelete) return;

    const updatedData = tableData.filter((item) => item.id !== id);

    setTableData(updatedData);
  };

  // ================= FILTER =================
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchDropdown =
        filterOption === "All" || item.type === filterOption;

      const matchType =
        typeFilter === "" ||
        item.type.toLowerCase().includes(typeFilter.toLowerCase());

      const matchFrom = !fromDate || item.date >= fromDate;
      const matchTo = !toDate || item.date <= toDate;

      return matchDropdown && matchType && matchFrom && matchTo;
    });
  }, [tableData, filterOption, typeFilter, fromDate, toDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [tableData, filterOption, typeFilter, fromDate, toDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  //pagination after delete
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [tableData, totalPages, currentPage]);

  // ================= GENERATE =================
  const handleGenerate = () => {
    if (!fromDate || !toDate) {
      alert("Please select Date From and Date To");
      return;
    }

    if (filteredData.length === 0) {
      alert("No data available for selected filters.");
      return;
    }

    const content = filteredData
      .map((item, index) => `${index + 1}. ${item.type} - ${item.date}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-report.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* ================= OVERVIEW ================= */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <LayoutGrid
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h1 className="text-xl font-semibold">Overview</h1>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Static Text */}
          <div>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Generate Report by
            </span>
          </div>

          {/* TYPE FILTER */}
          <div className="relative w-56">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full appearance-none px-5 py-3 pr-10 rounded-xl border 
               bg-white dark:bg-gray-800 
               border-gray-300 dark:border-gray-600 
               text-gray-700 dark:text-gray-200
               focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               outline-none transition-all duration-200"
            >
              <option value="">Select type</option>
              <option value="Issued">Issued</option>
              <option value="Return">Return</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Complete Report">Complete Report</option>
            </select>

            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* DATE FROM */}
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="pl-12 pr-4 py-3 w-56 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* DATE TO */}
          <div className="relative">
            <Calendar
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="pl-12 pr-4 py-3 w-56 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition"
          >
            Generate
          </button>
        </div>
      </div>

      {/* ================= RECENT REPORTS ================= */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <FileText
              size={18}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h2 className="text-lg font-semibold">Recent Reports</h2>
        </div>

        {/* FILTER */}
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-5 py-2 rounded-2xl border bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200"
          >
            <Filter size={16} className="dark:text-gray-300" />
            {filterOption}
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl shadow-lg z-50">
              {[
                "All",
                "Issued",
                "Return",
                "Maintenance",
                "Complete Report",
              ].map((item) => (
                <div
                  key={item}
                  onClick={() => {
                    setFilterOption(item);
                    setFilterOpen(false);
                  }}
                  className="px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition"
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700 text-xs uppercase">
            <tr className="text-indigo-600 dark:text-indigo-400">
              <th className="px-6 py-4">No.</th>
              <th className="px-6 py-4">Report Type</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Download</th>
              <th className="px-6 py-4">Delete</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500 dark:text-gray-400"
                >
                  No reports found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-6 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4">{item.type}</td>
                  <td className="px-6 py-4">{item.date}</td>
                  <td className="px-6 py-4 text-indigo-600 dark:text-indigo-400 cursor-pointer">
                    <DownloadCloud size={16} />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="mt-6">
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Report;

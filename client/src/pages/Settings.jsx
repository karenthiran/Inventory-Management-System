import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Filter,
  DownloadCloud,
  Trash2,
  Calendar,
  BookOpen,
  MapPin,
  UserCircle,
} from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const pageSize = 5;

  const [downloadOpen, setDownloadOpen] = useState(false);
  const [reportFormat, setReportFormat] = useState("PDF");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const [typeFilter, setTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const tableData = [
    { type: "Issued", date: "2023-07-10" },
    { type: "Return", date: "2023-07-11" },
    { type: "Maintenance", date: "2023-07-12" },
    { type: "Complete Report", date: "2023-07-13" },
    { type: "Return", date: "2023-07-14" },
    { type: "Issued", date: "2023-07-15" },
    { type: "Maintenance", date: "2023-07-16" },
    { type: "Return", date: "2023-07-17" }, { type: "Issued", date: "2023-07-10" },
    { type: "Return", date: "2023-07-11" },
    { type: "Maintenance", date: "2023-07-12" },
    { type: "Complete Report", date: "2023-07-13" },
    { type: "Return", date: "2023-07-14" },
    { type: "Issued", date: "2023-07-15" },
    { type: "Maintenance", date: "2023-07-16" },
    { type: "Return", date: "2023-07-17" },
    { type: "Complete Report", date: "2023-07-18" },
  ];

  // FILTER
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
  }, [filterOption, typeFilter, fromDate, toDate]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterOption, typeFilter, fromDate, toDate]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // GENERATE
  const handleGenerate = () => {
    if (!fromDate || !toDate) {
      alert("Please select Date From and Date To");
      return;
    }

    const content = filteredData
      .map((item, index) => `${index + 1}. ${item.type} - ${item.date}`)
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `report.${reportFormat.toLowerCase()}`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">

      {/* NAVIGATION */}
      <div className="flex gap-6 mb-12">
        <button
          onClick={() => navigate("/dashboard/category")}
          className="flex items-center gap-3 px-10 py-4 border-2 border-blue-400 rounded-2xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        >
          <BookOpen size={20} />
          Category
        </button>

        <button
          onClick={() => navigate("/dashboard/location")}
          className="flex items-center gap-3 px-10 py-4 border-2 border-blue-400 rounded-2xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        >
          <MapPin size={20} />
          Location
        </button>

        <button
          onClick={() => navigate("/dashboard/usermanagement")}
          className="flex items-center gap-3 px-10 py-4 border-2 border-blue-400 rounded-2xl bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        >
          <UserCircle size={20} />
          User Management
        </button>
      </div>

      {/* OVERVIEW */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <LayoutGrid size={18} className="text-indigo-600" />
          <h2 className="text-lg font-semibold">Overview</h2>
        </div>

        <div className="flex items-center gap-4 flex-wrap">

          {/* Generate Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDownloadOpen(!downloadOpen)}
              className="px-6 py-3 border rounded-2xl bg-white dark:bg-gray-800"
            >
              Generate Report by 
            </button>

            {downloadOpen && (
              <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 border rounded-xl shadow-lg z-50">
                {["PDF", "CSV", "XLSX", "DOCX", "TXT"].map((format) => (
                  <div
                    key={format}
                    onClick={() => {
                      setReportFormat(format);
                      setDownloadOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {format}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TYPE */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-6 py-3 border rounded-2xl bg-white dark:bg-gray-800"
          >
            <option value="">Select type</option>
            <option value="Issued">Issued</option>
            <option value="Return">Return</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Complete Report">Complete Report</option>
          </select>

          <div className="relative">
  <Calendar
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
  />

  <input
    type="text"
    placeholder="Date From"
    value={fromDate}
    onFocus={(e) => (e.target.type = "date")}
    onBlur={(e) => {
      if (!e.target.value) e.target.type = "text";
    }}
    onChange={(e) => setFromDate(e.target.value)}
    className="pl-12 pr-4 py-3 w-56
    rounded-2xl
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    text-gray-800 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition"
  />
</div>

          {/* DATE TO */}
          <div className="relative">
  <Calendar
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
  />

  <input
    type="text"
    placeholder="Date To"
    value={toDate}
    onFocus={(e) => (e.target.type = "date")}
    onBlur={(e) => {
      if (!e.target.value) e.target.type = "text";
    }}
    onChange={(e) => setToDate(e.target.value)}
    className="pl-12 pr-4 py-3 w-56
    rounded-2xl
    border border-gray-300 dark:border-gray-600
    bg-white dark:bg-gray-800
    text-gray-800 dark:text-gray-100
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition"
  />
</div>
          <button
            onClick={handleGenerate}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl hover:bg-indigo-700"
          >
            Generate
          </button>
        </div>
      </div>

      {/* RECENT REPORTS HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-600" />
          <h2 className="text-lg font-semibold">Recent Reports</h2>
        </div>

        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-6 py-2 border rounded-2xl bg-white dark:bg-gray-800"
          >
            <Filter size={16} />
            Filter by {filterOption !== "All" && `: ${filterOption}`}
          </button>

          {filterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border rounded-xl shadow-lg">
              {["All", "Issued", "Return", "Maintenance", "Complete Report"].map(
                (item) => (
                  <div
                    key={item}
                    onClick={() => {
                      setFilterOption(item);
                      setFilterOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {item}
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr className="uppercase text-blue-600 dark:text-blue-400 font-bold text-xs">
              <th className="px-6 py-4">NO.</th>
              <th className="px-6 py-4">REPORT TYPE</th>
              <th className="px-6 py-4">DATE</th>
              <th className="px-6 py-4">VIEW</th>
              <th className="px-6 py-4">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{item.type}</td>
                <td className="px-6 py-4">{item.date}</td>
                <td className="px-6 py-4 text-indigo-600">
                  <DownloadCloud size={16} />
                </td>
                <td className="px-6 py-4 text-red-500">
                  <Trash2 size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>{/* ================= PAGINATION ================= */}
<div className="flex justify-between items-center mt-6">

  <span className="text-sm text-gray-600 dark:text-gray-400">
    Page {currentPage} of {totalPages}
  </span>

  <div className="flex gap-2">

    {/* PREVIOUS */}
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => prev - 1)}
      className="px-3 py-1 rounded-lg border
      bg-white dark:bg-gray-800
      disabled:opacity-40"
    >
      Prev
    </button>

    {/* PAGE NUMBERS */}
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`w-8 h-8 rounded-full text-sm ${
          currentPage === i + 1
            ? "bg-indigo-600 text-white"
            : "bg-white dark:bg-gray-800 border"
        }`}
      >
        {i + 1}
      </button>
    ))}

    {/* NEXT */}
    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage((prev) => prev + 1)}
      className="px-3 py-1 rounded-lg border
      bg-white dark:bg-gray-800
      disabled:opacity-40"
    >
      Next
    </button>

  </div>
</div>
    </div>
    
  );
};

export default Settings;
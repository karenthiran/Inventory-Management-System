import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, LayoutGrid, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Report = () => {
  const pageSize = 10;

  // Filters
  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Data State
  const [locations, setLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- COLUMN DEFINITIONS BASED ON JPA MODELS ---
  const getColumns = () => {
    switch (typeFilter) {
      case "Inventory":
        return ["Item Code", "Name", "Type", "Category", "Location", "Qty"];
      case "Issued":
        return [
          "Category",
          "Codes",
          "Issued To",
          "Date",
          "Due Date",
          "Qty",
          "Status",
        ];
      case "Return":
        return [
          "Item Category",
          "Inventory Codes",
          "Issued To",
          "Obtained By",
          "Return Date",
          "Condition",
          "Remarks",
        ];
      case "Maintenance":
        return ["Item Code", "Name", "Received From", "Date", "Qty", "Status"];
      default:
        return [];
    }
  };

  // --- DATA MAPPING FOR TABLE & PDF ---
  const mapDataToRows = (data) => {
    return data.map((item) => {
      if (typeFilter === "Inventory") {
        return [
          item.itemCode,
          item.itemName,
          item.itemType?.typeName || "N/A",
          item.category?.categoryName || "N/A",
          item.location?.locationName || "N/A",
          item.quantity,
        ];
      }
      if (typeFilter === "Issued") {
        return [
          item.category?.categoryName || "N/A",
          item.itemCodes?.join(", ") || "N/A",
          item.issuedTo,
          item.issueDate,
          item.dueDate || "N/A",
          item.quantity,
          item.isReturned ? "Returned" : "Active",
        ];
      }
      if (typeFilter === "Return") {
        // Accessing the OneToOne relationship: item.issuedItem
        const issued = item.issuedItem || {};

        return [
          issued.category?.categoryName || "N/A", // Category from IssuedItem
          issued.itemCodes?.join(", ") || "N/A", // Codes from IssuedItem
          issued.issuedTo || "N/A", // Lab/Location from IssuedItem
          issued.username || "N/A", // User (Obtained By) from IssuedItem
          item.returnDate || "N/A", // Date from ReturnedItem
          item.conditionStatus || "N/A", // Status from ReturnedItem
          item.remarks || "No specific remarks", // Remarks from ReturnedItem
        ];
      }
      if (typeFilter === "Maintenance") {
        return [
          item.itemCode,
          item.itemName,
          item.receivedFrom,
          item.requestDate,
          item.quantity,
          item.status,
        ];
      }
      return [];
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF("landscape"); // Landscape fits more columns
      const columns = getColumns();
      const rows = mapDataToRows(filteredData);

      doc.setFontSize(18);
      doc.text("Inventory Management System", 14, 15);
      doc.setFontSize(12);
      doc.text(`${typeFilter} Full Report`, 14, 25);
      doc.setFontSize(10);
      doc.text(
        `Filters: Location: ${locationFilter || "All"} | Range: ${fromDate || "N/A"} to ${toDate || "N/A"}`,
        14,
        32,
      );

      autoTable(doc, {
        head: [columns],
        body: rows,
        startY: 40,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229] },
        styles: { fontSize: 8 }, // Smaller font to fit all database columns
      });

      doc.save(`IMS_Full_Report_${typeFilter}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };

  // --- FETCHING & FILTERING ---
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/locations/all`);
        setLocations(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!typeFilter) return;
      setLoading(true);
      try {
        let endpoint = "";
        if (typeFilter === "Inventory") endpoint = "/api/inventory/all";
        else if (typeFilter === "Issued") endpoint = "/api/inventory/issue/all";
        else if (typeFilter === "Return")
          endpoint = "/api/inventory/issue/returns";
        else if (typeFilter === "Maintenance")
          endpoint = "/api/maintenance/all";

        const res = await axios.get(`${API_BASE_URL}${endpoint}`);
        setTableData(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTableData();
  }, [typeFilter]);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      // Find the correct location and date field based on model type
      const loc = item.location?.locationName || "N/A";
      const date = item.issueDate || item.returnDate || item.requestDate || "";

      const matchLoc = locationFilter === "" || loc === locationFilter;
      const matchFrom = !fromDate || date >= fromDate;
      const matchTo = !toDate || date <= toDate;
      return matchLoc && matchFrom && matchTo;
    });
  }, [tableData, locationFilter, fromDate, toDate]);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        {/* <div className='flex items-center gap-2'>
          <LayoutGrid size={24} className='text-indigo-600' />
          <h1 className='text-2xl font-bold dark:text-white'>System Reports</h1>
        </div> */}

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <FileText
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Report Management
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={generatePDF}
            disabled={filteredData.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm disabled:opacity-50"
          >
            <FileText size={16} /> Export Full PDF
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex flex-wrap gap-6 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Report Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-52"
          >
            <option value="">Select Report Type</option>
            <option value="Inventory">Inventory List</option>
            <option value="Issued">Issued Records</option>
            <option value="Return">Return Records</option>
            <option value="Maintenance">Maintenance Tasks</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="p-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm outline-none w-40"
          >
            <option value="">All Locations</option>
            {locations.map((l) => (
              <option key={l.locationId} value={l.locationName}>
                {l.locationName}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">
            Date Range
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="p-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="p-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
            />
          </div>
        </div>

        {/* This div pushes everything after it to the right */}
        <div className="ml-auto">
          <button
            onClick={() => {
              setTypeFilter("");
              setLocationFilter("");
              setFromDate("");
              setToDate("");
              setTableData([]);
            }}
            className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium"
          >
            <RotateCcw size={16} /> Reset Filters
          </button>
        </div>
      </div>

      {/* DYNAMIC TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin mx-auto text-indigo-600" />
            <p className="mt-2">Fetching Database Records...</p>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  {getColumns().map((col, i) => (
                    <th
                      key={i}
                      className="p-4 text-[11px] font-bold text-gray-500 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {mapDataToRows(paginatedData).map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="p-4 text-sm dark:text-gray-300"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-20 text-center text-gray-500">
            No records found for this model.
          </div>
        )}
      </div>
    </div>
  );
};

export default Report;

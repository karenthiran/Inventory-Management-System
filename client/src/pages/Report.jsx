import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileText, Loader2, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Report = () => {
  const pageSize = 10;

  const [typeFilter, setTypeFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getColumns = () => {
    switch (typeFilter) {
      case "Inventory":
        return [
          "Item Code",
          "Name",
          "Type",
          "Category",
          "Location",
          "Qty",
          "Status",
        ];
      case "Issued":
        return [
          "Item Name",
          "Item Codes",
          "Issued To",
          "Issued By",
          "Issue Date",
          "Expected Return",
          "Qty",
          "Status",
        ];
      case "Return":
        return [
          "Item Name",
          "Item Codes",
          "Issued To",
          "Returned By",
          "Return Date",
          "Condition",
          "Remarks",
        ];
      case "Maintenance":
        return [
          "Item Code",
          "Item Name",
          "Type",
          "Received From",
          "Date",
          "Qty",
          "Status",
        ];
      default:
        return [];
    }
  };

  const mapDataToRows = (data) => {
    return data.map((item) => {
      if (typeFilter === "Inventory") {
        return [
          item.itemCode ?? "N/A",
          item.itemName ?? "N/A",
          item.itemType?.typeName ?? "N/A",
          item.category?.categoryName ?? "N/A",
          item.location?.locationName ?? "N/A",
          item.quantity ?? 0,
          item.status ?? "N/A",
        ];
      }

      if (typeFilter === "Issued") {
        const user = item.issuedTo;
        const issuedToName = user?.username ?? user?.email ?? "N/A";
        const codes = item.itemCodesSnapshot
          ? item.itemCodesSnapshot
          : (item.itemCodes || []).join(", ") || "N/A";

        return [
          item.itemName ?? "N/A",
          codes,
          issuedToName,
          item.issuedBy ?? "N/A",
          item.issueDate ?? "N/A",
          item.expectedReturnDate ?? "N/A",
          item.quantity ?? 0,
          item.isReturned ? "Returned" : "Active",
        ];
      }

      if (typeFilter === "Return") {
        const issued = item.issuedItem ?? {};
        const user = issued.issuedTo;
        const issuedToName = user?.username ?? user?.email ?? "N/A";

        // ✅ use snapshot, fallback to live codes
        const codes = issued.itemCodesSnapshot
          ? issued.itemCodesSnapshot
          : (issued.itemCodes || []).join(", ") || "N/A";

        return [
          issued.itemName ?? "N/A",
          codes,
          issuedToName,
          item.returnedBy ?? "N/A",
          item.returnDate ?? "N/A",
          item.conditionStatus ?? "N/A",
          item.remarks ?? "No remarks",
        ];
      }

      if (typeFilter === "Maintenance") {
        return [
          item.itemCode ?? "N/A",
          item.itemName ?? "N/A",
          item.itemType ?? "N/A",
          item.receivedFrom ?? "N/A",
          item.requestDate ?? "N/A",
          item.quantity ?? 0,
          item.status ?? "N/A",
        ];
      }

      return [];
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF("landscape");
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
        styles: { fontSize: 8 },
      });

      doc.save(`IMS_Report_${typeFilter}.pdf`);
    } catch (error) {
      console.error("PDF Error:", error);
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/locations/all`);
        setLocations(res.data);
      } catch (err) {
        console.error("Failed to fetch locations:", err);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!typeFilter) return;
      setLoading(true);
      setCurrentPage(1);
      try {
        const endpointMap = {
          Inventory: "/api/inventory/all",
          Issued: "/api/issues/all",
          Return: "/api/inventory/issue/returns",
          Maintenance: "/api/maintenance/all",
        };

        const res = await axios.get(
          `${API_BASE_URL}${endpointMap[typeFilter]}`,
        );
        let data = Array.isArray(res.data) ? res.data : [];

        // Normalize itemCodes to always be a plain array
        // Issue.jsx uses: itemCodes: item.itemCodes || []
        // We apply the same normalization here for Issued and Return types
        if (typeFilter === "Issued") {
          data = data.map((item) => ({
            ...item,
            itemCodes: Array.isArray(item.itemCodes)
              ? item.itemCodes
              : Object.values(item.itemCodes || {}),
          }));
        }

        if (typeFilter === "Return") {
          data = data.map((item) => ({
            ...item,
            issuedItem: item.issuedItem
              ? {
                  ...item.issuedItem,
                  itemCodes: Array.isArray(item.issuedItem.itemCodes)
                    ? item.issuedItem.itemCodes
                    : Object.values(item.issuedItem.itemCodes || {}),
                }
              : {},
          }));
        }

        setTableData(data);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTableData();
  }, [typeFilter]);

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      let loc = "N/A";
      if (typeFilter === "Inventory")
        loc = item.location?.locationName ?? "N/A";
      else if (typeFilter === "Issued")
        loc = item.location?.locationName ?? "N/A";
      else if (typeFilter === "Return")
        loc = item.issuedItem?.location?.locationName ?? "N/A";

      const date = item.issueDate ?? item.returnDate ?? item.requestDate ?? "";

      const matchLoc = locationFilter === "" || loc === locationFilter;
      const matchFrom = !fromDate || date >= fromDate;
      const matchTo = !toDate || date <= toDate;
      return matchLoc && matchFrom && matchTo;
    });
  }, [tableData, locationFilter, fromDate, toDate, typeFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className='h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900'>
      {/* Header */}
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-3 mb-10'>
          <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
            <FileText
              size={22}
              className='text-indigo-600 dark:text-indigo-400'
            />
          </div>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Report Management
          </h1>
        </div>
        <button
          onClick={generatePDF}
          disabled={filteredData.length === 0}
          className='flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm disabled:opacity-50 hover:bg-indigo-700 transition'
        >
          <FileText size={16} /> Export Full PDF
        </button>
      </div>

      {/* Filters */}
      <div className='mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm flex flex-wrap gap-6 items-end'>
        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-bold text-gray-400 uppercase ml-1'>
            Report Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className='p-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-52'
          >
            <option value=''>Select Report Type</option>
            <option value='Inventory'>Inventory List</option>
            <option value='Issued'>Issued Records</option>
            <option value='Return'>Return Records</option>
            <option value='Maintenance'>Maintenance Tasks</option>
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-bold text-gray-400 uppercase ml-1'>
            Location
          </label>
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className='p-2.5 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm outline-none w-40'
          >
            <option value=''>All Locations</option>
            {locations.map((l) => (
              <option key={l.locationId} value={l.locationName}>
                {l.locationName}
              </option>
            ))}
          </select>
        </div>

        <div className='flex flex-col gap-2'>
          <label className='text-[10px] font-bold text-gray-400 uppercase ml-1'>
            Date Range
          </label>
          <div className='flex items-center gap-2'>
            <input
              type='date'
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className='p-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm'
            />
            <span className='text-gray-400'>—</span>
            <input
              type='date'
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className='p-2 rounded-xl border dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm'
            />
          </div>
        </div>

        <div className='ml-auto'>
          <button
            onClick={() => {
              setTypeFilter("");
              setLocationFilter("");
              setFromDate("");
              setToDate("");
              setTableData([]);
              setCurrentPage(1);
            }}
            className='flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition shadow-sm text-sm font-medium'
          >
            <RotateCcw size={16} /> Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm  overflow-hidden flex-1'>
        {loading ? (
          <div className='p-20 text-center'>
            <Loader2
              className='animate-spin mx-auto text-indigo-600'
              size={32}
            />
            <p className='mt-3 text-gray-500 dark:text-gray-400'>
              Fetching records...
            </p>
          </div>
        ) : !typeFilter ? (
          <div className='p-20 text-center text-gray-400'>
            Select a report type to view records.
          </div>
        ) : filteredData.length === 0 ? (
          <div className='p-20 text-center text-gray-500'>
            No records found for the selected filters.
          </div>
        ) : (
          <>
            <div className='overflow-x-auto'>
              <table className='w-full text-left'>
                <thead className='bg-gray-200 dark:bg-gray-700'>
                  <tr>
                    {getColumns().map((col, i) => (
                      <th
                        key={i}
                        className='p-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider'
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {mapDataToRows(paginatedData).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className='hover:bg-gray-50 dark:hover:bg-[#ffffff27] transition-colors'
                    >
                      {row.map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          className='p-4 text-sm text-gray-700 dark:text-gray-300'
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className='flex items-center justify-between px-4 py-3 border-t dark:border-gray-700'>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Showing {(currentPage - 1) * pageSize + 1}–
                  {Math.min(currentPage * pageSize, filteredData.length)} of{" "}
                  {filteredData.length} records
                </p>
                <div className='flex gap-2'>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className='px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition'
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className='px-3 py-1.5 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-700 dark:border-gray-600 dark:text-gray-300 transition'
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Report;

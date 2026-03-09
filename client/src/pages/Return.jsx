import axios from "axios";
import {
  Calendar,
  ClipboardList,
  FileText,
  MapPin,
  Package,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PaginationBar from "../components/common/PaginationBar";
import ReturnTable from "../components/layout/return/ReturnTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Return = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const pageSize = 5;

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/inventory/issue/returns`,
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching returns:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const tableColumns = [
    {
      header: "NO.",
      render: (_, index) => (currentPage - 1) * pageSize + index + 1,
    },
    {
      header: "Returned By", // RE-ADDED COLUMN
      accessor: "returnedBy",
    },
    {
      header: "Item Name",
      render: (row) => row.issuedItem?.category?.categoryName || "N/A",
    },
    {
      header: "Issued To",
      render: (row) => row.issuedItem?.issuedTo || "N/A",
    },
    {
      header: "Return Date",
      accessor: "returnDate",
    },
    {
      header: "Condition",
      accessor: "conditionStatus",
    },
    {
      header: "View",
      render: (row) => (
        <button
          type="button"
          onClick={() => setSelectedReturn(row)}
          className="text-indigo-600 font-medium hover:underline cursor-pointer transition-all duration-200"
        >
          Detail
        </button>
      ),
    },
  ];

  const totalResults = tableData.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return tableData.slice(start, start + pageSize);
  }, [currentPage, tableData]);

  return (
    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar Header */}

        <div className="flex items-center gap-3 mb-10">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <FileText
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Return Management
          </h1>
        </div>

        {/* Table Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center text-gray-500 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching records...</span>
            </div>
          ) : (
            <ReturnTable columns={tableColumns} data={paginatedData} />
          )}
        </div>

        {/* Pagination bar */}
        {!loading && totalResults > 0 && (
          <div className="mt-6">
            <PaginationBar
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* --- ENLARGED POPUP MODAL --- */}
        {selectedReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-opacity">
            {/* max-w-3xl for increased width */}
            <div className="bg-white dark:bg-gray-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
              <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-3">
                  <ClipboardList className="text-indigo-500" size={28} /> Full
                  Return Details
                </h3>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Increased padding (p-8) and gap (gap-10) */}
              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-50 dark:border-indigo-900/30 pb-2">
                    Issuance Info
                  </h4>
                  <DetailItem
                    icon={<Package size={20} />}
                    label="Item Category"
                    value={selectedReturn.issuedItem?.category?.categoryName}
                  />
                  <DetailItem
                    icon={<MapPin size={20} />}
                    label="Issued to"
                    value={selectedReturn.issuedItem?.issuedTo}
                  />
                  <DetailItem
                    icon={<User size={20} />}
                    label="obtained by"
                    value={selectedReturn.issuedItem?.username}
                  />
                  <DetailItem
                    icon={<ClipboardList size={20} />}
                    label="Inventory Codes"
                    value={selectedReturn.issuedItem?.itemCodes?.join(", ")}
                  />
                </div>

                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest border-b border-indigo-50 dark:border-indigo-900/30 pb-2">
                    Return Status
                  </h4>
                  <DetailItem
                    icon={<Calendar size={20} />}
                    label="Date Processed"
                    value={selectedReturn.returnDate}
                  />
                  <DetailItem
                    icon={<User size={20} />}
                    label="Returned By"
                    value={selectedReturn.returnedBy}
                  />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                      Condition Status
                    </span>
                    <span
                      className={`mt-2 px-4 py-1.5 rounded-full text-sm font-bold w-fit ${
                        selectedReturn.conditionStatus === "Good"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {selectedReturn.conditionStatus}
                    </span>
                  </div>
                  <DetailItem
                    icon={<FileText size={20} />}
                    label="Admin Remarks"
                    value={
                      selectedReturn.remarks || "No specific remarks provided."
                    }
                  />
                </div>
              </div>

              <div className="px-8 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 text-right">
                <button
                  onClick={() => setSelectedReturn(null)}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-4">
    <div className="text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">
        {label}
      </p>
      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default Return;

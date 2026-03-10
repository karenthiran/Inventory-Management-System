import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Package,
  PackagePlusIcon,
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
  const pageSize = 8; // Adjusted for better screen utilization

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
      header: "Returned By",
      accessor: "returnedBy",
    },
    {
      header: "Item Name",
      // Maps to IssuedItem -> InventoryItem/Category logic from your backend
      render: (row) => row.issuedItem?.itemName || "N/A",
    },
    {
      header: "Original Recipient",
      render: (row) => row.issuedItem?.issuedTo?.email || "N/A",
    },
    {
      header: "Return Date",
      accessor: "returnDate",
    },
    {
      header: "Condition",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            row.conditionStatus === "Good"
              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
              : "bg-amber-100 text-amber-700 border border-amber-200"
          }`}
        >
          {row.conditionStatus}
        </span>
      ),
    },
    {
      header: "View",
      render: (row) => (
        <button
          type='button'
          onClick={() => setSelectedReturn(row)}
          className='text-indigo-600 font-bold hover:text-indigo-800 cursor-pointer transition-colors'
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
    <div className='px-6 py-4 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none'>
              <PackagePlusIcon size={24} className='text-white' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-tight'>
                Return Management
              </h1>
              <p className='text-sm text-gray-500'>
                History of items returned to inventory
              </p>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          {loading ? (
            <div className='p-20 text-center flex flex-col items-center gap-4'>
              <div className='w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
              <span className='text-gray-500 font-medium'>
                Loading history...
              </span>
            </div>
          ) : totalResults === 0 ? (
            <div className='p-20 text-center text-gray-400'>
              <AlertCircle size={48} className='mx-auto mb-4 opacity-20' />
              <p>No return records found.</p>
            </div>
          ) : (
            <ReturnTable columns={tableColumns} data={paginatedData} />
          )}
        </div>

        {/* Pagination */}
        {!loading && totalResults > 0 && (
          <div className='mt-6 flex justify-end'>
            <PaginationBar
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        {/* Detail Modal */}
        {selectedReturn && (
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200'>
            <div className='bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border dark:border-gray-700'>
              {/* Modal Header */}
              <div className='px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50'>
                <div className='flex items-center gap-3'>
                  <CheckCircle2 className='text-emerald-500' size={28} />
                  <h3 className='text-xl font-bold text-gray-800 dark:text-white'>
                    Return Receipt Details
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className='p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-400 transition-colors'
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
                {/* Left Side: Issuance Context */}
                <div className='space-y-6'>
                  <h4 className='text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em]'>
                    Original Issuance
                  </h4>
                  <DetailItem
                    icon={<Package size={18} />}
                    label='Item Name'
                    value={selectedReturn.issuedItem?.itemName}
                  />
                  <DetailItem
                    icon={<MapPin size={18} />}
                    label='Issued To'
                    value={selectedReturn.issuedItem?.issuedTo?.email}
                  />
                  <DetailItem
                    icon={<ClipboardList size={18} />}
                    label='Asset Codes'
                    value={
                      <div className='flex flex-wrap gap-1 mt-1'>
                        {selectedReturn.issuedItem?.itemCodes?.map((code) => (
                          <span
                            key={code}
                            className='px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px] border border-gray-200 dark:border-gray-600 font-mono'
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    }
                  />
                </div>

                {/* Right Side: Return Context */}
                <div className='space-y-6'>
                  <h4 className='text-[11px] font-black text-emerald-500 uppercase tracking-[0.2em]'>
                    Return Processing
                  </h4>
                  <DetailItem
                    icon={<Calendar size={18} />}
                    label='Date Returned'
                    value={selectedReturn.returnDate}
                  />
                  <DetailItem
                    icon={<User size={18} />}
                    label='Processed By'
                    value={selectedReturn.returnedBy}
                  />
                  <DetailItem
                    icon={<FileText size={18} />}
                    label='Condition & Remarks'
                    value={
                      <div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border mb-2 inline-block ${
                            selectedReturn.conditionStatus === "Good"
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-red-50 text-red-600 border-red-200"
                          }`}
                        >
                          STATUS: {selectedReturn.conditionStatus}
                        </span>
                        <p className='text-sm text-gray-600 dark:text-gray-400 italic'>
                          "{selectedReturn.remarks || "No remarks provided"}"
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className='px-8 py-5 bg-gray-50 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 text-right'>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className='px-6 py-2.5 bg-gray-800 hover:bg-black text-white rounded-xl text-sm font-bold transition-all active:scale-95'
                >
                  Close Receipt
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
  <div className='flex items-start gap-3'>
    <div className='text-indigo-500 mt-1'>{icon}</div>
    <div>
      <p className='text-[10px] text-gray-400 uppercase font-black tracking-wider leading-none mb-1'>
        {label}
      </p>
      <div className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
        {value || "N/A"}
      </div>
    </div>
  </div>
);

export default Return;

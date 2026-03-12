import axios from "axios";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Package,
  PackagePlusIcon,
  RotateCcw,
  User as UserIcon,
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
  const pageSize = 8;

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/inventory/issue/returns`,
      );
      setTableData([...response.data].reverse());
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
      render: (row) => row.issuedItem?.itemName || "N/A",
    },
    {
      header: "Original Recipient",
      render: (row) => row.issuedItem?.issuedTo || "N/A",
    },
    {
      header: "Return Date",
      accessor: "returnDate",
    },
    {
      header: "Condition",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            row.conditionStatus === "Good"
              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
              : "bg-amber-100 text-amber-700 border-amber-200"
          }`}
        >
          {row.conditionStatus}
        </span>
      ),
    },
    {
      header: "Action",
      render: (row) => (
        <button
          type='button'
          onClick={() => setSelectedReturn(row)}
          className='text-indigo-600 font-bold hover:text-indigo-800 transition-colors hover:underline'
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
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <div className='bg-indigo-600 p-2 rounded-xl shadow-lg'>
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
          <div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md'>
            <div className='bg-white dark:bg-gray-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700'>
              <div className='px-8 py-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-indigo-50/30 dark:bg-gray-800/50'>
                <div className='flex items-center gap-3'>
                  <div className='p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg'>
                    <CheckCircle2
                      className='text-emerald-600 dark:text-emerald-400'
                      size={24}
                    />
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 dark:text-white'>
                      Return Receipt
                    </h3>
                    <p className='text-xs text-gray-500'>
                      Receipt ID: #{selectedReturn.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className='text-gray-400 hover:text-gray-600'
                >
                  <X size={24} />
                </button>
              </div>

              <div className='p-8 grid grid-cols-1 md:grid-cols-2 gap-10'>
                {/* Left Side: Original Issuance */}
                <div className='space-y-6'>
                  <h4 className='flex items-center gap-2 text-[11px] font-black text-indigo-500 uppercase tracking-widest'>
                    <ClipboardList size={14} /> Original Issuance
                  </h4>
                  <div className='bg-gray-50 dark:bg-gray-900/40 p-4 rounded-2xl space-y-4 border border-gray-100 dark:border-gray-800'>
                    <DetailItem
                      icon={<Package size={18} />}
                      label='Item Name'
                      value={selectedReturn.issuedItem?.itemName}
                    />
                    <DetailItem
                      icon={<UserIcon size={18} />}
                      label='Issued To'
                      value={selectedReturn.issuedItem?.issuedTo}
                    />
                    <DetailItem
                      icon={<UserIcon size={18} />}
                      label='Issued By'
                      value={selectedReturn.issuedItem?.issuedBy}
                    />
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label='Issuance Date'
                      value={selectedReturn.issuedItem?.issueDate}
                    />

                    {/* Item Codes Section */}
                    <div>
                      <p className='text-[10px] text-gray-400 uppercase font-black tracking-wider mb-2'>
                        Item Codes
                      </p>
                      <div className='flex flex-wrap gap-1.5'>
                        {selectedReturn.issuedItem?.itemCodes?.length > 0 ? (
                          selectedReturn.issuedItem.itemCodes.map((code) => (
                            <span
                              key={code}
                              className='px-2 py-1 bg-white dark:bg-gray-800 rounded-md text-[10px] border border-gray-200 dark:border-gray-700 font-mono font-bold text-indigo-600'
                            >
                              {code}
                            </span>
                          ))
                        ) : (
                          <span className='text-xs text-gray-400 italic font-medium'>
                            No asset codes recorded
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Return Transaction */}
                <div className='space-y-6'>
                  <h4 className='flex items-center gap-2 text-[11px] font-black text-emerald-500 uppercase tracking-widest'>
                    <RotateCcw size={14} /> Return Status
                  </h4>
                  <div className='bg-emerald-50/30 dark:bg-emerald-900/10 p-4 rounded-2xl space-y-4 border border-emerald-100/50 dark:border-emerald-800/30'>
                    <DetailItem
                      icon={<Calendar size={18} />}
                      label='Return Date'
                      value={selectedReturn.returnDate}
                    />
                    <DetailItem
                      icon={<UserIcon size={18} />}
                      label='Returned By'
                      value={selectedReturn.returnedBy}
                    />
                    <div>
                      <p className='text-[10px] text-gray-400 uppercase font-black tracking-wider mb-2'>
                        Condition
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                          selectedReturn.conditionStatus === "Good"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        {selectedReturn.conditionStatus?.toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className='text-[10px] text-gray-400 uppercase font-black tracking-wider mb-1'>
                        Remarks
                      </p>
                      <p className='text-sm text-gray-600 dark:text-gray-300 italic'>
                        {selectedReturn.remarks || "No additional remarks."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='px-8 py-5 bg-gray-50/80 dark:bg-gray-800/80 border-t border-gray-100 dark:border-gray-700 flex justify-end'>
                <button
                  onClick={() => setSelectedReturn(null)}
                  className='px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-lg transition-transform active:scale-95'
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
    <div className='min-w-0'>
      <p className='text-[10px] text-gray-400 uppercase font-black tracking-wider leading-none mb-1'>
        {label}
      </p>
      <div className='text-sm font-semibold text-gray-800 dark:text-gray-200 truncate'>
        {value || "N/A"}
      </div>
    </div>
  </div>
);

export default Return;

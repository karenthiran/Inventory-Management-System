import axios from "axios";
import { FileText, Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaginationBar from "../components/common/PaginationBar";
import ReturnTable from "../components/layout/return/ReturnTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Return = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
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
      header: "Returned By",
      accessor: "returnedBy",
    },
    {
      header: "Item Name",
      // Path: issuedItem -> category -> categoryName
      render: (row) => row.issuedItem?.category?.categoryName || "N/A",
    },
    {
      header: "Issued To",
      // Path: issuedItem -> issuedTo
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
          type='button'
          onClick={() => navigate(`/issue-detail/${row.issuedItem?.id}`)}
          className='text-indigo-600 font-medium hover:underline cursor-pointer transition-all duration-200'
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
    <div className='px-6 py-8 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8'>
          <div className='flex items-center gap-3 text-neutral-900 dark:text-gray-200'>
            <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
              <FileText
                size={24}
                className='text-indigo-600 dark:text-indigo-400'
              />
            </div>
            <span className='text-2xl font-bold tracking-tight text-gray-800 dark:text-white'>
              Return Management
            </span>
          </div>

          <div className='flex flex-wrap items-center gap-3'>
            <div className='relative'>
              <select className='appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm'>
                <option value=''>Filter by Condition</option>
                <option value='Good'>Good</option>
                <option value='Damaged'>Damaged</option>
              </select>
              <Filter
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'
              />
            </div>

            <div className='relative'>
              <input
                type='text'
                placeholder='Search returns...'
                className='bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-full md:w-64'
              />
              <Search
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
              />
            </div>
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden'>
          {loading ? (
            <div className='p-20 text-center text-gray-500 flex flex-col items-center gap-2'>
              <div className='w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin'></div>
              <span>Fetching records from University of Jaffna IMS...</span>
            </div>
          ) : (
            <ReturnTable columns={tableColumns} data={paginatedData} />
          )}
        </div>

        {!loading && totalResults > 0 && (
          <div className='mt-6'>
            <PaginationBar
              totalResults={totalResults}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Return;

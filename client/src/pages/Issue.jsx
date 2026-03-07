import {
  ArrowRight,
  ClockAlert,
  FileText,
  Filter,
  Hourglass,
  LayoutGrid,
  Plus,
  RotateCcw,
  Search,
  SquarePen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../components/common/DashboardCard";
import PaginationBar from "../components/common/PaginationBar";
import IssueDetailModal from "../components/layout/issue/IssueDetailModal";
import IssueItemForm from "../components/layout/issue/IssueItemForm";
import IssueTable from "../components/layout/issue/IssueTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Issue = () => {
  const navigate = useNavigate();

  /* =========================
      State Management
  ========================== */
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All"); // New Filter State
  const pageSize = 5;

  /* =========================================================
      🌐 API Fetch: Load data
  ========================================================= */
  const fetchIssuedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/inventory/issue/all`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();

      /* Inside fetchIssuedItems in Issue.jsx */

      /* Inside fetchIssuedItems in Issue.jsx */
      const formattedData = [...data].reverse().map((item, index) => ({
        no: index + 1,
        dbId: item.id,
        user: item.username,
        itemName: item.category?.categoryName || "N/A",
        location: item.issuedTo,
        issueDate: item.issueDate,
        dueDate: item.dueDate,
        quantity: item.quantity,
        notes: item.notes,

        // FIX: Access itemCodes (the List) and join them with a comma
        categoryCode:
          item.itemCodes && item.itemCodes.length > 0
            ? item.itemCodes.join(", ")
            : "N/A",
      }));

      setTableData(formattedData);
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedItems();
  }, []);

  /* =========================================================
      📊 Card & Filter Logic
  ========================================================= */
  const filteredData = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);

    return tableData.filter((item) => {
      // 1. Search Logic (User or Item Name)
      const matchesSearch =
        item.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. Filter Logic (Overdue / Due Soon)
      const itemDueDate = new Date(item.dueDate).setHours(0, 0, 0, 0);
      const diffDays = (itemDueDate - today) / (1000 * 60 * 60 * 24);

      let matchesFilter = true;
      if (statusFilter === "Overdue") matchesFilter = itemDueDate < today;
      if (statusFilter === "Due Soon")
        matchesFilter = diffDays >= 0 && diffDays <= 3;

      return matchesSearch && matchesFilter;
    });
  }, [tableData, searchTerm, statusFilter]);

  const cardData = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const currentlyIssued = tableData.length;
    const overdue = tableData.filter(
      (item) => new Date(item.dueDate).setHours(0, 0, 0, 0) < today,
    ).length;
    const dueSoon = tableData.filter((item) => {
      const diff =
        (new Date(item.dueDate).getTime() - today) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 3;
    }).length;

    return [
      {
        title: "Currently Issued",
        value: currentlyIssued.toString(),
        subtitle: "Currently in used",
        icon: <ArrowRight size={20} />,
        gradient: "from-emerald-500 to-green-600",
      },
      {
        title: "Due in Soon",
        value: dueSoon.toString(),
        subtitle: "Ready to return",
        icon: <Hourglass size={20} />,
        gradient: "from-amber-500 to-orange-600",
      },
      {
        title: "Over Due",
        value: overdue.toString(),
        subtitle: "Return Deadline Passed",
        icon: <ClockAlert size={20} />,
        gradient:
          "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white",
      },
    ];
  }, [tableData]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, filteredData]);

  const tableColumns = [
    { header: "NO.", accessor: "no" },
    { header: "User", accessor: "user" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Issued to", accessor: "location" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "EXPT RTN Date", accessor: "dueDate" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Action",
      render: (row) => (
        <div className='flex justify-center items-center'>
          <button
            type='button'
            onClick={() => navigate(`/edit-item/${row.dbId}`)}
            className='text-red-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-red-100 transition-all'
          >
            <SquarePen size={16} />
          </button>
          <button
            type='button'
            className='text-indigo-600 px-2 py-1 rounded-lg text-sm font-medium hover:bg-gray-400 transition-all'
          >
            <RotateCcw size={16} />
          </button>
        </div>
      ),
    },
    {
      header: "View",
      render: (row) => (
        <button
          type='button'
          onClick={() => {
            setSelectedIssue(row);
            setShowDetailModal(true);
          }}
          className='text-indigo-600 font-medium hover:underline'
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <div className='px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300'>
      <div className='flex items-center gap-3 mb-10'>
        <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
          <LayoutGrid
            size={22}
            className='text-indigo-600 dark:text-indigo-400'
          />
        </div>
        <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
          Overview
        </h1>
      </div>

      <section className='flex justify-center mb-14'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl'>
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2 text-neutral-900 dark:text-gray-200'>
            <FileText
              size={25}
              className='text-indigo-600 dark:text-indigo-400'
            />
            <span className='text-xl font-semibold'>Detailed Report</span>
          </div>

          <div className='flex items-center gap-4'>
            <button
              onClick={() => setShowIssueModal(true)}
              className='flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm'
            >
              <Plus size={18} /> Issue a New Item
            </button>

            {/* Filter Dropdown - Inserted between buttons */}
            <div className='relative flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm'>
              <Filter size={16} className='text-gray-500' />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className='bg-transparent rounded-lg text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-200 outline-none cursor-pointer'
              >
                <option value='All'>All Status</option>
                <option value='Overdue'>Overdue</option>
                <option value='Due Soon'>Due Soon</option>
              </select>
            </div>

            <div className='relative'>
              <input
                type='text'
                placeholder='Search by name'
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className='bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
              />
              <Search
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'
              />
            </div>
          </div>
        </div>

        <IssueTable columns={tableColumns} data={paginatedData} />

        <PaginationBar
          totalResults={filteredData.length}
          currentPage={currentPage}
          totalPages={Math.ceil(filteredData.length / pageSize)}
          onPageChange={setCurrentPage}
        />
      </div>

      {showIssueModal && (
        <IssueItemForm
          onClose={() => setShowIssueModal(false)}
          onIssueItem={fetchIssuedItems}
          loading={loading}
        />
      )}
      {showDetailModal && selectedIssue && (
        <IssueDetailModal
          data={selectedIssue}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </div>
  );
};

export default Issue;

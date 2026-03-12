import {
  ArrowRight,
  ClockAlert,
  FileText,
  Hourglass,
  PackageMinus,
  Plus,
  RotateCcw,
  Search,
  SquarePen,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DashboardCard from "../components/common/DashboardCard";
import PaginationBar from "../components/common/PaginationBar";
import EditDueDateModal from "../components/layout/issue/EditDueDateModal";
import IssueDetailModal from "../components/layout/issue/IssueDetailModal";
import IssueItemForm from "../components/layout/issue/IssueItemForm";
import IssueTable from "../components/layout/issue/IssueTable";
import ReturnItemModal from "../components/layout/issue/ReturnItemModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Issue = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingIssue, setEditingIssue] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returningIssue, setReturningIssue] = useState(null);
  const pageSize = 5;

  const fetchIssuedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/issues/all`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();

      const formattedData = [...data].reverse().map((item, index) => ({
        no: index + 1,
        dbId: item.id,

        // ✅ issuedTo is now a plain string username
        user: item.issuedTo || "N/A",
        userEmail: null,

        issuedBy: item.issuedBy || "System Admin",

        itemName: item.itemName || "N/A",
        itemCodes: item.itemCodesSnapshot
          ? item.itemCodesSnapshot.split(",")
          : item.itemCodes || [],
        categoryCode:
          item.itemCodesSnapshot || item.itemCodes?.join(", ") || "N/A",
        quantity: item.quantity || 1,

        location: item.location?.locationName || "N/A",
        locationId: item.location?.locationId,

        issueDate: item.issueDate,
        dueDate: item.expectedReturnDate,

        notes: item.notes || "",
        isReturned: item.isReturned,
      }));
      setTableData(formattedData);
    } catch (error) {
      console.error("Fetch failed:", error);
      toast.error("Could not load issued items.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuedItems();
  }, []);

  const handleUpdateDueDate = async (id, newDate) => {
    if (loading) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/api/issues/${id}/update-date?newDate=${newDate}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
        },
      );
      if (response.ok) {
        await fetchIssuedItems();
        setShowEditModal(false);
        toast.success("Due date updated successfully!");
      } else {
        const errorMsg = await response.text();
        toast.error(`Update failed: ${errorMsg}`);
      }
    } catch (error) {
      toast.error("A network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Filters — Overdue and Due Soon exclude returned items
  const filteredData = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return tableData.filter((item) => {
      const matchesSearch =
        item.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase());

      const itemDueDate = new Date(item.dueDate).setHours(0, 0, 0, 0);
      const diffDays = (itemDueDate - today) / (1000 * 60 * 60 * 24);

      if (statusFilter === "Returned") return matchesSearch && item.isReturned;

      if (statusFilter === "Overdue")
        return matchesSearch && !item.isReturned && itemDueDate < today;

      if (statusFilter === "Due Soon")
        return (
          matchesSearch && !item.isReturned && diffDays >= 0 && diffDays <= 3
        );

      return matchesSearch; // "All"
    });
  }, [tableData, searchTerm, statusFilter]);

  // ✅ Cards only count active (non-returned) items
  const activeData = useMemo(
    () => tableData.filter((item) => !item.isReturned),
    [tableData],
  );

  const cardData = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return [
      {
        title: "Currently Issued",
        value: activeData.length.toString(),
        subtitle: "In use",
        icon: <ArrowRight size={20} />,
        gradient: "from-emerald-500 to-green-600",
      },
      {
        title: "Due in Soon",
        value: activeData
          .filter((i) => {
            const d = (new Date(i.dueDate) - today) / 86400000;
            return d >= 0 && d <= 3;
          })
          .length.toString(),
        subtitle: "Ready to return",
        icon: <Hourglass size={20} />,
        gradient: "from-amber-500 to-orange-600",
      },
      {
        title: "Over Due",
        value: activeData
          .filter((i) => new Date(i.dueDate).setHours(0, 0, 0, 0) < today)
          .length.toString(),
        subtitle: "Deadline Passed",
        icon: <ClockAlert size={20} />,
        gradient: "from-red-500 to-red-700",
      },
    ];
  }, [activeData]);

  const paginatedData = useMemo(
    () =>
      filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [currentPage, filteredData],
  );

  // ✅ Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

  const tableColumns = [
    { header: "NO.", accessor: "no" },
    { header: "User", accessor: "user" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Location", accessor: "location" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "EXPT RTN Date", accessor: "dueDate" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "Action",
      render: (row) => (
        <div className='flex justify-center gap-2 items-center'>
          {!row.isReturned ? (
            <>
              <button
                onClick={() => {
                  setEditingIssue(row);
                  setShowEditModal(true);
                }}
                className='text-red-700 p-1 hover:bg-red-100 rounded transition-colors'
                title='Edit Due Date'
              >
                <SquarePen size={16} />
              </button>
              <button
                onClick={() => {
                  setReturningIssue(row);
                  setShowReturnModal(true);
                }}
                className='text-indigo-600 p-1 hover:bg-gray-200 rounded transition-colors'
                title='Process Return'
              >
                <RotateCcw size={16} />
              </button>
            </>
          ) : (
            <span className='inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 uppercase tracking-wider'>
              Returned
            </span>
          )}
        </div>
      ),
    },
    {
      header: "View",
      render: (row) => (
        <button
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
    <div className='h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          success: {
            style: {
              background: "#f0fdf4",
              color: "#166534",
              border: "1px solid #bbf7d0",
            },
          },
          error: {
            style: {
              background: "#fef2f2",
              color: "#991b1b",
              border: "1px solid #fecaca",
            },
          },
        }}
      />

      <div className='flex items-center gap-3 mb-10'>
        <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
          <PackageMinus
            size={22}
            className='text-indigo-600 dark:text-indigo-400'
          />
        </div>
        <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Issue Management
        </h1>
      </div>

      <section className='flex justify-center mb-14'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl'>
          {cardData.map((card, i) => (
            <DashboardCard key={i} {...card} />
          ))}
        </div>
      </section>

      <div className='max-w-7xl mx-auto'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <FileText size={25} className='text-indigo-600' />
            <span className='text-xl font-semibold dark:text-white'>
              Detailed Report
            </span>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setShowIssueModal(true)}
              className='bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2'
            >
              <Plus size={18} /> Issue Item
            </button>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white'
            >
              <option value='All'>All Status</option>
              <option value='Overdue'>Overdue</option>
              <option value='Due Soon'>Due Soon</option>
              <option value='Returned'>Returned</option>
            </select>
            <div className='relative'>
              <input
                type='text'
                placeholder='Search...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='border rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-white'
              />
              <Search
                size={16}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500'
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
      {showEditModal && editingIssue && (
        <EditDueDateModal
          data={editingIssue}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateDueDate}
          loading={loading}
        />
      )}
      {showReturnModal && returningIssue && (
        <ReturnItemModal
          data={returningIssue}
          onClose={() => setShowReturnModal(false)}
          onRefresh={fetchIssuedItems}
        />
      )}
    </div>
  );
};

export default Issue;

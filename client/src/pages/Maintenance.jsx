import axios from "axios";
import {
  AlertCircle,
  AlertTriangle,
  FileText,
  Plus,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import DashboardCard from "../components/common/DashboardCard";
import PaginationBar from "../components/common/PaginationBar";
import MaintenanceTable from "../components/layout/maintenance/MaintenanceTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

// ✅ Item type options for dropdown
const ITEM_TYPES = ["Consumable", "Capital"];

const Maintenance = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const rowsPerPage = 5;
  const userRole = localStorage.getItem("role");

  const [formData, setFormData] = useState({
    receivedFrom: "",
    itemName: "",
    itemCode: "",
    itemType: "",
    quantity: "",
    description: "",
    status: "PENDING",
  });

  const fetchMaintenanceData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/maintenance/all`);
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load maintenance records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  // ✅ One-way status flow: PENDING → IN_PROGRESS → COMPLETED
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/maintenance/update-status/${requestId}`,
        { status: newStatus },
      );
      if (response.status === 200) {
        fetchMaintenanceData();
        const statusLabels = {
          IN_PROGRESS: "Marked as In Progress",
          COMPLETED: "Marked as Completed ✓",
        };
        toast.success(statusLabels[newStatus] || "Status updated.");
      }
    } catch (error) {
      if (error.response?.status === 400) {
        // ✅ Backend validation error as toast
        toast.error(error.response.data || "Invalid status transition.");
      } else {
        toast.error("Status update failed. Please try again.");
        console.error("Status update failed:", error);
      }
    }
  };

  // ✅ Add saves to both maintenance_requests + active_maintenance
  const handleAddItem = async () => {
    // Basic frontend validation
    if (!formData.receivedFrom.trim()) {
      toast.error("Please enter who the item was received from.");
      return;
    }
    if (!formData.itemName.trim()) {
      toast.error("Please enter the item name.");
      return;
    }
    if (!formData.itemCode.trim()) {
      toast.error("Please enter the item code.");
      return;
    }
    if (!formData.itemType) {
      toast.error("Please select an item type.");
      return;
    }
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }

    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/maintenance/edit/${editId}`,
          formData,
        );
        toast.success("Maintenance record updated successfully.");
      } else {
        await axios.post(`${API_BASE_URL}/api/maintenance/add`, formData);
        toast.success("Maintenance request submitted successfully.");
      }
      fetchMaintenanceData();
      resetForm();
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data || "Validation error.");
      } else {
        toast.error("Could not connect to server. Check backend status.");
        console.error("Save error:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      receivedFrom: "",
      itemName: "",
      itemCode: "",
      itemType: "",
      quantity: "",
      description: "",
      status: "PENDING",
    });
    setEditId(null);
    setShowRequest(false);
  };

  const filteredData =
    filterStatus === "All"
      ? tableData
      : tableData.filter((item) => item.status === filterStatus);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentRows = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const getCount = (status) =>
    tableData.filter((item) => item.status === status).length;

  const cardData = [
    {
      title: "Total Requests",
      value: tableData.length,
      subtitle: "All reports",
      icon: <AlertTriangle size={18} />,
      gradient: "from-orange-500 to-amber-600",
    },
    {
      title: "Pending",
      value: getCount("PENDING"),
      subtitle: "Waiting",
      icon: <AlertCircle size={18} />,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      title: "In Progress",
      value: getCount("IN_PROGRESS"),
      subtitle: "Fixing",
      icon: <Wrench size={18} />,
      gradient: "from-blue-600 to-indigo-700",
    },
    {
      title: "Completed",
      value: getCount("COMPLETED"),
      subtitle: "Resolved",
      icon: <XCircle size={18} />,
      gradient: "from-green-500 to-emerald-600",
    },
  ];

  return (
    <div className='px-4 md:px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen'>
      {/* ✅ Toast notifications */}
      <Toaster
        position='top-right'
        reverseOrder={false}
        toastOptions={{
          duration: 2500,
          style: { fontSize: "14px" },
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
          <Wrench size={22} className='text-indigo-600 dark:text-indigo-400' />
        </div>
        <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
          Maintenance Management
        </h1>
      </div>

      {/* Stats Cards */}
      <div className='max-w-7xl mx-auto mb-8'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {cardData.map((card, index) => (
            <div
              key={index}
              className='w-full transform scale-90 origin-top-left'
            >
              <DashboardCard {...card} />
            </div>
          ))}
        </div>
      </div>

      {/* Table Section */}
      <div className='max-w-7xl mx-auto'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
          <div className='flex items-center gap-2 text-neutral-900 dark:text-gray-200'>
            <FileText
              size={22}
              className='text-indigo-600 dark:text-indigo-400'
            />
            <span className='text-lg font-semibold'>Maintenance Logs</span>
          </div>
          <div className='flex items-center gap-3'>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className='bg-white dark:bg-gray-700 text-sm p-2 rounded-lg border dark:border-gray-600 dark:text-white outline-none'
            >
              <option value='All'>All Status</option>
              <option value='PENDING'>Pending</option>
              <option value='IN_PROGRESS'>In Progress</option>
              <option value='COMPLETED'>Completed</option>
            </select>
            {userRole == "SUPERADMIN" && (
              <button
                onClick={() => {
                  setEditId(null);
                  resetForm();
                  setShowRequest(true);
                }}
                className='bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm'
              >
                <Plus size={16} /> New Request
              </button>
            )}
          </div>
        </div>

        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden'>
          {isLoading ? (
            <div className='p-20 text-center text-gray-500'>Loading...</div>
          ) : (
            <MaintenanceTable
              currentRows={currentRows}
              setFormData={setFormData}
              setEditId={setEditId}
              setShowRequest={setShowRequest}
              onStatusChange={handleStatusChange}
            />
          )}
        </div>

        <PaginationBar
          totalResults={filteredData.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Add / Edit Modal */}
      {showRequest && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-xl'>
            <h2 className='text-xl font-bold text-indigo-600 mb-4'>
              {editId ? "Update Record" : "New Maintenance Request"}
            </h2>

            <div className='grid grid-cols-2 gap-4'>
              {/* Received From */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Received From
                </label>
                <input
                  value={formData.receivedFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedFrom: e.target.value })
                  }
                  placeholder='e.g. Lab A / John Doe'
                  className='border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm'
                />
              </div>

              {/* Item Name */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Item Name
                </label>
                <input
                  value={formData.itemName}
                  onChange={(e) =>
                    setFormData({ ...formData, itemName: e.target.value })
                  }
                  placeholder='e.g. Dell Laptop'
                  className='border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm'
                />
              </div>

              {/* Item Code */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Item Code
                </label>
                <input
                  value={formData.itemCode}
                  readOnly={!!editId}
                  onChange={(e) =>
                    setFormData({ ...formData, itemCode: e.target.value })
                  }
                  placeholder='e.g. LAP-001'
                  className={`border dark:border-gray-600 p-2 rounded dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm ${
                    editId
                      ? "bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-60"
                      : "bg-transparent"
                  }`}
                />
              </div>

              {/* ✅ Item Type — Dropdown */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Item Type
                </label>
                <select
                  value={formData.itemType}
                  onChange={(e) =>
                    setFormData({ ...formData, itemType: e.target.value })
                  }
                  className='border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 dark:text-white text-sm'
                >
                  <option value=''>Select Type</option>
                  {ITEM_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Qty
                </label>
                <input
                  type='number'
                  min='1'
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  placeholder='e.g. 1'
                  className='border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm'
                />
              </div>

              {/* Status — disabled in edit mode */}
              <div className='flex flex-col gap-1'>
                <label className='text-xs font-bold dark:text-gray-400'>
                  Status
                </label>
                <select
                  value={formData.status}
                  disabled={!!editId}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className='border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 dark:text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed'
                >
                  <option value='PENDING'>Pending</option>
                  <option value='IN_PROGRESS'>In Progress</option>
                  <option value='COMPLETED'>Completed</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className='mt-4 flex flex-col gap-1'>
              <label className='text-xs font-bold dark:text-gray-400'>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder='Describe the issue or reason for maintenance...'
                className='border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm w-full'
                rows='3'
              />
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                onClick={resetForm}
                className='text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg transition'
              >
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className='bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition'
              >
                {editId ? "Update" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Maintenance;

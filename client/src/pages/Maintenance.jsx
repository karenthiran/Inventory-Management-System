import axios from "axios";
import {
  AlertCircle,
  AlertTriangle,
  FileText,
  LayoutGrid,
  Plus,
  Wrench,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import DashboardCard from "../components/common/DashboardCard";
import PaginationBar from "../components/common/PaginationBar";
import MaintenanceTable from "../components/layout/maintenance/MaintenanceTable";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Maintenance = () => {
  const [showRequest, setShowRequest] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [editId, setEditId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const rowsPerPage = 5;

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceData();
  }, []);

  // Quick Status Update for the Table
  const handleStatusChange = async (requestId, newStatus) => {
    try {
      const itemToUpdate = tableData.find(
        (item) => item.requestId === requestId,
      );
      if (!itemToUpdate) return;

      await axios.put(`${API_BASE_URL}/api/maintenance/edit/${requestId}`, {
        ...itemToUpdate,
        status: newStatus,
      });
      fetchMaintenanceData(); // Refresh to update stats cards
    } catch (error) {
      console.error("Status update failed:", error);
    }
  };

  const handleAddItem = async () => {
    try {
      if (editId) {
        await axios.put(
          `${API_BASE_URL}/api/maintenance/edit/${editId}`,
          formData,
        );
      } else {
        await axios.post(`${API_BASE_URL}/api/maintenance/add`, formData);
      }
      fetchMaintenanceData();
      resetForm();
    } catch (error) {
      console.error("Save error:", error);
      alert("Error connecting to server. Check CORS and Backend status.");
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
    <div className="px-4 md:px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
          <LayoutGrid
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          Overview
        </h1>
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="w-full transform scale-90 origin-top-left"
            >
              <DashboardCard {...card} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-gray-200">
            <FileText
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-lg font-semibold">Maintenance Logs</span>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white dark:bg-gray-700 text-sm p-2 rounded-lg border dark:border-gray-600 dark:text-white outline-none"
            >
              <option value="All">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <button
              onClick={() => {
                setEditId(null);
                setShowRequest(true);
              }}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> New Request
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
          {isLoading ? (
            <div className="p-20 text-center text-gray-500">Loading...</div>
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

      {showRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-lg rounded-xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-indigo-600 mb-4">
              {editId ? "Update Record" : "New Request"}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Received From
                </label>
                <input
                  value={formData.receivedFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedFrom: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Item Name
                </label>
                <input
                  value={formData.itemName}
                  onChange={(e) =>
                    setFormData({ ...formData, itemName: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Item Code
                </label>
                <input
                  value={formData.itemCode}
                  onChange={(e) =>
                    setFormData({ ...formData, itemCode: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Item Type
                </label>
                <input
                  value={formData.itemType}
                  onChange={(e) =>
                    setFormData({ ...formData, itemType: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Qty
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold dark:text-gray-400">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="border dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <label className="text-xs font-bold dark:text-gray-400">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border dark:border-gray-600 p-2 rounded bg-transparent dark:text-white w-full"
                rows="3"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={resetForm} className="text-gray-500">
                Cancel
              </button>
              <button
                onClick={handleAddItem}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
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

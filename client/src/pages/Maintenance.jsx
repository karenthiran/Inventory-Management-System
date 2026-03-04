import React from "react";
import DashboardCard from "../components/common/DashboardCard";

import {
  AlertTriangle,
  AlertCircle,
  XCircle,
  Wrench,
  LayoutGrid,
  Plus,
  Pencil,
} from "lucide-react";

const Maintenance = () => {

  const [showRequest, setShowRequest] = React.useState(false);
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [editIndex, setEditIndex] = React.useState(null);

  const [formData, setFormData] = React.useState({
    userId: "",
    username: "",
    itemName: "",
    itemCode: "",
    type: "",
    quantity: "",
    description: "",
    status: "New",
  });

  const cardData = [
    {
      title: "Total Damaged Items",
      value: 234,
      subtitle: "All reported damaged inventory",
      icon: <AlertTriangle size={18} />,
      gradient: "from-orange-500 to-amber-600",
    },
    {
      title: "Partially Damaged",
      value: 125,
      subtitle: "Can be repaired or reused",
      icon: <AlertCircle size={18} />,
      gradient: "from-yellow-400 to-amber-500",
    },
    {
      title: "Fully Damaged",
      value: 87,
      subtitle: "Not usable – replacement required",
      icon: <XCircle size={18} />,
      gradient: "from-red-500 to-rose-600",
    },
    {
      title: "Submitted for Repair",
      value: 22,
      subtitle: "Currently under maintenance",
      icon: <Wrench size={18} />,
      gradient: "from-blue-600 to-indigo-700",
    },
  ];

  const [tableData, setTableData] = React.useState([
    {
      userId: "U001",
      number: "228-3844-931-7689",
      name: "Laptop",
      user: "Jos Butler",
      date: "10/07/2023",
      status: "New",
    },
    {
      userId: "U002",
      number: "661-7963-661-7963",
      name: "Oscilloscope",
      user: "Will Jacks",
      date: "24/07/2023",
      status: "New",
    },
{
userId: "U001",
number: "228-3844-931-7689",
name: "Laptop",
user: "Jos Butler",
date: "10/07/2023",
status: "New",
},
{
userId: "U002",
number: "661-7963-661-7963",
name: "Oscilloscope",
user: "Will Jacks",
date: "24/07/2023",
status: "New",
},
{
userId: "U003",
number: "958-4030-182-0187",
name: "Printer",
user: "Andrew Symons",
date: "08/08/2023",
status: "In-progress",
},
{
userId: "U004",
number: "741-2847-552-9201",
name: "Router",
user: "Jacob Bethel",
date: "31/08/2023",
status: "Completed",
},
{
userId: "U005",
number: "519-7632-481-3305",
name: "Projector",
user: "David Warner",
date: "01/09/2023",
status: "Disposed",
},
{
userId: "U006",
number: "602-9944-716-8812",
name: "Desktop",
user: "Steve Smith",
date: "12/09/2023",
status: "New",
},
{
userId: "U007",
number: "833-1422-967-4401",
name: "Keyboard",
user: "Ben Stokes",
date: "20/09/2023",
status: "In-progress",
},
{
userId: "U008",
number: "417-6683-215-7340",
name: "Mouse",
user: "Joe Root",
date: "25/09/2023",
status: "Completed",
},
{
userId: "U009",
number: "704-3391-620-1188",
name: "Monitor",
user: "Kane Williamson",
date: "30/09/2023",
status: "New",
},
{
userId: "U010",
number: "965-7124-553-9910",
name: "Server",
user: "Babar Azam",
date: "05/10/2023",
status: "Disposed",
}

  ]);

  // Generate Item Number
  const generateItemNumber = () => {
    const part1 = Math.floor(100 + Math.random() * 900);
    const part2 = Math.floor(1000 + Math.random() * 9000);
    const part3 = Math.floor(100 + Math.random() * 900);
    const part4 = Math.floor(1000 + Math.random() * 9000);
    return `${part1}-${part2}-${part3}-${part4}`;
  };

  const handleAddItem = () => {

    const today = new Date().toLocaleDateString();

   const newItem = {
  userId: formData.userId,
  number: formData.itemCode,
  name: formData.itemName,
  user: formData.username,
  quantity: formData.quantity,  
  date: today,
  status: formData.status,
};
    if (editIndex !== null) {
      const updated = [...tableData];
      updated[editIndex] = newItem;
      setTableData(updated);
      setEditIndex(null);
    } else {
      setTableData([...tableData, newItem]);
    }

    setFormData({
      userId: "",
      username: "",
      itemName: "",
      itemCode: "",
      type: "",
      quantity: "",
      description: "",
      status: "New",
    });

    setShowRequest(false);
  };
const [currentPage, setCurrentPage] = React.useState(1);

const filteredData = tableData.filter((item) =>
  filterStatus === "All" ? true : item.status === filterStatus
);const rowsPerPage = 5;
const indexOfLast = currentPage * rowsPerPage;
const indexOfFirst = indexOfLast - rowsPerPage;

const currentRows = filteredData.slice(indexOfFirst, indexOfLast);
  return (
    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
          <LayoutGrid size={22} className="text-indigo-600 dark:text-indigo-400" />
        </div>

        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Overview
        </h1>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {cardData.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>

      {/* Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => {
            setEditIndex(null);
            setShowRequest(true);
          }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          <Plus size={16} />
          New Maintenance Request
        </button>
      </div>

      {/* Table */}
      <div className="max-w-7xl mx-auto mt-10">

        <div className="flex justify-between items-center mb-4">

          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Detailed report
          </h2>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-1 rounded text-sm"
          >
            <option value="All">All</option>
            <option value="New">New</option>
            <option value="In-progress">In-progress</option>
            <option value="Completed">Completed</option>
            <option value="Disposed">Disposed</option>
          </select>

        </div>

        <div className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">

          <table className="w-full text-sm text-gray-800 dark:text-gray-200">

            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-left">User ID</th>
                <th className="p-3 text-left">Item Number</th>
                <th className="p-3 text-left">Item Name</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Submitted Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-[#08295f]">

              {currentRows.map((item, index) => (
                  <tr key={index} className="border-t border-gray-200 dark:border-gray-600">

                    <td className="p-3">{item.userId}</td>
                    <td className="p-3">{item.number}</td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.user}</td>
                    <td className="p-3">{item.date}</td>

                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs
                        ${item.status === "New"
                          ? "bg-blue-200 text-blue-700"
                          : item.status === "In-progress"
                          ? "bg-yellow-200 text-yellow-700"
                          : item.status === "Completed"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td
                      onClick={() => {
                        setFormData({
    userId: item.userId,
    username: item.user,
    itemName: item.name,
    itemCode: item.number,
    quantity: item.quantity || "",   
    type: "",
    description: "",
    status: item.status
  });

                        setEditIndex(indexOfFirst+index);
                        setShowRequest(true);
                      }}
                      className="p-3 flex items-center gap-2 cursor-pointer text-indigo-600 dark:text-indigo-300"
                    >
                      <Pencil size={16} />
                      Edit
                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>

      </div><div className="flex justify-center gap-4 mt-4">

<button
onClick={() => setCurrentPage(currentPage - 1)}
disabled={currentPage === 1}
className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-400"
>
Previous
</button>

<span className="text-gray-700 dark:text-gray-200">
Page {currentPage}
</span>

<button
onClick={() => setCurrentPage(currentPage + 1)}
disabled={indexOfLast >= filteredData.length}
className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-400"
>
Next
</button>

</div>

      {/* Modal */}
      {showRequest && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white dark:bg-gray-800 w-[500px] rounded-xl p-6 shadow-lg">

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">
                Maintenance Request
              </h2>

              <button
                onClick={() => setShowRequest(false)}
                className="text-red-500 text-lg"
              >
                ✕
              </button>

            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create a new maintenance request for equipment
            </p>

            <div className="grid grid-cols-2 gap-4">

              <input
                placeholder="User ID"
                value={formData.userId}
                onChange={(e)=>setFormData({...formData,userId:e.target.value})}
                className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              />

              <input
                placeholder="User Name"
                value={formData.username}
                onChange={(e)=>setFormData({...formData,username:e.target.value})}
                className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              />

              <input
                placeholder="Item Name"
                value={formData.itemName}
                onChange={(e)=>setFormData({...formData,itemName:e.target.value})}
                className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              />

              <input
  placeholder="Item Code"
  value={formData.itemCode}
  onChange={(e)=>setFormData({...formData,itemCode:e.target.value})}
  className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
/>

              <select
                value={formData.status}
                onChange={(e)=>setFormData({...formData,status:e.target.value})}
                className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="New">New</option>
                <option value="In-progress">In-progress</option>
                <option value="Completed">Completed</option>
                <option value="Disposed">Disposed</option>
              </select>

              <input
  placeholder="Quantity"
  type="number"
  value={formData.quantity}
  onChange={(e)=>setFormData({...formData,quantity:e.target.value})}
  className="border p-2 rounded bg-white dark:bg-gray-700 dark:text-white"
/>
            </div>

            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e)=>setFormData({...formData,description:e.target.value})}
              className="border w-full p-2 rounded mt-4 bg-white dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end gap-4 mt-6">

              <button
                onClick={() => setShowRequest(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddItem}
                className="bg-indigo-600 text-white px-4 py-2 rounded"
              >
                {editIndex !== null ? "Update Item" : "Add Item"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Maintenance;
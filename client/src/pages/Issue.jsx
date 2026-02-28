import React from 'react'
import { useNavigate } from "react-router-dom";
import IssueTable from "../components/layout/issue/IssueTable";
import { LayoutGrid, Plus ,Hourglass, ClockAlert, ArrowRight,FileText, Filter, Search, SquarePen} from "lucide-react";
import DashboardCard from "../components/common/DashboardCard";


/* =========================================================
   📊 Issue Cards Data
========================================================= */
const cardData = [
  {
    title: "Currently Issued",
    value: "264",
    subtitle: "Currently in used",
    icon: <ArrowRight size={20} />,
    gradient: "from-emerald-500 to-green-600",
  },
  {
    title: "Due in Soon",
    value: "125",
    subtitle: "Ready to return",
    icon: <Hourglass size={20} />,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Over Due",
    value: "25",
    subtitle: "Return Deadline Passed",
    icon: <ClockAlert size={20} />,
    gradient: "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white",
  },
];

const Issue = () => {
  const navigate = useNavigate();

  const tableColumns = [
    { header: "NO.", accessor: "no" },
    { header: "User", accessor: "user" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Location", accessor: "location" },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Due Date", accessor: "dueDate" },
    { header: "Quantity", accessor: "quantity" },

    {
  header: "Action",
  render: () => (
    <button
      type="button"
      onClick={() => navigate("/edit-item")}
      className="text-red-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-red-50 cursor-pointer transition-all duration-200"
      aria-label="Edit item"
    >
      <SquarePen size={16} />
    </button>
  ),
   },


  //  {
  //     header: "Action",
  //     render: () => (
  //       <button
  //       onClick={() => navigate("/edit-item")}
  //       className=" text-red-700 px-2 py-1 rounded-lg text-sm font-medium  transition-all duration-200">
  //         <SquarePen size={16} />
  //       </button>
  //     ),
  //   },
    {
      header: "View",
      render: () => (
        <button 
         type="button"
         onClick={() => navigate("/issue-detail")}
         className="text-indigo-600 font-medium hover:underline cursor-pointer transition-all duration-200">
         Detail
        </button>
      ),
    },
  ];

  const tableData = [
  {
    no: 1,
    user: "Kamal Perera",
    itemName: "Laptop",
    location: "COL-01",
    issueDate: "2026-02-20",
    dueDate: "2026-02-27",
    quantity: 1
  },
  {
    no: 2,
    user: "Nisali Fernando",
    itemName: "Projector",
    location: "Seminar Hall",
    issueDate: "2026-02-18",
    dueDate: "2026-02-25",
    quantity: 1
  },
  {
    no: 3,
    user: "Saman Jayasinghe",
    itemName: "Oscilloscope",
    location: "EML-01",
    issueDate: "2026-02-15",
    dueDate: "2026-02-28",
    quantity: 2
  },
  {
    no: 4,
    user: "Tharushi Silva",
    itemName: "Extension Cable",
    location: "EML-02",
    issueDate: "2026-02-22",
    dueDate: "2026-03-01",
    quantity: 5
  }
];

  return (
     <div className="px-6 py-4">
      {/* ================= Header ================= */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <LayoutGrid size={22} className="text-indigo-600" />
        </div>
        <h1 className="text-xl font-semibold text-gray-800">Overview</h1>
      </div>

      {/* ================= Cards Section ================= */}
      <section className="flex justify-center mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Left title */}
          <div className="flex items-center gap-2 text-neutral-900">
            <FileText size={25} className="text-indigo-600" />
            <span className="text-xl font-semibold">Detailed Report</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Issue button */}
            <button
              onClick={() => navigate("/add-item")}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-sm"
            >
              <Plus size={18} />
              Issue a New Item
            </button>

            {/* Filter dropdown */}
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 cursor-pointer rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="">Filter by</option>
                <option value="issue date">Issue Date</option>
                <option value="due date">Due Date</option>
                <option value="due in soon">Due in Soon</option>
                <option value="over due">Over Due</option>
              </select>

              <Filter size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                className="bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>
        <IssueTable columns={tableColumns} data={tableData} />
      </div>
    </div>
  );
};

export default Issue
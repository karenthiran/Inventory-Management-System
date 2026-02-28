import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueTable from "../components/layout/issue/IssueTable";
import {
  LayoutGrid,
  Plus,
  Hourglass,
  ClockAlert,
  ArrowRight,
  FileText,
  Filter,
  Search,
  SquarePen,
} from "lucide-react";
import DashboardCard from "../components/common/DashboardCard";
import PaginationBar from "../components/common/PaginationBar";

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

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5; // how many rows per page

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
          className="text-red-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-red-100 cursor-pointer transition-all duration-200"
          aria-label="Edit item"
        >
          <SquarePen size={16} />
        </button>
      ),
    },

    {
      header: "View",
      render: () => (
        <button
          type="button"
          onClick={() => navigate("/issue-detail")}
          className="text-indigo-600 font-medium hover:underline cursor-pointer transition-all duration-200"
        >
          Detail
        </button>
      ),
    },
  ];

  const tableData = useMemo(
    () => [
      {
        no: 1,
        user: "Kamal Perera",
        itemName: "Laptop",
        location: "COL-01",
        issueDate: "2026-02-20",
        dueDate: "2026-02-27",
        quantity: 1,
      },
      {
        no: 2,
        user: "Nisali Fernando",
        itemName: "Projector",
        location: "Seminar Hall",
        issueDate: "2026-02-18",
        dueDate: "2026-02-25",
        quantity: 1,
      },
      {
        no: 3,
        user: "Saman Jayasinghe",
        itemName: "Oscilloscope",
        location: "EML-01",
        issueDate: "2026-02-15",
        dueDate: "2026-02-28",
        quantity: 2,
      },
      {
        no: 4,
        user: "Tharushi Silva",
        itemName: "Extension Cable",
        location: "EML-02",
        issueDate: "2026-02-22",
        dueDate: "2026-03-01",
        quantity: 5,
      },
      {
        no: 5,
        user: "A. Nimal",
        itemName: "HDMI Cable",
        location: "COL-03",
        issueDate: "2026-02-10",
        dueDate: "2026-02-17",
        quantity: 3,
      },
      {
        no: 6,
        user: "R. Priya",
        itemName: "Wireless Mouse",
        location: "EML-03",
        issueDate: "2026-02-11",
        dueDate: "2026-02-18",
        quantity: 2,
      },
      {
        no: 7,
        user: "S. Ibrahim",
        itemName: "Keyboard",
        location: "COL-02",
        issueDate: "2026-02-12",
        dueDate: "2026-02-19",
        quantity: 4,
      },
      {
        no: 8,
        user: "T. Kavitha",
        itemName: "Power Bank",
        location: "COL-01",
        issueDate: "2026-02-13",
        dueDate: "2026-02-20",
        quantity: 1,
      },
      {
        no: 9,
        user: "M. Daniel",
        itemName: "Router",
        location: "Server Room",
        issueDate: "2026-02-14",
        dueDate: "2026-02-21",
        quantity: 1,
      },
      {
        no: 10,
        user: "N. Fathima",
        itemName: "Laser Printer",
        location: "EML-01",
        issueDate: "2026-02-15",
        dueDate: "2026-02-22",
        quantity: 1,
      },
      {
        no: 11,
        user: "K. Arun",
        itemName: "Arduino Uno",
        location: "Robotics Lab",
        issueDate: "2026-02-16",
        dueDate: "2026-02-23",
        quantity: 6,
      },
      {
        no: 12,
        user: "P. Sara",
        itemName: "Multimeter",
        location: "EML-02",
        issueDate: "2026-02-17",
        dueDate: "2026-02-24",
        quantity: 5,
      },
      {
        no: 13,
        user: "J. Kevin",
        itemName: "Tripod Stand",
        location: "Media Room",
        issueDate: "2026-02-18",
        dueDate: "2026-02-25",
        quantity: 2,
      },
      {
        no: 14,
        user: "L. Ayesha",
        itemName: "Extension Cord",
        location: "Workshop",
        issueDate: "2026-02-19",
        dueDate: "2026-02-26",
        quantity: 7,
      },
      {
        no: 15,
        user: "H. Chen",
        itemName: "Webcam",
        location: "COL-04",
        issueDate: "2026-02-20",
        dueDate: "2026-02-27",
        quantity: 2,
      },
    ],
    [],
  );

  const totalResults = tableData.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return tableData.slice(start, start + pageSize);
  }, [currentPage, tableData]);

  return (
    <div
      className="px-6 py-4 bg-white dark:bg-gray-900 
  min-h-screen transition-colors duration-300"
    >
      {/* ================= Header ================= */}
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
          <LayoutGrid
            size={22}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          Overview
        </h1>
      </div>

      {/* ================= Cards Section ================= */}
      <section className="flex justify-center mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* ================= Table Section ================= */}
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          {/* Left title */}
          <div className="flex items-center gap-2 text-neutral-900 dark:text-gray-200">
            <FileText
              size={25}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-xl font-semibold">Detailed Report</span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-4">
            {/* Issue button */}
            <button
              onClick={() => navigate("/add-item")}
              className="flex items-center gap-2 
            bg-indigo-600 hover:bg-indigo-700 
            dark:bg-indigo-500 dark:hover:bg-indigo-600
            cursor-pointer text-white px-4 py-2 
            rounded-lg text-sm font-medium 
            transition-all duration-200 shadow-sm"
            >
              <Plus size={18} />
              Issue a New Item
            </button>

            {/* Filter dropdown */}
            <div className="relative">
              <select
                className="appearance-none 
              bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              cursor-pointer rounded-lg 
              px-4 py-2 pr-10 text-sm 
              text-gray-700 dark:text-gray-200
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Filter by</option>
                <option value="issue date">Issue Date</option>
                <option value="due date">Due Date</option>
                <option value="due in soon">Due in Soon</option>
                <option value="over due">Over Due</option>
              </select>

              <Filter
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-500 dark:text-gray-400 pointer-events-none"
              />
            </div>

            {/* Search input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                className="bg-white dark:bg-gray-800 
              border border-gray-200 dark:border-gray-700 
              rounded-lg px-4 py-2 pr-10 text-sm 
              text-gray-700 dark:text-gray-200
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 
              text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <IssueTable columns={tableColumns} data={paginatedData} />

        {/* Pagination */}
        <PaginationBar
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Issue;

// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import IssueTable from "../components/layout/issue/IssueTable";
// import IssueItemForm from "../components/layout/issue/IssueItemForm";
// import {
//   LayoutGrid,
//   Plus,
//   Hourglass,
//   ClockAlert,
//   ArrowRight,
//   FileText,
//   Filter,
//   Search,
//   SquarePen,
// } from "lucide-react";
// import DashboardCard from "../components/common/DashboardCard";
// import PaginationBar from "../components/common/PaginationBar";

// /* =========================================================
//    📊 Issue Cards Data
// ========================================================= */
// const cardData = [
//   {
//     title: "Currently Issued",
//     value: "264",
//     subtitle: "Currently in used",
//     icon: <ArrowRight size={20} />,
//     gradient: "from-emerald-500 to-green-600",
//   },
//   {
//     title: "Due in Soon",
//     value: "125",
//     subtitle: "Ready to return",
//     icon: <Hourglass size={20} />,
//     gradient: "from-amber-500 to-orange-600",
//   },
//   {
//     title: "Over Due",
//     value: "25",
//     subtitle: "Return Deadline Passed",
//     icon: <ClockAlert size={20} />,
//     gradient: "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white",
//   },
// ];

// const Issue = () => {
//   const navigate = useNavigate();

//   /* =========================
//      Pagination
//   ========================== */
//   const [currentPage, setCurrentPage] = useState(1);
//   const pageSize = 5;

//   /* =========================
//      Modal State
//   ========================== */
//   const [showIssueModal, setShowIssueModal] = useState(false);
//   const [loading, setLoading] = useState(false);

//   /* =========================
//      Dynamic Table Data
//   ========================== */
//   const [tableData, setTableData] = useState([
//     {
//       no: 1,
//       user: "Kamal Perera",
//       itemName: "Laptop",
//       location: "COL-01",
//       issueDate: "2026-02-20",
//       dueDate: "2026-02-27",
//       quantity: 1,
//     },
//     {
//       no: 2,
//       user: "Nisali Fernando",
//       itemName: "Projector",
//       location: "Seminar Hall",
//       issueDate: "2026-02-18",
//       dueDate: "2026-02-25",
//       quantity: 1,
//     },
//     {
//       no: 3,
//       user: "Amal Fernando",
//       itemName: "Projector",
//       location: "Seminar Hall",
//       issueDate: "2026-02-18",
//       dueDate: "2026-02-25",
//       quantity: 1,
//     },
//     {
//       no: 3,
//       user: "Kamal Fernando",
//       itemName: "Projector",
//       location: "Seminar Hall",
//       issueDate: "2026-02-18",
//       dueDate: "2026-02-25",
//       quantity: 1,
//     },
//   ]);

//   /* =========================
//      Issue Logic
//   ========================== */
//   const handleIssueItem = async (newItem) => {
//     try {
//       setLoading(true);

//       // Simulate API call (replace with real backend later)
//       await new Promise((resolve) => setTimeout(resolve, 800));

//       const formattedItem = {
//         no: tableData.length + 1,
//         user: newItem.issueTo,
//         itemName: newItem.itemName,
//         location: newItem.itemNo,
//         issueDate: newItem.issueDate,
//         dueDate: newItem.dueDate,
//         quantity: newItem.quantity,
//       };

//       setTableData((prev) => [formattedItem, ...prev]);

//       setShowIssueModal(false);
//       setCurrentPage(1); // Reset to first page after adding
//     } catch (error) {
//       console.error("Issue failed:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================
//      Pagination Logic
//   ========================== */
//   const totalResults = tableData.length;
//   const totalPages = Math.ceil(totalResults / pageSize);

//   const paginatedData = useMemo(() => {
//     const start = (currentPage - 1) * pageSize;
//     return tableData.slice(start, start + pageSize);
//   }, [currentPage, tableData]);

//   /* =========================
//      Table Columns
//   ========================== */
//   const tableColumns = [
//     { header: "NO.", accessor: "no" },
//     { header: "User", accessor: "user" },
//     { header: "Item Name", accessor: "itemName" },
//     { header: "Location", accessor: "location" },
//     { header: "Issue Date", accessor: "issueDate" },
//     { header: "Due Date", accessor: "dueDate" },
//     { header: "Quantity", accessor: "quantity" },
//     {
//       header: "Action",
//       render: () => (
//         <button
//           type="button"
//           onClick={() => navigate("/edit-item")}
//           className="text-red-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
//         >
//           <SquarePen size={16} />
//         </button>
//       ),
//     },
//     {
//       header: "View",
//       render: () => (
//         <button
//           type="button"
//           onClick={() => navigate("/issue-detail")}
//           className="text-indigo-600 font-medium hover:underline"
//         >
//           Detail
//         </button>
//       ),
//     },
//   ];

//   return (
//     <div className="px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
//       {/* ================= Header ================= */}
//       <div className="flex items-center gap-3 mb-10">
//         <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
//           <LayoutGrid
//             size={22}
//             className="text-indigo-600 dark:text-indigo-400"
//           />
//         </div>
//         <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
//           Overview
//         </h1>
//       </div>

//       {/* ================= Cards Section ================= */}
//       <section className="flex justify-center mb-14">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
//           {cardData.map((card, index) => (
//             <DashboardCard key={index} {...card} />
//           ))}
//         </div>
//       </section>

//       {/* ================= Table Section ================= */}
//       <div className="max-w-7xl mx-auto">
//         {/* Top Bar */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-2 text-neutral-900 dark:text-gray-200">
//             <FileText
//               size={25}
//               className="text-indigo-600 dark:text-indigo-400"
//             />
//             <span className="text-xl font-semibold">Detailed Report</span>
//           </div>

//           <div className="flex items-center gap-4">
//             {/* Issue Button */}
//             <button
//               onClick={() => setShowIssueModal(true)}
//               className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
//             >
//               <Plus size={18} />
//               Issue a New Item
//             </button>
//             {/* Filter */}
//             <div className="relative">
//               <select
//                 className="
//       appearance-none
//       bg-white dark:bg-gray-800
//       text-gray-700 dark:text-gray-200
//       border border-gray-200 dark:border-gray-700
//       rounded-lg px-4 py-2 pr-10 text-sm
//       focus:outline-none
//       focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
//       transition
//     "
//               >
//                 <option className="bg-white dark:bg-gray-800" value="">
//                   Filter by
//                 </option>
//                 <option
//                   className="bg-white dark:bg-gray-800"
//                   value="issue date"
//                 >
//                   Issue Date
//                 </option>
//                 <option className="bg-white dark:bg-gray-800" value="due date">
//                   Due Date
//                 </option>
//                 <option
//                   className="bg-white dark:bg-gray-800"
//                   value="due in soon"
//                 >
//                   Due in Soon
//                 </option>
//                 <option className="bg-white dark:bg-gray-800" value="over due">
//                   Over Due
//                 </option>
//               </select>

//               <Filter
//                 size={16}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none"
//               />
//             </div>

//             {/* Search */}
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder="Search by name"
//                 className="
//       bg-white dark:bg-gray-800
//       text-gray-700 dark:text-gray-200
//       placeholder-gray-400 dark:placeholder-gray-500
//       border border-gray-200 dark:border-gray-700
//       rounded-lg px-4 py-2 pr-10 text-sm
//       focus:outline-none
//       focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400
//       transition
//     "
//               />
//               <Search
//                 size={16}
//                 className="
//       absolute right-3 top-1/2 -translate-y-1/2
//       text-gray-500 dark:text-gray-400
//       pointer-events-none
//     "
//               />
//             </div>
//           </div>
//         </div>

//         {/* Table */}
//         <IssueTable columns={tableColumns} data={paginatedData} />

//         {/* Pagination */}
//         <PaginationBar
//           totalResults={totalResults}
//           currentPage={currentPage}
//           totalPages={totalPages}
//           onPageChange={setCurrentPage}
//         />
//       </div>

//       {/* ================= Modal ================= */}
//       {showIssueModal && (
//         <IssueItemForm
//           onClose={() => setShowIssueModal(false)}
//           onIssueItem={handleIssueItem}
//           loading={loading}
//         />
//       )}
//     </div>
//   );
// };

// export default Issue;

import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import IssueTable from "../components/layout/issue/IssueTable";
import IssueItemForm from "../components/layout/issue/IssueItemForm";
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
import { useInventory } from "../context/InventoryContext";

/* =========================================================
   Issue Page
========================================================= */
const Issue = () => {
  const navigate = useNavigate();

  /* =========================
     GET FROM CONTEXT
  ========================== */
  const { issuedItems } = useInventory();

  /* =========================
     Pagination
  ========================== */
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  /* =========================
     Modal State
  ========================== */
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* =========================
     Search & Filter State
  ========================== */
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");

  /* =========================================================
     FILTERING LOGIC (Production Ready)
  ========================================================== */
  const filteredData = useMemo(() => {
    let data = [...issuedItems];
    const today = new Date();

    // Add dynamic numbering
    data = data.map((item, index) => ({
      no: index + 1,
      user: item.issueTo,
      itemName: item.itemName,
      location: item.itemNo,
      issueDate: item.issueDate,
      dueDate: item.dueDate,
      quantity: item.quantity,
      status: item.status,
    }));

    // 🔎 Search
    if (searchTerm.trim()) {
      data = data.filter(
        (item) =>
          item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 🎯 Filter
    if (filterType === "issue date") {
      data.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    }

    if (filterType === "due date") {
      data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (filterType === "due in soon") {
      data = data.filter((item) => {
        const diff = (new Date(item.dueDate) - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 3;
      });
    }

    if (filterType === "over due") {
      data = data.filter(
        (item) => new Date(item.dueDate) < today && item.status !== "Returned",
      );
    }

    return data;
  }, [issuedItems, searchTerm, filterType]);

  /* =========================
     Pagination
  ========================== */
  const totalResults = filteredData.length;
  const totalPages = Math.ceil(totalResults / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [currentPage, filteredData]);

  /* =========================
     Dashboard Cards (Dynamic)
  ========================== */
  const today = new Date();

  const currentlyIssued = issuedItems.filter(
    (item) => item.status === "Issued",
  ).length;

  const dueSoon = issuedItems.filter((item) => {
    const diff = (new Date(item.dueDate) - today) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 3 && item.status === "Issued";
  }).length;

  const overdue = issuedItems.filter(
    (item) => new Date(item.dueDate) < today && item.status !== "Returned",
  ).length;

  const cardData = [
    {
      title: "Currently Issued",
      value: currentlyIssued,
      subtitle: "Currently in use",
      icon: <ArrowRight size={20} />,
      gradient: "from-emerald-500 to-green-600",
    },
    {
      title: "Due in Soon",
      value: dueSoon,
      subtitle: "Ready to return",
      icon: <Hourglass size={20} />,
      gradient: "from-amber-500 to-orange-600",
    },
    {
      title: "Over Due",
      value: overdue,
      subtitle: "Return Deadline Passed",
      icon: <ClockAlert size={20} />,
      gradient:
        "bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white",
    },
  ];

  /* =========================
     Table Columns
  ========================== */
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
          className="text-red-700 px-2 py-1 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
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
          className="text-indigo-600 font-medium hover:underline"
        >
          Detail
        </button>
      ),
    },
  ];

  return (
    <div className="px-6 py-4 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header */}
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

      {/* Cards */}
      <section className="flex justify-center mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {cardData.map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>
      </section>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-neutral-900 dark:text-gray-200">
            <FileText
              size={25}
              className="text-indigo-600 dark:text-indigo-400"
            />
            <span className="text-xl font-semibold">Detailed Report</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowIssueModal(true)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm"
            >
              <Plus size={18} />
              Issue a New Item
            </button>

            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="">Filter by</option>
                <option value="issue date">Issue Date</option>
                <option value="due date">Due Date</option>
                <option value="due in soon">Due in Soon</option>
                <option value="over due">Over Due</option>
              </select>

              <Filter
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <IssueTable columns={tableColumns} data={paginatedData} />

        <PaginationBar
          totalResults={totalResults}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {showIssueModal && (
        <IssueItemForm
          onClose={() => setShowIssueModal(false)}
          onIssueItem={() => {}}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Issue;

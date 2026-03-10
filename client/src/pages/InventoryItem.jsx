// import React, { useState, useEffect, useRef, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import InventoryTable from "../components/layout/inventory/InventoryTable";
// import PaginationBar from "../components/common/PaginationBar";
// import AddItemform from "../components/layout/inventory/AddItemform";
// import { LayoutGrid, Filter, Search, ChevronRight } from "lucide-react";

// const InventoryItem = () => {
//   const navigate = useNavigate();

//   /* ================= STATES ================= */
//   const [currentPage, setCurrentPage] = useState(1);
//   const [showFilter, setShowFilter] = useState(false);
//   const [activeFilterType, setActiveFilterType] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);

//   /* ================= INVENTORY STATE ================= */
//   const [tableData, setTableData] = useState([
//     {
//       no: "01",
//       itemNumber: "228-3844-931-7689",
//       itemName: "Laptop",
//       category: "Computing",
//       location: "COL-01",
//       quantity: 5,
//     },
//     {
//       no: "02",
//       itemNumber: "661-7963-661-7963",
//       itemName: "Oscilloscope",
//       category: "Electronic",
//       location: "COL-02",
//       quantity: 7,
//     },
//     {
//       no: "03",
//       itemNumber: "958-4030-182-0187",
//       itemName: "Printer",
//       category: "Computing",
//       location: "COL-01",
//       quantity: 12,
//     },
//     {
//       no: "04",
//       itemNumber: "114-7821-556-9021",
//       itemName: "Projector",
//       category: "Electronic",
//       location: "COL-03",
//       quantity: 3,
//     },
//     {
//       no: "05",
//       itemNumber: "771-2290-443-1188",
//       itemName: "Router",
//       category: "Networking",
//       location: "COL-01",
//       quantity: 9,
//     },
//   ]);

//   const filterRef = useRef(null);
//   const ITEMS_PER_PAGE = 5;

//   /* ================= CLICK OUTSIDE FILTER ================= */
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (filterRef.current && !filterRef.current.contains(event.target)) {
//         setShowFilter(false);
//         setActiveFilterType(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   /* ================= ADD ITEM HANDLER ================= */
//   const handleAddItem = (newItem) => {
//     const newEntry = {
//       no: String(tableData.length + 1).padStart(2, "0"),
//       itemNumber: newItem.itemCode,
//       itemName: newItem.itemName,
//       category: newItem.category,
//       location: newItem.location,
//       quantity: Number(newItem.quantity),
//     };

//     setTableData((prev) => [...prev, newEntry]);
//     setShowModal(false);
//   };

//   /* ================= FILTER LABEL ================= */
//   const activeFilterLabel = useMemo(() => {
//     let labels = [];
//     if (selectedLocation) labels.push(selectedLocation);
//     if (selectedCategory) labels.push(selectedCategory);
//     return labels.join(" • ");
//   }, [selectedLocation, selectedCategory]);

//   /* ================= TABLE COLUMNS ================= */
//   const tableColumns = [
//     { header: "NO.", accessor: "no" },
//     { header: "Item Number", accessor: "itemNumber" },
//     { header: "Item Name", accessor: "itemName" },
//     { header: "Category", accessor: "category" },
//     { header: "Location", accessor: "location" },
//     { header: "Quantity", accessor: "quantity" },
//     {
//       header: "View",
//       render: () => (
//         <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
//           Detail
//         </button>
//       ),
//     },
//   ];

//   /* ================= DYNAMIC FILTER OPTIONS ================= */
//   const locationOptions = useMemo(
//     () => [...new Set(tableData.map((item) => item.location))],
//     [tableData],
//   );

//   const categoryOptions = useMemo(
//     () => [...new Set(tableData.map((item) => item.category))],
//     [tableData],
//   );

//   /* ================= FILTERING LOGIC ================= */
//   let filteredData = tableData;

//   if (selectedLocation) {
//     filteredData = filteredData.filter(
//       (item) => item.location === selectedLocation,
//     );
//   }

//   if (selectedCategory) {
//     filteredData = filteredData.filter(
//       (item) => item.category === selectedCategory,
//     );
//   }

//   if (searchTerm.trim() !== "") {
//     filteredData = filteredData.filter((item) =>
//       item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
//     );
//   }

//   /* ================= PAGINATION ================= */
//   const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedData = filteredData.slice(
//     startIndex,
//     startIndex + ITEMS_PER_PAGE,
//   );

//   /* Fix invalid page after filtering */
//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(1);
//     }
//   }, [filteredData.length]);

//   return (
//     <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
//       {/* ================= HEADER ================= */}
//       <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
//         <div className="flex items-center gap-3">
//           <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
//             <LayoutGrid
//               size={22}
//               className="text-indigo-600 dark:text-indigo-400"
//             />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//             Inventory Item List
//           </h1>
//         </div>

//         <div className="flex items-center gap-4 flex-wrap">
//           {/* ================= ADD ITEM ================= */}
//           <button
//             onClick={() => setShowModal(true)}
//             className="bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
//           >
//             <span className="text-lg font-bold">+</span>
//             Add New Item
//           </button>

//           {showModal && (
//             <AddItemform
//               onClose={() => setShowModal(false)}
//               onAddItem={handleAddItem}
//             />
//           )}

//           {/* ================= FILTER ================= */}
//           <div className="relative" ref={filterRef}>
//             <button
//               onClick={() => setShowFilter((prev) => !prev)}
//               className="flex items-center gap-2
//     bg-white dark:bg-gray-800
//     text-gray-700 dark:text-gray-200
//     border border-gray-200 dark:border-gray-700
//     rounded-lg px-4 py-2 text-sm
//     hover:bg-gray-50 dark:hover:bg-gray-700
//     transition"
//             >
//               <Filter size={16} />
//               {activeFilterLabel ? activeFilterLabel : "Filter"}
//             </button>

//             {showFilter && (
//               <div
//                 className="absolute right-0 mt-3 w-72
//     bg-white dark:bg-gray-800
//     rounded-xl shadow-xl
//     border border-gray-200 dark:border-gray-700
//     z-50"
//               >
//                 {!activeFilterType && (
//                   <div className="p-4 space-y-3">
//                     <div
//                       onClick={() => setActiveFilterType("location")}
//                       className="flex justify-between px-3 py-2 rounded-lg cursor-pointer
//             text-gray-700 dark:text-gray-200
//             hover:bg-gray-100 dark:hover:bg-gray-700
//             transition"
//                     >
//                       <span>Location</span>
//                       <ChevronRight size={16} />
//                     </div>

//                     <div
//                       onClick={() => setActiveFilterType("category")}
//                       className="flex justify-between px-3 py-2 rounded-lg cursor-pointer
//             text-gray-700 dark:text-gray-200
//             hover:bg-gray-100 dark:hover:bg-gray-700
//             transition"
//                     >
//                       <span>Category</span>
//                       <ChevronRight size={16} />
//                     </div>
//                   </div>
//                 )}

//                 {activeFilterType === "location" && (
//                   <div className="p-4 space-y-2">
//                     {locationOptions.map((loc) => (
//                       <div
//                         key={loc}
//                         onClick={() => {
//                           setSelectedLocation(loc);
//                           setSelectedCategory(null);
//                           setCurrentPage(1);
//                           setShowFilter(false);
//                           setActiveFilterType(null);
//                         }}
//                         className="px-3 py-2 rounded-lg cursor-pointer
//               text-gray-700 dark:text-gray-200
//               hover:bg-indigo-100 dark:hover:bg-indigo-600
//               hover:text-indigo-700 dark:hover:text-white
//               transition"
//                       >
//                         {loc}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {activeFilterType === "category" && (
//                   <div className="p-4 space-y-2">
//                     {categoryOptions.map((cat) => (
//                       <div
//                         key={cat}
//                         onClick={() => {
//                           setSelectedCategory(cat);
//                           setSelectedLocation(null);
//                           setCurrentPage(1);
//                           setShowFilter(false);
//                           setActiveFilterType(null);
//                         }}
//                         className="px-3 py-2 rounded-lg cursor-pointer
//               text-gray-700 dark:text-gray-200
//               hover:bg-indigo-100 dark:hover:bg-indigo-600
//               hover:text-indigo-700 dark:hover:text-white
//               transition"
//                       >
//                         {cat}
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 <div
//                   onClick={() => {
//                     setSelectedLocation(null);
//                     setSelectedCategory(null);
//                     setSearchTerm("");
//                     setCurrentPage(1);
//                     setShowFilter(false);
//                     setActiveFilterType(null);
//                   }}
//                   className="text-red-500 dark:text-red-400 text-sm
//         px-4 py-3 cursor-pointer
//         hover:underline
//         border-t border-gray-200 dark:border-gray-700"
//                 >
//                   Clear Filter
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ================= SEARCH ================= */}
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Search by name"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//               className="bg-white dark:bg-gray-800
//     text-gray-700 dark:text-gray-200
//     border border-gray-200 dark:border-gray-700
//     rounded-lg px-4 py-2 pr-10 text-sm
//     focus:outline-none focus:ring-2 focus:ring-indigo-500
//     transition"
//             />
//             <Search
//               size={16}
//               className="absolute right-3 top-1/2 -translate-y-1/2
//     text-gray-400 dark:text-gray-300"
//             />
//           </div>
//         </div>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-4">
//         <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm">
//           <InventoryTable columns={tableColumns} data={paginatedData} />
//         </div>

//         <div className="mt-4">
//           <PaginationBar
//             totalResults={filteredData.length}
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={(page) => setCurrentPage(page)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InventoryItem;

import {
  CheckCircle2,
  ChevronRight,
  Edit,
  Filter,
  LayoutGrid,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../components/common/ConfirmModal";
import PaginationBar from "../components/common/PaginationBar";
import AddItemform from "../components/layout/inventory/AddItemform";
import EditItemForm from "../components/layout/inventory/EditItemForm";
import InventoryDetails from "../components/layout/inventory/InventoryDetails";
import InventoryTable from "../components/layout/inventory/InventoryTable";
import { useInventory } from "../context/InventoryContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const InventoryItem = () => {
  const navigate = useNavigate();
  const { tableData, setTableData, addItem } = useInventory();

  /* STATES  */
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    show: false,
    itemCode: null,
  });
  const [successToast, setSuccessToast] = useState({
    show: false,
    message: "",
  });

  const filterRef = useRef(null);
  const ITEMS_PER_PAGE = 5;

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/inventory/all`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);
        const data = await response.json();

        if (setTableData) setTableData(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, [setTableData]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClick = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setShowFilter(false);
        setActiveFilterType(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Helper to update the context state locally after successful API call
  const handleUpdateLocalData = (updatedItem) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.itemCode === updatedItem.itemCode ? updatedItem : item,
      ),
    );
  };

  // 1. delete handler that opens the confirmation modal
  const initiateDelete = (itemCode) => {
    setDeleteModal({ show: true, itemCode });
  };

  // 2. This runs when the user clicks "Delete" inside the popup
  const confirmDelete = async () => {
    const { itemCode } = deleteModal;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/inventory/delete/${itemCode}`,
        { method: "DELETE" },
      );

      if (!response.ok) throw new Error("Failed to delete");

      // Remove from local state
      setTableData((prev) => prev.filter((item) => item.itemCode !== itemCode));

      // Show success popup
      setSuccessToast({
        show: true,
        message: `Item ${itemCode} deleted successfully!`,
      });

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSuccessToast({ show: false, message: "" }), 3000);
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting item. Please try again.");
    } finally {
      // Close the confirmation modal
      setDeleteModal({ show: false, itemCode: null });
    }
  };

  /* TABLE COLUMNS*/
  const tableColumns = [
    {
      header: "No.",
      accessor: "no",
      render: (_, index) => {
        // Calculate number based on current page and row index
        const rowNumber = startIndex + index + 1;
        return rowNumber.toString().padStart(2, "0");
      },
    },
    { header: "Code", accessor: "itemCode" },
    { header: "Item Name", accessor: "itemName" },
    {
      header: "Category",
      accessor: "category",
      render: (row) => row.category?.categoryName || "N/A",
    },
    {
      header: "Location",
      accessor: "location",
      render: (row) => row.location?.locationName || "N/A",
    },
    { header: "Qty", accessor: "quantity" },
    {
      header: "Details",
      render: (row) => (
        <button
          onClick={() => {
            const flattenedItem = {
              ...row,
              // Extract names from nested objects for the modal
              category: row.category?.categoryName || "N/A",
              location: row.location?.locationName || "N/A",
              itemType: row.itemType?.typeName || "N/A", // Added this line
            };
            setSelectedItem(flattenedItem);
            setShowDetailModal(true);
          }}
          className='text-indigo-600 dark:text-indigo-400 font-medium hover:underline'
        >
          Detail
        </button>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        const status = row.status || "Available"; // Default fallback
        const statusStyles = {
          Available: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          Lent: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          Maintenance: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          Damaged: "text-red-500 bg-red-500/10 border-red-500/20",
        };

        return (
          <span
            className={`px-2 py-1 rounded text-[10px] font-bold border ${
              statusStyles[status] ||
              "text-gray-500 bg-gray-500/10 border-gray-500/20"
            }`}
          >
            {status.toUpperCase()}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className='flex items-center gap-3'>
          <button
            onClick={() => {
              setItemToEdit(row); // Set the row data
              setShowEditModal(true); // Open Popup
            }}
            className='text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors'
            title='Edit'
          >
            <Edit size={20} strokeWidth={1.25} />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => initiateDelete(row.itemCode)} // CALLS THE POPUP
            className='text-red-600 dark:text-red-400 hover:text-red-800 transition-colors'
            title='Delete'
          >
            <Trash2 size={20} strokeWidth={1.25} />
          </button>
        </div>
      ),
    },
  ];

  /* ================= DYNAMIC FILTER OPTIONS ================= */
  const locationOptions = useMemo(
    () =>
      [...new Set(tableData.map((item) => item.location?.locationName))].filter(
        Boolean,
      ),
    [tableData],
  );

  const categoryOptions = useMemo(
    () =>
      [...new Set(tableData.map((item) => item.category?.categoryName))].filter(
        Boolean,
      ),
    [tableData],
  );

  /* ================= FILTERING LOGIC ================= */
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchesLocation =
        !selectedLocation || item.location?.locationName === selectedLocation;
      const matchesCategory =
        !selectedCategory || item.category?.categoryName === selectedCategory;
      const matchesSearch =
        !searchTerm ||
        item.itemName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesLocation && matchesCategory && matchesSearch;
    });
  }, [tableData, selectedLocation, selectedCategory, searchTerm]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className='h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300'>
      {/* HEADER SECTION */}
      <div className='flex items-center justify-between mb-6 flex-wrap gap-4'>
        <div className='flex items-center gap-3'>
          <div className='bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg'>
            <LayoutGrid
              size={22}
              className='text-indigo-600 dark:text-indigo-400'
            />
          </div>
          <h1 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
            Inventory Management
          </h1>
        </div>

        <div className='flex items-center gap-4 flex-wrap'>
          <button
            onClick={() => setShowModal(true)}
            className='bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2'
          >
            <span className='text-lg font-bold'>+</span> Add Item
          </button>

          {/* FILTER DROPDOWN */}
          <div className='relative' ref={filterRef}>
            <button
              onClick={() => setShowFilter(!showFilter)}
              className='flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition'
            >
              <Filter size={16} />
              {selectedLocation || selectedCategory || "Filter"}
            </button>

            {showFilter && (
              <div className='absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden'>
                {!activeFilterType ? (
                  <div className='p-2'>
                    <div
                      onClick={() => setActiveFilterType("location")}
                      className='flex justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                    >
                      <span className='dark:text-gray-200'>Location</span>{" "}
                      <ChevronRight size={16} />
                    </div>
                    <div
                      onClick={() => setActiveFilterType("category")}
                      className='flex justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                    >
                      <span className='dark:text-gray-200'>Category</span>{" "}
                      <ChevronRight size={16} />
                    </div>
                  </div>
                ) : (
                  <div className='p-3'>
                    <button
                      onClick={() => setActiveFilterType(null)}
                      className='text-xs text-indigo-500 mb-2 font-semibold hover:underline'
                    >
                      ← Back to Filters
                    </button>
                    <div className='max-h-60 overflow-y-auto space-y-1'>
                      {(activeFilterType === "location"
                        ? locationOptions
                        : categoryOptions
                      ).map((opt) => (
                        <div
                          key={opt}
                          onClick={() => {
                            if (activeFilterType === "location") {
                              setSelectedLocation(opt);
                              setSelectedCategory(null);
                            } else {
                              setSelectedCategory(opt);
                              setSelectedLocation(null);
                            }
                            setCurrentPage(1);
                            setShowFilter(false);
                            setActiveFilterType(null);
                          }}
                          className='px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-600 transition'
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div
                  onClick={() => {
                    setSelectedLocation(null);
                    setSelectedCategory(null);
                    setSearchTerm("");
                    setShowFilter(false);
                  }}
                  className='text-center text-red-500 text-xs py-3 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 border-t border-gray-100 dark:border-gray-700'
                >
                  Reset All Filters
                </div>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <div className='relative'>
            <input
              type='text'
              placeholder='Search item...'
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className='bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 transition'
            />
            <Search
              size={16}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'
            />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className='flex-1 flex flex-col max-w-7xl mx-auto w-full'>
        <div className='flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 relative'>
          {loading ? (
            <div className='absolute inset-0 flex items-center justify-center'>
              <Loader2 className='animate-spin text-indigo-500' size={40} />
            </div>
          ) : (
            <InventoryTable columns={tableColumns} data={paginatedData} />
          )}
        </div>

        <div className='mt-4'>
          <PaginationBar
            totalResults={filteredData.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {showModal && (
        <AddItemform
          onClose={() => setShowModal(false)}
          onAddItem={(newItem) => {
            addItem(newItem);
            setShowModal(false);
          }}
        />
      )}

      {showDetailModal && (
        <InventoryDetails
          item={selectedItem}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showEditModal && itemToEdit && (
        <EditItemForm
          item={itemToEdit}
          onClose={() => {
            setShowEditModal(false);
            setItemToEdit(null);
          }}
          onUpdate={handleUpdateLocalData}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={deleteModal.show}
        title='Confirm Deletion'
        message={`Are you sure you want to permanently remove item ${deleteModal.itemCode}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteModal({ show: false, itemCode: null })}
      />

      {/* SUCCESS TOAST POPUP */}
      {successToast.show && (
        <div className='fixed top-5 right-5 z-110 flex items-center gap-3 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl animate-in slide-in-from-right-full'>
          <CheckCircle2 size={20} />
          <span className='font-medium'>{successToast.message}</span>
        </div>
      )}
    </div>
  );
};

export default InventoryItem;

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../components/layout/inventory/InventoryTable";
import PaginationBar from "../components/common/PaginationBar";
import AddItemform from "../components/layout/inventory/AddItemform";
import { LayoutGrid, Filter, Search, ChevronRight } from "lucide-react";

const InventoryItem = () => {
  const navigate = useNavigate();

  /* ================= STATES ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  /* ================= INVENTORY STATE ================= */
  const [tableData, setTableData] = useState([
    {
      no: "01",
      itemNumber: "228-3844-931-7689",
      itemName: "Laptop",
      category: "Computing",
      location: "COL-01",
      quantity: 5,
    },
    {
      no: "02",
      itemNumber: "661-7963-661-7963",
      itemName: "Oscilloscope",
      category: "Electronic",
      location: "COL-02",
      quantity: 7,
    },
    {
      no: "03",
      itemNumber: "958-4030-182-0187",
      itemName: "Printer",
      category: "Computing",
      location: "COL-01",
      quantity: 12,
    },
    {
      no: "04",
      itemNumber: "114-7821-556-9021",
      itemName: "Projector",
      category: "Electronic",
      location: "COL-03",
      quantity: 3,
    },
    {
      no: "05",
      itemNumber: "771-2290-443-1188",
      itemName: "Router",
      category: "Networking",
      location: "COL-01",
      quantity: 9,
    },
  ]);

  const filterRef = useRef(null);
  const ITEMS_PER_PAGE = 5;

  /* ================= CLICK OUTSIDE FILTER ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilter(false);
        setActiveFilterType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= ADD ITEM HANDLER ================= */
  const handleAddItem = (newItem) => {
    const newEntry = {
      no: String(tableData.length + 1).padStart(2, "0"),
      itemNumber: newItem.itemCode,
      itemName: newItem.itemName,
      category: newItem.category,
      location: newItem.location,
      quantity: Number(newItem.quantity),
    };

    setTableData((prev) => [...prev, newEntry]);
    setShowModal(false);
  };

  /* ================= FILTER LABEL ================= */
  const activeFilterLabel = useMemo(() => {
    let labels = [];
    if (selectedLocation) labels.push(selectedLocation);
    if (selectedCategory) labels.push(selectedCategory);
    return labels.join(" • ");
  }, [selectedLocation, selectedCategory]);

  /* ================= TABLE COLUMNS ================= */
  const tableColumns = [
    { header: "NO.", accessor: "no" },
    { header: "Item Number", accessor: "itemNumber" },
    { header: "Item Name", accessor: "itemName" },
    { header: "Category", accessor: "category" },
    { header: "Location", accessor: "location" },
    { header: "Quantity", accessor: "quantity" },
    {
      header: "View",
      render: () => (
        <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
          Detail
        </button>
      ),
    },
  ];

  /* ================= DYNAMIC FILTER OPTIONS ================= */
  const locationOptions = useMemo(
    () => [...new Set(tableData.map((item) => item.location))],
    [tableData],
  );

  const categoryOptions = useMemo(
    () => [...new Set(tableData.map((item) => item.category))],
    [tableData],
  );

  /* ================= FILTERING LOGIC ================= */
  let filteredData = tableData;

  if (selectedLocation) {
    filteredData = filteredData.filter(
      (item) => item.location === selectedLocation,
    );
  }

  if (selectedCategory) {
    filteredData = filteredData.filter(
      (item) => item.category === selectedCategory,
    );
  }

  if (searchTerm.trim() !== "") {
    filteredData = filteredData.filter((item) =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  /* Fix invalid page after filtering */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [filteredData.length]);

  return (
    <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 dark:bg-indigo-900/40 p-2 rounded-lg">
            <LayoutGrid
              size={22}
              className="text-indigo-600 dark:text-indigo-400"
            />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Inventory Item List
          </h1>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* ================= ADD ITEM ================= */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600 transition flex items-center gap-2"
          >
            <span className="text-lg font-bold">+</span>
            Add New Item
          </button>

          {showModal && (
            <AddItemform
              onClose={() => setShowModal(false)}
              onAddItem={handleAddItem}
            />
          )}

          {/* ================= FILTER ================= */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center gap-2 
    bg-white dark:bg-gray-800 
    text-gray-700 dark:text-gray-200
    border border-gray-200 dark:border-gray-700 
    rounded-lg px-4 py-2 text-sm 
    hover:bg-gray-50 dark:hover:bg-gray-700 
    transition"
            >
              <Filter size={16} />
              {activeFilterLabel ? activeFilterLabel : "Filter"}
            </button>

            {showFilter && (
              <div
                className="absolute right-0 mt-3 w-72 
    bg-white dark:bg-gray-800 
    rounded-xl shadow-xl 
    border border-gray-200 dark:border-gray-700 
    z-50"
              >
                {!activeFilterType && (
                  <div className="p-4 space-y-3">
                    <div
                      onClick={() => setActiveFilterType("location")}
                      className="flex justify-between px-3 py-2 rounded-lg cursor-pointer 
            text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-700 
            transition"
                    >
                      <span>Location</span>
                      <ChevronRight size={16} />
                    </div>

                    <div
                      onClick={() => setActiveFilterType("category")}
                      className="flex justify-between px-3 py-2 rounded-lg cursor-pointer 
            text-gray-700 dark:text-gray-200
            hover:bg-gray-100 dark:hover:bg-gray-700 
            transition"
                    >
                      <span>Category</span>
                      <ChevronRight size={16} />
                    </div>
                  </div>
                )}

                {activeFilterType === "location" && (
                  <div className="p-4 space-y-2">
                    {locationOptions.map((loc) => (
                      <div
                        key={loc}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setSelectedCategory(null);
                          setCurrentPage(1);
                          setShowFilter(false);
                          setActiveFilterType(null);
                        }}
                        className="px-3 py-2 rounded-lg cursor-pointer 
              text-gray-700 dark:text-gray-200
              hover:bg-indigo-100 dark:hover:bg-indigo-600 
              hover:text-indigo-700 dark:hover:text-white
              transition"
                      >
                        {loc}
                      </div>
                    ))}
                  </div>
                )}

                {activeFilterType === "category" && (
                  <div className="p-4 space-y-2">
                    {categoryOptions.map((cat) => (
                      <div
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setSelectedLocation(null);
                          setCurrentPage(1);
                          setShowFilter(false);
                          setActiveFilterType(null);
                        }}
                        className="px-3 py-2 rounded-lg cursor-pointer 
              text-gray-700 dark:text-gray-200
              hover:bg-indigo-100 dark:hover:bg-indigo-600 
              hover:text-indigo-700 dark:hover:text-white
              transition"
                      >
                        {cat}
                      </div>
                    ))}
                  </div>
                )}

                <div
                  onClick={() => {
                    setSelectedLocation(null);
                    setSelectedCategory(null);
                    setSearchTerm("");
                    setCurrentPage(1);
                    setShowFilter(false);
                    setActiveFilterType(null);
                  }}
                  className="text-red-500 dark:text-red-400 text-sm 
        px-4 py-3 cursor-pointer 
        hover:underline 
        border-t border-gray-200 dark:border-gray-700"
                >
                  Clear Filter
                </div>
              </div>
            )}
          </div>

          {/* ================= SEARCH ================= */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white dark:bg-gray-800 
    text-gray-700 dark:text-gray-200
    border border-gray-200 dark:border-gray-700 
    rounded-lg px-4 py-2 pr-10 text-sm 
    focus:outline-none focus:ring-2 focus:ring-indigo-500
    transition"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 
    text-gray-400 dark:text-gray-300"
            />
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-4">
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <InventoryTable columns={tableColumns} data={paginatedData} />
        </div>

        <div className="mt-4">
          <PaginationBar
            totalResults={filteredData.length}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </div>
  );
};

export default InventoryItem;

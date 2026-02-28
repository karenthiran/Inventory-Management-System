import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import InventoryTable from "../components/layout/inventory/InventoryTable";
import PaginationBar from "../components/common/PaginationBar";
import { LayoutGrid, Plus, Filter, Search, ChevronRight } from "lucide-react";

const InventoryItem = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilterType, setActiveFilterType] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filterRef = useRef(null);
  const ITEMS_PER_PAGE = 5;

  /* ================= Click Outside Close ================= */
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

  /* ================= Active Filter Label (NEW LOGIC) ================= */
  const activeFilterLabel = useMemo(() => {
    let labels = [];
    if (selectedLocation) labels.push(selectedLocation);
    if (selectedCategory) labels.push(selectedCategory);
    return labels.join(" • ");
  }, [selectedLocation, selectedCategory]);

  /* ================= Table Columns ================= */
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

  /* ================= Table Data ================= */
  const tableData = [
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
    {
      no: "06",
      itemNumber: "662-9033-781-5520",
      itemName: "Multimeter",
      category: "Electronic",
      location: "COL-02",
      quantity: 15,
    },
    {
      no: "07",
      itemNumber: "905-3321-667-4412",
      itemName: "Desktop Computer",
      category: "Computing",
      location: "COL-04",
      quantity: 6,
    },
    {
      no: "08",
      itemNumber: "318-7740-902-6631",
      itemName: "Keyboard",
      category: "Accessories",
      location: "COL-03",
      quantity: 25,
    },
    {
      no: "09",
      itemNumber: "440-1288-554-9902",
      itemName: "Mouse",
      category: "Accessories",
      location: "COL-03",
      quantity: 30,
    },
    {
      no: "10",
      itemNumber: "552-6671-223-8044",
      itemName: "Power Supply Unit",
      category: "Hardware",
      location: "COL-02",
      quantity: 8,
    },
  ];

  /* ================= Dynamic Filter Options ================= */
  const locationOptions = useMemo(
    () => [...new Set(tableData.map((item) => item.location))],
    [tableData],
  );

  const categoryOptions = useMemo(
    () => [...new Set(tableData.map((item) => item.category))],
    [tableData],
  );

  /* ================= Filtering Logic ================= */
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

  /* ================= Pagination ================= */
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="h-full flex flex-col px-6 py-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
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
          <button
            onClick={() => navigate("/add-item")}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          >
            <Plus size={18} />
            Add New Item
          </button>

          {/* ================= FILTER ================= */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilter((prev) => !prev)}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <Filter size={16} />
              {activeFilterLabel ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  {activeFilterLabel}
                </span>
              ) : (
                <span>Filter</span>
              )}
            </button>

            {/* 🔽 Your entire existing dropdown remains exactly the same below */}

            {showFilter && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                {!activeFilterType && (
                  <div className="p-4 space-y-3">
                    <div
                      onClick={() => setActiveFilterType("location")}
                      className="flex justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>Location</span>
                      <ChevronRight size={16} />
                    </div>

                    <div
                      onClick={() => setActiveFilterType("category")}
                      className="flex justify-between px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
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
                        className="px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
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
                        className="px-3 py-2 rounded-lg cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
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
                    setSearchTerm(""); // also clear search
                    setActiveFilterType(null);
                    setShowFilter(false);
                    setCurrentPage(1);
                  }}
                  className="text-red-500 text-sm px-4 py-3 cursor-pointer hover:underline border-t border-gray-200 dark:border-gray-700"
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
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 pr-10 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
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

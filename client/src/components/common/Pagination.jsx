import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  totalItems = 0,
  itemsPerPage = 10,
  currentPage = 1,
  onPageChange,
}) => {
  // Prevent divide-by-zero
  const totalPages =
    itemsPerPage > 0 ? Math.ceil(totalItems / itemsPerPage) : 0;

  // Hide pagination if only 1 page
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];

    // If small number of pages → show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 4) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPages - 3) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 px-6 py-3 rounded-md mt-6">
      {/* Left Side - Results Count */}
      <p className="text-sm text-gray-600">{totalItems} results</p>

      {/* Right Side - Page Buttons */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page Numbers */}
        {generatePages().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500 text-sm">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition
                ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              {page}
            </button>
          ),
        )}

        {/* Next Button */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-full hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;

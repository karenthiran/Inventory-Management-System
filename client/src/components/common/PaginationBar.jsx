import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBar = ({
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showLeft = [1, 2, 3, 4];
    const showRight = [totalPages - 1, totalPages];

    if (currentPage <= 4) {
      pages.push(...showLeft, "…", ...showRight);
      return pages;
    }

    if (currentPage >= totalPages - 3) {
      pages.push(
        1,
        2,
        "…",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
      return pages;
    }

    pages.push(
      1,
      "…",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "…",
      totalPages,
    );
    return pages;
  };

  const pages = getPages();

  const goTo = (p) => {
    if (!onPageChange) return;
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div className="flex items-center justify-between py-4">
      {/* Left */}
      <p className="text-sm text-neutral-900 dark:text-gray-300">
        {totalResults} results
      </p>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md 
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-2">
          {pages.map((p, idx) =>
            p === "…" ? (
              <span
                key={`${p}-${idx}`}
                className="px-2 text-sm text-gray-600 dark:text-gray-400"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  p === currentPage
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md 
          text-gray-700 dark:text-gray-300
          hover:bg-gray-100 dark:hover:bg-gray-700
          disabled:opacity-40 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;

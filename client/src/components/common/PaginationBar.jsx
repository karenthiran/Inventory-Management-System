import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaginationBar = ({
  totalResults = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const getPages = () => {
    // builds: 1 2 3 4 ... 10 11 style
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const showLeft = [1, 2, 3, 4];
    const showRight = [totalPages - 1, totalPages];

    // If current page is near the start
    if (currentPage <= 4) {
      pages.push(...showLeft, "…", ...showRight);
      return pages;
    }

    // If current page is near the end
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

    // Middle
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
      {/* left */}
      <p className="text-sm text-neutral-900">{totalResults} results</p>

      {/* right */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => goTo(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          {pages.map((p, idx) =>
            p === "…" ? (
              <span key={`${p}-${idx}`} className="px-2 text-sm text-gray-600">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => goTo(p)}
                className={`w-9 h-9 rounded-full text-sm font-medium ${
                  p === currentPage
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700"
                }`}
                aria-label={`Go to page ${p}`}
              >
                {p}
              </button>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={() => goTo(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default PaginationBar;

import axios from "axios";
import { LogOut, Mail, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Email from "../../pages/Email";
import InventoryDetails from "../layout/inventory/InventoryDetails";
import ThemeToggle from "./ThemeToggle";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isEmailOpen, setIsEmailOpen] = useState(false);

  // ✅ Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const searchRef = useRef(null);

  const routeTitles = {
    "/dashboard/home": "Home",
    "/dashboard/inventory": "Inventory Item",
    "/dashboard/issue": "Issue",
    "/dashboard/return": "Return",
    "/dashboard/maintenance": "Maintenance",
    "/dashboard/report": "Reports",
    "/dashboard/setting": "Settings",
    "/dashboard/userprofile": "User Profile",
  };

  const title = routeTitles[location.pathname] || "Dashboard";

  // ✅ Fetch inventory once on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/inventory/all`)
      .then((res) => setInventory(res.data))
      .catch((err) => console.error("Inventory fetch error:", err));
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Filter inventory by item name
  const filteredItems = searchTerm.trim()
    ? inventory.filter((item) =>
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleSelectItem = (item) => {
    setSelectedItem({
      itemCode: item.itemCode,
      itemName: item.itemName,
      category: item.category?.categoryName || item.category || "N/A",
      location: item.location?.locationName || item.location || "N/A",
      quantity: item.quantity,
      itemType: item.itemType?.typeName || item.itemType || "N/A",
      description: item.description,
    });
    setSearchTerm("");
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <>
      <div className="fixed top-0 left-64 right-0 h-16 bg-gray-100 dark:bg-gray-900 px-8 flex items-center justify-between border-b border-gray-300 dark:border-gray-700 z-40">
        <h1 className="text-2xl font-semibold text-indigo-600 dark:text-white">
          {title}
        </h1>

        <div className="flex items-center gap-6">
          {/* ✅ Search with dropdown */}
          <div className="relative" ref={searchRef}>
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchTerm && setShowResults(true)}
              className="w-72 bg-gray-200 dark:bg-gray-800 rounded-lg py-2 pl-10 pr-8 text-sm text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-400"
            />
            {/* Clear button */}
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}

            {/* Search results dropdown */}
            {showResults && filteredItems.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-[9999] max-h-64 overflow-y-auto">
                {filteredItems.map((item) => (
                  <div
                    key={item.itemCode}
                    onClick={() => handleSelectItem(item)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer border-b last:border-0 border-gray-100 dark:border-gray-700"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0">
                      <Search size={12} className="text-indigo-500" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">
                        {item.itemName}
                      </div>
                      <div className="text-[10px] text-gray-400 font-mono">
                        {item.itemCode}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No results */}
            {showResults && searchTerm.trim() && filteredItems.length === 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-[9999] px-4 py-3 text-sm text-gray-400 italic">
                No items found for "{searchTerm}"
              </div>
            )}
          </div>

          <button onClick={() => setIsEmailOpen(true)} className="relative">
            <Mail
              size={20}
              className="text-indigo-500 hover:scale-110 transition cursor-pointer"
            />
          </button>

          <ThemeToggle />

          <LogOut
            size={20}
            className="text-red-500 cursor-pointer hover:scale-110 transition"
            onClick={handleLogout}
          />
        </div>
      </div>

      {/* ✅ Inventory Detail Modal */}
      {selectedItem && (
        <InventoryDetails
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}

      <Email isOpen={isEmailOpen} onClose={() => setIsEmailOpen(false)} />
    </>
  );
};

export default Topbar;

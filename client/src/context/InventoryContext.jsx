import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context)
    throw new Error("useInventory must be used within InventoryProvider");
  return context;
};

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const InventoryProvider = ({ children }) => {
  const [tableData, setTableData] = useState([]);
  const [issuedItems, setIssuedItems] = useState([]);
  const [loading, setLoading] = useState(false); // Handles button disable/spinner states

  /* =========================================================
      ADD NEW INVENTORY ITEM (API Call)
  ========================================================== */
  const addItem = async (itemPayload) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/inventory/add`,
        itemPayload,
      );

      if (response.status === 200 || response.status === 201) {
        setTableData((prev) => [...prev, response.data]);
        return { success: true };
      }
    } catch (error) {
      console.error("Database Error:", error.response?.data || error.message);
      alert(
        "Failed to save: " +
          (error.response?.data?.message ||
            "Check if Item Code already exists"),
      );
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
      FETCH ALL ITEMS (Recommended to call on page load)
  ========================================================== */
  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/inventory/all`);
      setTableData(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  }, []);

  const value = useMemo(
    () => ({
      tableData,
      setTableData,
      issuedItems,
      loading,
      addItem,
      fetchInventory,
    }),
    [tableData, issuedItems, loading, addItem, fetchInventory],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

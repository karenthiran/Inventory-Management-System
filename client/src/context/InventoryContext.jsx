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
  if (!context) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  /* =========================================================
     INVENTORY STOCK DATA (Initialized as empty array)
  ========================================================== */
  const [tableData, setTableData] = useState([]);

  /* =========================================================
     ISSUED ITEMS DATA
  ========================================================== */
  const [issuedItems, setIssuedItems] = useState([]);

  /* =========================================================
     ADD NEW INVENTORY ITEM (Updated for Postman structure)
  ========================================================== */
  const addItem = useCallback((newItem) => {
    setTableData((prev) => [
      ...prev,
      {
        itemCode: newItem.itemCode,
        itemName: newItem.itemName,
        quantity: Number(newItem.quantity),
        itemType: newItem.itemType,
        description: newItem.description,
        category: newItem.category, // Object: { categoryId, categoryName }
        location: newItem.location, // Object: { locationId, locationName }
      },
    ]);
  }, []);

  /* =========================================================
     REDUCE STOCK WHEN ITEM IS ISSUED
  ========================================================== */
  const issueItem = useCallback((itemCode, quantity) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.itemCode === itemCode
          ? {
              ...item,
              quantity: Math.max(0, item.quantity - quantity),
            }
          : item,
      ),
    );
  }, []);

  /* =========================================================
     STORE ISSUE RECORD
  ========================================================== */
  const addIssuedItem = useCallback((issueData) => {
    setIssuedItems((prev) => [
      {
        id: Date.now(),
        ...issueData,
        status: new Date(issueData.dueDate) < new Date() ? "Overdue" : "Issued",
      },
      ...prev,
    ]);
  }, []);

  /* =========================================================
     RETURN ITEM
  ========================================================== */
  const returnItem = useCallback(
    (id) => {
      const returnedItem = issuedItems.find((item) => item.id === id);

      if (returnedItem) {
        setIssuedItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: "Returned" } : item,
          ),
        );

        setTableData((prev) =>
          prev.map((item) =>
            item.itemCode === returnedItem.itemCode
              ? {
                  ...item,
                  quantity: item.quantity + returnedItem.quantity,
                }
              : item,
          ),
        );
      }
    },
    [issuedItems],
  );

  /* =========================================================
     CONTEXT VALUE (Added setTableData)
  ========================================================== */
  const value = useMemo(
    () => ({
      tableData,
      setTableData, // <--- CRITICAL: Allow components to update with API data
      issuedItems,
      addItem,
      issueItem,
      addIssuedItem,
      returnItem,
    }),
    [tableData, issuedItems, addItem, issueItem, addIssuedItem, returnItem],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

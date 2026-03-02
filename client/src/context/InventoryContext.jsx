import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
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
     INVENTORY STOCK DATA
  ========================================================== */
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

  /* =========================================================
     ISSUED ITEMS DATA
  ========================================================== */
  const [issuedItems, setIssuedItems] = useState([]);

  /* =========================================================
     ADD NEW INVENTORY ITEM
  ========================================================== */
  const addItem = useCallback((newItem) => {
    setTableData((prev) => [
      ...prev,
      {
        no: String(prev.length + 1).padStart(2, "0"),
        itemNumber: newItem.itemCode,
        itemName: newItem.itemName,
        category: newItem.category,
        location: newItem.location,
        quantity: Number(newItem.quantity),
        itemType: newItem.itemType,
        description: newItem.description,
      },
    ]);
  }, []);

  /* =========================================================
     REDUCE STOCK WHEN ITEM IS ISSUED
  ========================================================== */
  const issueItem = useCallback((itemNumber, quantity) => {
    setTableData((prev) =>
      prev.map((item) =>
        item.itemNumber === itemNumber
          ? {
              ...item,
              quantity: item.quantity - quantity,
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
     RETURN ITEM (Optional Future Feature - Production Ready)
  ========================================================== */
  const returnItem = useCallback(
    (id) => {
      setIssuedItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "Returned" } : item,
        ),
      );

      const returnedItem = issuedItems.find((item) => item.id === id);

      if (returnedItem) {
        setTableData((prev) =>
          prev.map((item) =>
            item.itemNumber === returnedItem.itemNo
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
     CONTEXT VALUE (OPTIMIZED)
  ========================================================== */
  const value = useMemo(
    () => ({
      tableData,
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

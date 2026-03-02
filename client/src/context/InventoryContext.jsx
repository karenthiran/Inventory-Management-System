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

  const value = useMemo(
    () => ({
      tableData,
      addItem,
    }),
    [tableData, addItem],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

import React, { createContext, useContext, useState, useMemo } from "react";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([
    {
      id: 1,
      itemNumber: "228-3844-931-7689",
      itemName: "Laptop",
      category: "Computing",
      location: "COL-01",
      quantity: 5,
    },
    {
      id: 2,
      itemNumber: "661-7963-661-7963",
      itemName: "Oscilloscope",
      category: "Electronic",
      location: "COL-02",
      quantity: 7,
    },
    {
      id: 3,
      itemNumber: "958-4030-182-0187",
      itemName: "Printer",
      category: "Computing",
      location: "COL-01",
      quantity: 12,
    },
  ]);

  /* ================= ADD ITEM ================= */
  const addItem = (newItem) => {
    setInventory((prev) => [
      ...prev,
      {
        id: Date.now(),
        ...newItem,
        quantity: Number(newItem.quantity),
      },
    ]);
  };

  /* ================= ISSUE ITEM ================= */
  const issueItem = (itemId, qty) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity - qty,
            }
          : item,
      ),
    );
  };

  /* ================= RETURN ITEM ================= */
  const returnItem = (itemId, qty) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: item.quantity + qty,
            }
          : item,
      ),
    );
  };

  const value = useMemo(
    () => ({
      inventory,
      addItem,
      issueItem,
      returnItem,
    }),
    [inventory],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

/* ================= CUSTOM HOOK ================= */
export const useInventory = () => useContext(InventoryContext);

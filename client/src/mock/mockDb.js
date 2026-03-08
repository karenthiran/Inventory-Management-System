// src/mock/mockDb.js
/* eslint-disable no-unused-vars */

// ---- master data ----
let locations = ["Lab 01", "Lab 02", "Store"];
let categories = ["Laptop", "Projector", "Arduino", "Sensor"];
let itemTypes = ["Reusable", "Consumable"]; // you can rename as you like

// ---- items ----
let items = [
  {
    id: 1,
    no: 1,
    itemCode: "PC-001",
    itemName: "Dell Laptop",
    category: "Laptop",
    location: "Lab 01",
    quantity: 1,
    itemType: "Reusable", // example
    description: "Core i5, 8GB RAM",
    status: "AVAILABLE",
  },
  {
    id: 2,
    no: 2,
    itemCode: "PJ-010",
    itemName: "Epson Projector",
    category: "Projector",
    location: "Lab 02",
    quantity: 1,
    itemType: "Reusable",
    description: "",
    status: "MAINTENANCE",
  },
];

// ---- helpers ----
function renumberItems() {
  items = items.map((it, idx) => ({ ...it, no: idx + 1 }));
}

// ---- API-like functions ----
export async function mockFetchItems() {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 300));
  return [...items];
}

export async function mockAddItem(newItem) {
  await new Promise((r) => setTimeout(r, 300));

  const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  const itemToInsert = {
    id: nextId,
    status: "AVAILABLE",
    quantity: Number(newItem.quantity ?? 0),
    description: newItem.description ?? "",
    ...newItem, // expects itemName, itemCode, category, location, itemType
  };

  items = [itemToInsert, ...items];
  items = items.map((it, idx) => ({ ...it, no: idx + 1 }));
  return itemToInsert;
}

export async function mockFetchLocations() {
  await new Promise((r) => setTimeout(r, 150));
  return [...locations];
}

export async function mockAddLocation(name) {
  await new Promise((r) => setTimeout(r, 150));
  if (!name) throw new Error("Location name required");
  if (!locations.includes(name)) locations = [...locations, name];
  return name;
}

export async function mockFetchCategories() {
  await new Promise((r) => setTimeout(r, 150));
  return [...categories];
}

export async function mockAddCategory(name) {
  await new Promise((r) => setTimeout(r, 150));
  if (!name) throw new Error("Category name required");
  if (!categories.includes(name)) categories = [...categories, name];
  return name;
}

export async function mockFetchItemTypes() {
  await new Promise((r) => setTimeout(r, 150));
  return [...itemTypes];
}
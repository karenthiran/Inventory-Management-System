// src/api/imsApi.js
import { http } from "./http";

// ITEMS
export const fetchItems = async () => {
  const res = await http.get("/api/items");
  return res.data;
};

export const fetchAvailableItems = async () => {
  const res = await http.get("/api/items/available"); // recommended endpoint
  return res.data;
};

// ISSUES
export const fetchIssues = async () => {
  const res = await http.get("/api/issues");
  return res.data;
};

export const fetchActiveIssues = async () => {
  const res = await http.get("/api/issues/active");
  return res.data;
};

// MAINTENANCE
export const fetchMaintenanceActive = async () => {
  const res = await http.get("/api/maintenance/active");
  return res.data;
};
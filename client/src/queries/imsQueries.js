// src/queries/imsQueries.js
import { useQuery } from "@tanstack/react-query";
import {
  fetchItems,
  fetchIssues,
  fetchActiveIssues,
  fetchMaintenanceActive,
  fetchAvailableItems,
} from "../api/imsApi";

export const queryKeys = {
  items: ["items"],
  issues: ["issues"],
  activeIssues: ["activeIssues"],
  maintenanceActive: ["maintenanceActive"],
  availableItems: ["availableItems"],
};

export function useItems() {
  return useQuery({ queryKey: queryKeys.items, queryFn: fetchItems });
}

export function useIssues() {
  return useQuery({ queryKey: queryKeys.issues, queryFn: fetchIssues });
}

export function useActiveIssues() {
  return useQuery({ queryKey: queryKeys.activeIssues, queryFn: fetchActiveIssues });
}

export function useMaintenanceActive() {
  return useQuery({ queryKey: queryKeys.maintenanceActive, queryFn: fetchMaintenanceActive });
}

export function useAvailableItems() {
  return useQuery({ queryKey: queryKeys.availableItems, queryFn: fetchAvailableItems });
}
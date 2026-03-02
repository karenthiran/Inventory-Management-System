// src/mutations/imsMutations.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../api/http";
import { queryKeys } from "../queries/imsQueries";

// POST /api/issues  body: { itemId, userId, dueDate... }
export function useIssueItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await http.post("/api/issues", payload);
      return res.data;
    },
    onSuccess: () => {
      // refresh all connected pages
      qc.invalidateQueries({ queryKey: queryKeys.items });
      qc.invalidateQueries({ queryKey: queryKeys.issues });
      qc.invalidateQueries({ queryKey: queryKeys.activeIssues });
      qc.invalidateQueries({ queryKey: queryKeys.availableItems });
    },
  });
}

export function useAddItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (newItem) => {
      const res = await http.post("/api/items", newItem);
      return res.data;
    },
    onSuccess: () => {
      // refresh inventory list after adding
      qc.invalidateQueries({ queryKey: queryKeys.items });
    },
  });
}

// POST /api/returns body: { issueId }
export function useReturnItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await http.post("/api/returns", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.items });
      qc.invalidateQueries({ queryKey: queryKeys.issues });
      qc.invalidateQueries({ queryKey: queryKeys.activeIssues });
      qc.invalidateQueries({ queryKey: queryKeys.availableItems });
    },
  });
}

// POST /api/maintenance/start body: { itemId, note }
export function useStartMaintenance() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await http.post("/api/maintenance/start", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.items });
      qc.invalidateQueries({ queryKey: queryKeys.maintenanceActive });
      qc.invalidateQueries({ queryKey: queryKeys.availableItems });
    },
  });
}

// POST /api/maintenance/end body: { maintenanceId }
export function useEndMaintenance() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await http.post("/api/maintenance/end", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.items });
      qc.invalidateQueries({ queryKey: queryKeys.maintenanceActive });
      qc.invalidateQueries({ queryKey: queryKeys.availableItems });
    },
  });
}
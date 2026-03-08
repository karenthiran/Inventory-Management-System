import { useQuery } from "@tanstack/react-query";
import {
  mockFetchItems,
  mockFetchLocations,
  mockFetchCategories,
  mockFetchItemTypes,
} from "../mock/mockDb";

export const queryKeys = {
  items: ["items"],
  locations: ["locations"],
  categories: ["categories"],
  itemTypes: ["itemTypes"],
};

export function useItems() {
  return useQuery({ queryKey: queryKeys.items, queryFn: mockFetchItems });
}

export function useLocations() {
  return useQuery({ queryKey: queryKeys.locations, queryFn: mockFetchLocations });
}

export function useCategories() {
  return useQuery({ queryKey: queryKeys.categories, queryFn: mockFetchCategories });
}

export function useItemTypes() {
  return useQuery({ queryKey: queryKeys.itemTypes, queryFn: mockFetchItemTypes });
}
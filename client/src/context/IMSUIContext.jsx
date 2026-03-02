/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer } from "react";


export const IMSUIContext = createContext(null);

const initialState = {
  searchText: "",
  statusFilter: "ALL",
  page: 1,
  pageSize: 10,
  selectedItem: null,
  modals: {
    issueOpen: false,
    returnOpen: false,
    maintenanceOpen: false,
    addItemOpen: false,
  },
};





function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchText: action.payload, page: 1 };
    case "SET_STATUS_FILTER":
      return { ...state, statusFilter: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, page: 1 };
    case "SET_SELECTED_ITEM":
      return { ...state, selectedItem: action.payload };
    case "OPEN_MODAL":
      return { ...state, modals: { ...state.modals, [action.payload]: true } };
    case "CLOSE_MODAL":
      return { ...state, modals: { ...state.modals, [action.payload]: false } };
    default:
      return state;
  }
}

export function IMSUIProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <IMSUIContext.Provider value={{ state, dispatch }}>
      {children}
    </IMSUIContext.Provider>
  );
}
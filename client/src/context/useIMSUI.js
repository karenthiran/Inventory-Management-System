import { useContext } from "react";
import { IMSUIContext } from "./IMSUIContext";

export function useIMSUI() {
  const ctx = useContext(IMSUIContext);
  if (!ctx) throw new Error("useIMSUI must be used inside IMSUIProvider");
  return ctx;
}


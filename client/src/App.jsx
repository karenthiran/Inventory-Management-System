import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { InventoryProvider } from "./context/InventoryContext";

import { IMSUIProvider } from "./context/IMSUIContext";

function App() {
  return (
    <IMSUIProvider>
      {
        <InventoryProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </InventoryProvider>
      }
    </IMSUIProvider>
  );
}

export default App;

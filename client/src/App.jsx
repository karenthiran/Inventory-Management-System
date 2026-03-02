import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { InventoryProvider } from "./context/InventoryContext";

function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </InventoryProvider>
  );
}

export default App;

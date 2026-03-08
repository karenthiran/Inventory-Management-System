import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { InventoryProvider } from "./context/InventoryContext";

<<<<<<< HEAD
<<<<<<< HEAD
const queryClient = new QueryClient();
=======
import { IMSUIProvider } from "./context/IMSUIContext";
>>>>>>> parent of f40c6be (made changes in app,inventory,useIMSUI,imsmutations)

function App() {
  return (
    <IMSUIProvider>
      {
        <InventoryProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </InventoryProvider>
<<<<<<< HEAD
      </IMSUIProvider>
    </QueryClientProvider>
=======
function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </InventoryProvider>
>>>>>>> parent of a09d3a8 (made chnages in app.jsx and created the IMSUIContext,useIMSUI files)
=======
      }
    </IMSUIProvider>
>>>>>>> parent of f40c6be (made changes in app,inventory,useIMSUI,imsmutations)
  );
}

export default App;

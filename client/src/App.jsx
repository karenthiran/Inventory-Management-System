// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./routes/AppRoutes";
// import { InventoryProvider } from "./context/InventoryContext";

// function App() {
//   return (
//     <InventoryProvider>
//       <BrowserRouter>
//         <AppRoutes />
//       </BrowserRouter>
//     </InventoryProvider>
//   );
// }

// export default App;

import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IMSUIProvider } from "./context/IMSUIContext"; // <-- match your file name
import { InventoryProvider } from "./context/InventoryContext";
import AppRoutes from "./routes/AppRoutes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <IMSUIProvider>
        <InventoryProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </InventoryProvider>
      </IMSUIProvider>
    </QueryClientProvider>
  );
}
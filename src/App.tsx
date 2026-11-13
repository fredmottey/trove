import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import Trove from "./trove/Trove";
const client = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <Trove />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

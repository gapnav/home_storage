import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelloMessage } from "./components/HelloMessage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Home Storage
          </h1>
          <HelloMessage />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;

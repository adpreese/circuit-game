
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Puzzle1 from "./pages/Puzzle1";
import Puzzle2 from "./pages/Puzzle2";
import Puzzle3 from "./pages/Puzzle3";
import Puzzle4 from "./pages/Puzzle4";
import { GameStateProvider } from "./context/GameStateContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameStateProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/puzzle1" element={<Puzzle1 />} />
            <Route path="/puzzle2" element={<Puzzle2 />} />
            <Route path="/puzzle3" element={<Puzzle3 />} />
            <Route path="/puzzle4" element={<Puzzle4 />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </GameStateProvider>
  </QueryClientProvider>
);

export default App;

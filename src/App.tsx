import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Recherche from "./pages/Recherche";
import OpportunitesPersonnalisees from "./pages/OpportunitesPersonnalisees";
import Opportunites from "./pages/Opportunites";
import OpportunityDetail from "./pages/OpportunityDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/opportunites-personnalisees" element={<OpportunitesPersonnalisees />} />
          <Route path="/opportunites" element={<Opportunites />} />
          <Route path="/opportunite" element={<OpportunityDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

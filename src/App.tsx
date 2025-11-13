import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "@/components/Header";
import Home from "@/pages/Home";
import Recherche from "@/pages/Recherche";
import OpportunitesPersonnalisees from "@/pages/OpportunitesPersonnalisees";
import Opportunites from "@/pages/Opportunites";
import OpportunityDetail from "@/pages/OpportunityDetail";
import APropos from "@/pages/APropos";
import NotFound from "@/pages/NotFound";
import ToutesLesOpportunites from "@/pages/ToutesLesOpportunites";
import Changelog from "@/pages/Changelog";
import Connexion from "@/pages/Connexion";
import Parametres from "@/pages/Parametres";
import Historique from "@/pages/Historique";
import Conditions from "@/pages/Conditions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Toaster />
        <Sonner />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recherche" element={<Recherche />} />
          <Route path="/opportunites-personnalisees" element={<OpportunitesPersonnalisees />} />
          <Route path="/opportunites" element={<Opportunites />} />
          <Route path="/opportunites/toutes" element={<ToutesLesOpportunites />} />
          <Route path="/opportunite" element={<OpportunityDetail />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/parametres" element={<Parametres />} />
          <Route path="/historique" element={<Historique />} />
          <Route path="/conditions" element={<Conditions />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "@/components/Header";
import TermsGuard from "@/components/TermsGuard";

import ConditionsPage from "@/pages/Conditions";
import Home from "@/pages/Home";
import Recherche from "@/pages/Recherche";
import OpportunitesPersonnalisees from "@/pages/OpportunitesPersonnalisees";
import Opportunites from "@/pages/Opportunites";
import OpportunityDetail from "@/pages/OpportunityDetail";
import APropos from "@/pages/APropos";
import NotFound from "@/pages/NotFound";
import ToutesLesOpportunites from "@/pages/ToutesLesOpportunites";
import Changelog from "@/pages/Changelog";

// Placeholders à livrer en E05: Parametres.tsx et Historique.tsx
import Parametres from "@/pages/Parametres";
import Historique from "@/pages/Historique";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* La garde enveloppe tout le rendu cliquable (anti‑FOUC) */}
        <TermsGuard>
          <Header />
          <Routes>
            {/* Route publique pour lecture des Conditions */}
            <Route path="/conditions" element={<ConditionsPage />} />

            {/* Routes existantes de l’application */}
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<Recherche />} />
            <Route path="/opportunites-personnalisees" element={<OpportunitesPersonnalisees />} />
            <Route path="/opportunites" element={<Opportunites />} />
            <Route path="/opportunites/toutes" element={<ToutesLesOpportunites />} />
            <Route path="/opportunite" element={<OpportunityDetail />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/a-propos" element={<APropos />} />

            {/* Nouvelles routes placeholders */}
            <Route path="/parametres" element={<Parametres />} />
            <Route path="/historique" element={<Historique />} />

            {/* CATCH-ALL */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TermsGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

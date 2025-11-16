import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { isSupabaseConfigured } from "@/lib/supabase";
import { Header } from "@/components/Header";
import { LoadingFallback } from "@/components/LoadingFallback";
import Home from "@/pages/Home";
import Recherche from "@/pages/Recherche";
import OpportunitesPersonnalisees from "@/pages/OpportunitesPersonnalisees";
import Opportunites from "@/pages/Opportunites";
import OpportunityDetail from "@/pages/OpportunityDetail";
import NotFound from "@/pages/NotFound";
import ToutesLesOpportunites from "@/pages/ToutesLesOpportunites";
import Connexion from "@/pages/Connexion";
import Inscription from "@/pages/Inscription";
import MotDePasseOublie from "@/pages/MotDePasseOublie";

const APropos = lazy(() => import("@/pages/APropos"));
const Changelog = lazy(() => import("@/pages/Changelog"));
const Conditions = lazy(() => import("@/pages/Conditions"));
const PolitiqueConfidentialite = lazy(() => import("@/pages/PolitiqueConfidentialite"));
const Parametres = lazy(() => import("@/pages/Parametres"));
const Historique = lazy(() => import("@/pages/Historique"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Header />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/recherche" element={<Recherche />} />
              <Route path="/opportunites-personnalisees" element={<OpportunitesPersonnalisees />} />
              <Route path="/opportunites" element={<Opportunites />} />
              <Route path="/opportunites/toutes" element={<ToutesLesOpportunites />} />
              <Route path="/opportunite" element={<OpportunityDetail />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/a-propos" element={<APropos />} />
              
              {/* Routes d'authentification - Seulement si Supabase est configuré */}
              {isSupabaseConfigured ? (
                <>
                  <Route path="/connexion" element={<Connexion />} />
                  <Route path="/inscription" element={<Inscription />} />
                  <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
                  
                  {/* Routes protégées */}
                  <Route
                    path="/parametres"
                    element={
                      <ProtectedRoute>
                        <Parametres />
                      </ProtectedRoute>
                    }
                  />
                  {/* Historique: pas de redirection automatique, la page gère le message non connecté */}
                  <Route path="/historique" element={<Historique />} />
                </>
              ) : (
                <>
                  {/* Si Supabase n'est pas configuré, pages accessibles sans auth */}
                  <Route path="/connexion" element={<Connexion />} />
                  <Route path="/inscription" element={<Inscription />} />
                  <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
                  <Route path="/parametres" element={<Parametres />} />
                  <Route path="/historique" element={<Historique />} />
                </>
              )}
              
              <Route path="/conditions" element={<Conditions />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

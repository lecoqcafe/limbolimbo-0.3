import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ProfileSection } from '@/components/settings/ProfileSection';
import { PreferencesSection } from '@/components/settings/PreferencesSection';
import { SecuritySection } from '@/components/settings/SecuritySection';
import { DataSection } from '@/components/settings/DataSection';
import { AboutSection } from '@/components/settings/AboutSection';

export default function Parametres() {
  const { user } = useAuth();

  if (!isSupabaseConfigured) {
    return (
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-6">Paramètres</h1>
        
        <div className="grid gap-6 max-w-2xl">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Authentification non configurée</AlertTitle>
            <AlertDescription>
              L'authentification n'est pas encore activée sur ce site. 
              Cette page sera fonctionnelle une fois l'authentification configurée.
            </AlertDescription>
          </Alert>

          <ProfileSection />
          <PreferencesSection />
          <SecuritySection />
          <DataSection />
          <AboutSection />
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Paramètres</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <ProfileSection />
        <PreferencesSection />
        <SecuritySection />
        <DataSection />
        <AboutSection />
      </div>
    </main>
  );
}
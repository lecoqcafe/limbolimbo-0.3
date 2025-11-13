import { SignupForm } from '@/components/auth/SignupForm';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Inscription() {
  if (!isSupabaseConfigured) {
    return (
      <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-96px)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Inscription non disponible</CardTitle>
            <CardDescription className="text-center">
              Cette fonctionnalité sera bientôt disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Configuration requise</AlertTitle>
              <AlertDescription>
                L'authentification n'est pas encore configurée sur ce site. 
                Cette fonctionnalité sera activée prochainement.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12 min-h-[calc(100vh-96px)] flex items-center justify-center">
      <SignupForm />
    </main>
  );
}
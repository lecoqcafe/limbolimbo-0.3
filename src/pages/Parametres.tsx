import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from 'react-router-dom';

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

          <Card>
            <CardHeader>
              <CardTitle>Pages légales</CardTitle>
              <CardDescription>
                Informations importantes sur l'utilisation de l'application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/conditions" className="block text-sm text-primary hover:underline">
                Conditions d'utilisation
              </Link>
              <Link to="/politique-confidentialite" className="block text-sm text-primary hover:underline">
                Politique de confidentialité
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fonctionnalités à venir</CardTitle>
              <CardDescription>
                Cette page sera enrichie prochainement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Les paramètres avancés seront disponibles dans une prochaine version.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Paramètres</h1>
      
      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du compte
            </CardTitle>
            <CardDescription>
              Vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pages légales</CardTitle>
            <CardDescription>
              Informations importantes sur l'utilisation de l'application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/conditions" className="block text-sm text-primary hover:underline">
              Conditions d'utilisation
            </Link>
            <Link to="/politique-confidentialite" className="block text-sm text-primary hover:underline">
              Politique de confidentialité
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités à venir</CardTitle>
            <CardDescription>
              Cette page sera enrichie prochainement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Les paramètres avancés seront disponibles dans une prochaine version.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
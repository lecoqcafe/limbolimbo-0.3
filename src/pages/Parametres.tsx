import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, AlertCircle, Shield, Trash2, Calendar, Clock, Star, Crown, Zap } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Parametres() {
  const { user } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [notifications, setNotifications] = useState({
    newOpportunities: true,
    statusChanges: true,
    newsletter: false
  });
  const [userStatus, setUserStatus] = useState('Actif'); // Sera récupéré depuis la base de données

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
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Gérez la sécurité de votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="w-full justify-start"
              >
                Modifier le mot de passe
              </Button>
              
              {showPasswordForm && (
                <div className="space-y-3 p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="current-password">Mot de passe actuel</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nouveau mot de passe</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setShowPasswordForm(false)} variant="outline">
                      Annuler
                    </Button>
                    <Button onClick={() => {
                      // TODO: Implémenter la logique de changement de mot de passe
                      alert('Fonctionnalité à implémenter');
                      setShowPasswordForm(false);
                    }}>
                      Confirmer
                    </Button>
                  </div>
                </div>
              )}
              
              <Button 
                variant="destructive" 
                className="w-full justify-start"
                onClick={() => {
                  if (window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
                    if (window.confirm('CONFIRMATION FINALE : Toutes vos données seront perdues. Continuer ?')) {
                      // TODO: Implémenter la logique de suppression
                      alert('Fonctionnalité à implémenter');
                    }
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer mon compte
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>
                Gérez vos préférences de notification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Nouvelles opportunités</p>
                  <p className="text-sm text-muted-foreground">Recevoir une alerte pour de nouvelles opportunités</p>
                </div>
                <Switch
                  checked={notifications.newOpportunities}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newOpportunities: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Changements de statut</p>
                  <p className="text-sm text-muted-foreground">Notifications sur les changements de vos opportunités</p>
                </div>
                <Switch
                  checked={notifications.statusChanges}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, statusChanges: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Infolettre mensuelle</p>
                  <p className="text-sm text-muted-foreground">Résumé mensuel des nouvelles opportunités</p>
                </div>
                <Switch
                  checked={notifications.newsletter}
                  onCheckedChange={(checked) => 
                    setNotifications(prev => ({ ...prev, newsletter: checked }))
                  }
                />
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
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Key, Activity } from 'lucide-react';

export function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    // TODO: Implémenter la logique de changement de mot de passe
    setTimeout(() => {
      setIsLoading(false);
      alert('Mot de passe changé avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 1500);
  };

  return (
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
      <CardContent className="space-y-6">
        {/* Connexions actives */}
        <div className="flex items-center gap-3">
          <Activity className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Connexions actives</p>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                <div>
                  <p className="text-sm">Chrome sur Windows</p>
                  <p className="text-xs text-muted-foreground">Il y a 2 heures • Paris, France</p>
                </div>
                <Button variant="outline" size="sm">Déconnecter</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Changement de mot de passe */}
        <div className="flex items-center gap-3">
          <Key className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-3">Changer le mot de passe</p>
            <div className="space-y-3">
              <div>
                <Label htmlFor="current-password" className="text-xs">
                  Mot de passe actuel
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="new-password" className="text-xs">
                  Nouveau mot de passe
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="confirm-password" className="text-xs">
                  Confirmer le nouveau mot de passe
                </Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleChangePassword}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Changement en cours...' : 'Changer le mot de passe'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
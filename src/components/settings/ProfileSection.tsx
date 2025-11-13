import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, CheckCircle } from 'lucide-react';

export function ProfileSection() {
  const { user } = useAuth();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Profil Utilisateur
        </CardTitle>
        <CardDescription>
          Informations de votre compte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Nom</p>
            <p className="text-sm text-muted-foreground">
              {user?.email?.split('@')[0] || 'Utilisateur'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-sm font-medium">Courriel</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <div className="flex-1">
            <p className="text-sm font-medium">Statut du compte</p>
            <p className="text-sm text-green-600">Actif et vérifié</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
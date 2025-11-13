import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe, Palette, Bell, Save } from 'lucide-react';
import { PreferencesManager, UserPreferences } from '@/lib/preferences';
import { useToast } from '@/hooks/use-toast';

export function PreferencesSection() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<UserPreferences>(PreferencesManager.getPreferences());

  useEffect(() => {
    setPreferences(PreferencesManager.getPreferences());
  }, []);

  const handleSavePreferences = () => {
    PreferencesManager.savePreferences(preferences);
    toast({
      title: "Préférences sauvegardées",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
  };

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Préférences
        </CardTitle>
        <CardDescription>
          Personnalisez votre expérience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Langue */}
        <div className="flex items-center gap-3">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <Label htmlFor="language" className="text-sm font-medium">
              Langue
            </Label>
            <Select 
              value={preferences.language} 
              onValueChange={(value: 'fr' | 'en') => updatePreference('language', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Thème */}
        <div className="flex items-center gap-3">
          <Palette className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <Label htmlFor="theme" className="text-sm font-medium">
              Thème
            </Label>
            <Select 
              value={preferences.theme} 
              onValueChange={(value: 'light' | 'dark') => updatePreference('theme', value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Clair</SelectItem>
                <SelectItem value="dark">Sombre</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notifications */}
        <div className="flex items-center gap-3">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Notifications par courriel
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Recevoir des alertes et mises à jour
                </p>
              </div>
              <Switch
                id="notifications"
                checked={preferences.emailNotifications}
                onCheckedChange={(checked) => updatePreference('emailNotifications', checked)}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSavePreferences} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder les préférences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
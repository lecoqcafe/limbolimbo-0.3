import { useAuth } from './useAuth';

export interface UserData {
  profile: {
    email: string | null;
    created_at: string | null;
    last_sign_in_at: string | null;
  };
  preferences: {
    language: string;
    theme: string;
    emailNotifications: boolean;
  };
  exported_at: string;
}

export function useDataExport() {
  const { user } = useAuth();

  const exportUserData = (): UserData => {
    // Récupérer les préférences depuis localStorage
    const preferences = localStorage.getItem('limbolimbo-preferences');
    const parsedPreferences = preferences ? JSON.parse(preferences) : {
      language: 'fr',
      theme: 'light',
      emailNotifications: true,
    };

    const userData: UserData = {
      profile: {
        email: user?.email || null,
        created_at: user?.created_at || null,
        last_sign_in_at: user?.last_sign_in_at || null,
      },
      preferences: parsedPreferences,
      exported_at: new Date().toISOString(),
    };

    return userData;
  };

  const downloadUserData = (format: 'json' | 'csv' = 'json') => {
    const userData = exportUserData();
    
    if (format === 'json') {
      const jsonString = JSON.stringify(userData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `limbolimbo-donnees-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      // Créer un format CSV simple
      const csvContent = [
        'Catégorie,Clé,Valeur',
        `Profile,email,${userData.profile.email || ''}`,
        `Profile,created_at,${userData.profile.created_at || ''}`,
        `Profile,last_sign_in_at,${userData.profile.last_sign_in_at || ''}`,
        `Preferences,language,${userData.preferences.language}`,
        `Preferences,theme,${userData.preferences.theme}`,
        `Preferences,emailNotifications,${userData.preferences.emailNotifications}`,
        `Export,exported_at,${userData.exported_at}`,
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `limbolimbo-donnees-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return {
    exportUserData,
    downloadUserData,
  };
}
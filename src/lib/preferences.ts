export interface UserPreferences {
  language: 'fr' | 'en';
  theme: 'light' | 'dark';
  emailNotifications: boolean;
}

export const defaultPreferences: UserPreferences = {
  language: 'fr',
  theme: 'light',
  emailNotifications: true,
};

export class PreferencesManager {
  private static readonly STORAGE_KEY = 'limbolimbo-preferences';

  static getPreferences(): UserPreferences {
    if (typeof window === 'undefined') return defaultPreferences;
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Erreur lors de la lecture des préférences:', error);
    }
    
    return defaultPreferences;
  }

  static savePreferences(preferences: Partial<UserPreferences>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...preferences };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
      
      // Appliquer le thème immédiatement
      if (updated.theme) {
        document.documentElement.classList.toggle('dark', updated.theme === 'dark');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des préférences:', error);
    }
  }

  static resetPreferences(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      document.documentElement.classList.remove('dark');
    } catch (error) {
      console.error('Erreur lors de la réinitialisation des préférences:', error);
    }
  }
}
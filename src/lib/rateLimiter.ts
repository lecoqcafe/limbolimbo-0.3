/**
 * Configuration du rate limiter
 */
interface RateLimitConfig {
  maxAttempts: number;      // Nombre maximum de tentatives
  windowMs: number;         // Fenêtre de temps en millisecondes
  blockDurationMs: number;  // Durée du blocage en millisecondes
}

/**
 * Classe pour gérer le rate limiting côté client
 */
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly STORAGE_KEY = 'rate_limit_';

  constructor(private config: RateLimitConfig, private key: string) {
    // Charger les tentatives depuis localStorage au démarrage
    this.loadFromStorage();
  }

  /**
   * Charger les tentatives depuis localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY + this.key);
      if (stored) {
        const data = JSON.parse(stored);
        this.attempts = new Map(Object.entries(data));
      }
    } catch (error) {
      // Ignorer les erreurs de parsing
    }
  }

  /**
   * Sauvegarder les tentatives dans localStorage
   */
  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.attempts);
      localStorage.setItem(this.STORAGE_KEY + this.key, JSON.stringify(data));
    } catch (error) {
      // Ignorer les erreurs de stockage
    }
  }

  /**
   * Vérifier si une clé est bloquée
   */
  isBlocked(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];

    // Nettoyer les anciennes tentatives (hors de la fenêtre de temps)
    const recentAttempts = attempts.filter(
      (time) => now - time < this.config.windowMs
    );

    // Mettre à jour les tentatives
    if (recentAttempts.length !== attempts.length) {
      this.attempts.set(key, recentAttempts);
      this.saveToStorage();
    }

    // Vérifier si le nombre de tentatives dépasse la limite
    return recentAttempts.length >= this.config.maxAttempts;
  }

  /**
   * Enregistrer une tentative
   */
  recordAttempt(key: string): void {
    const attempts = this.attempts.get(key) || [];
    attempts.push(Date.now());
    this.attempts.set(key, attempts);
    this.saveToStorage();
  }

  /**
   * Obtenir le nombre de tentatives restantes
   */
  getRemainingAttempts(key: string): number {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    const recentAttempts = attempts.filter(
      (time) => now - time < this.config.windowMs
    );
    return Math.max(0, this.config.maxAttempts - recentAttempts.length);
  }

  /**
   * Obtenir le temps restant avant déblocage (en millisecondes)
   */
  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;

    const now = Date.now();
    const oldestAttempt = Math.min(...attempts);
    const timeElapsed = now - oldestAttempt;
    const remainingTime = this.config.windowMs - timeElapsed;

    return Math.max(0, remainingTime);
  }

  /**
   * Formater le temps restant en format lisible
   */
  formatRemainingTime(key: string): string {
    const ms = this.getRemainingTime(key);
    const minutes = Math.ceil(ms / 60000);
    
    if (minutes < 1) return 'moins d\'une minute';
    if (minutes === 1) return '1 minute';
    return `${minutes} minutes`;
  }

  /**
   * Réinitialiser les tentatives pour une clé
   */
  reset(key: string): void {
    this.attempts.delete(key);
    this.saveToStorage();
  }

  /**
   * Réinitialiser toutes les tentatives
   */
  resetAll(): void {
    this.attempts.clear();
    localStorage.removeItem(this.STORAGE_KEY + this.key);
  }
}

/**
 * Rate limiter pour les tentatives de connexion
 * Limite: 5 tentatives par 15 minutes
 */
export const loginRateLimiter = new RateLimiter(
  {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
  },
  'login'
);

/**
 * Rate limiter pour les inscriptions
 * Limite: 3 tentatives par 30 minutes
 */
export const signupRateLimiter = new RateLimiter(
  {
    maxAttempts: 3,
    windowMs: 30 * 60 * 1000, // 30 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
  },
  'signup'
);

/**
 * Rate limiter pour la réinitialisation de mot de passe
 * Limite: 3 tentatives par 60 minutes
 */
export const resetPasswordRateLimiter = new RateLimiter(
  {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 60 minutes
    blockDurationMs: 60 * 60 * 1000, // 60 minutes
  },
  'reset_password'
);
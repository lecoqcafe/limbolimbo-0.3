/**
 * Niveaux de log disponibles
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Structure d'une entrée de log
 */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userAgent?: string;
  url?: string;
}

/**
 * Classe Logger pour gérer les logs de l'application
 * En développement: affiche dans la console
 * En production: stocke dans localStorage et peut être envoyé à un service externe
 */
class Logger {
  private readonly isDev = import.meta.env.DEV;
  private readonly STORAGE_KEY = 'app_logs';
  private readonly MAX_LOGS = 100;

  /**
   * Créer une entrée de log
   */
  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  /**
   * Enregistrer un log
   */
  private log(level: LogLevel, message: string, data?: any): void {
    const entry = this.createLogEntry(level, message, data);

    if (this.isDev) {
      // En développement, utiliser la console
      const consoleMethod = level === 'debug' ? 'log' : level;
      console[consoleMethod](`[${level.toUpperCase()}]`, message, data || '');
    } else {
      // En production, stocker dans localStorage
      this.storeLog(entry);
      
      // Pour les erreurs critiques, on pourrait envoyer à un service externe
      if (level === 'error') {
        this.sendToExternalService(entry);
      }
    }
  }

  /**
   * Stocker un log dans localStorage
   */
  private storeLog(entry: LogEntry): void {
    try {
      const logs = this.getLogs();
      logs.unshift(entry); // Ajouter au début
      
      // Garder seulement les MAX_LOGS derniers
      if (logs.length > this.MAX_LOGS) {
        logs.splice(this.MAX_LOGS);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      // Ignorer les erreurs de stockage (quota dépassé, etc.)
      console.error('Failed to store log:', error);
    }
  }

  /**
   * Envoyer un log à un service externe (Sentry, LogRocket, etc.)
   * Pour l'instant, c'est un placeholder
   */
  private sendToExternalService(entry: LogEntry): void {
    // TODO: Implémenter l'envoi à un service de monitoring
    // Exemple avec Sentry:
    // Sentry.captureException(new Error(entry.message), {
    //   extra: entry.data,
    //   level: entry.level,
    // });
  }

  /**
   * Récupérer tous les logs stockés
   */
  getLogs(): LogEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }

  /**
   * Effacer tous les logs
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  /**
   * Exporter les logs en JSON
   */
  exportLogs(): string {
    const logs = this.getLogs();
    return JSON.stringify(logs, null, 2);
  }

  /**
   * Télécharger les logs en fichier
   */
  downloadLogs(): void {
    const data = this.exportLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Log de niveau INFO
   */
  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  /**
   * Log de niveau WARN
   */
  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  /**
   * Log de niveau ERROR
   */
  error(message: string, data?: any): void {
    this.log('error', message, data);
  }

  /**
   * Log de niveau DEBUG (seulement en développement)
   */
  debug(message: string, data?: any): void {
    if (this.isDev) {
      this.log('debug', message, data);
    }
  }

  /**
   * Logger une erreur avec contexte
   */
  logError(error: Error | unknown, context?: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    this.error(
      context ? `${context}: ${errorMessage}` : errorMessage,
      {
        stack: errorStack,
        error: error,
      }
    );
  }
}

/**
 * Instance singleton du logger
 */
export const logger = new Logger();

/**
 * Helper pour logger les erreurs de manière cohérente
 */
export function logError(error: Error | unknown, context?: string): void {
  logger.logError(error, context);
}
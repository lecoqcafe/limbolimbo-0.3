// Module d'enregistrement du Service Worker pour LIMBOLIMBO
// Enregistre le Service Worker uniquement en production

export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker enregistré avec succès:', registration.scope);
        })
        .catch((error) => {
          console.error('Échec de l\'enregistrement du Service Worker:', error);
        });
    });
  } else {
    console.warn('Service Worker non supporté par ce navigateur');
  }
}

export function unregisterServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error('Échec de la désinscription du Service Worker:', error);
      });
  }
}

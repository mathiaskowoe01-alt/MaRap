// Service Worker for MaRap PWA
// Handles background push notifications and notification click interactions

self.addEventListener('install', (event) => {
  // Force active immediately on install
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for Web Push events from Google (FCM) or Apple (APNs) servers
self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const payload = event.data.json();
      
      const title = payload.title || 'Rappel MaRap';
      const options = {
        body: payload.body || 'Il est l\'heure de s\'occuper de votre tâche !',
        icon: '/favicon.svg',
        badge: '/favicon.svg', // Small silhouette icon for android status bar
        vibrate: [100, 50, 100],
        data: {
          url: payload.url || '/'
        },
        actions: [
          { action: 'open', title: 'Ouvrir l\'application' }
        ]
      };

      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    } catch (e) {
      // Fallback if payload is plain text instead of JSON
      const text = event.data.text();
      event.waitUntil(
        self.registration.showNotification('Rappel MaRap', {
          body: text,
          icon: '/favicon.svg',
          data: { url: '/' }
        })
      );
    }
  }
});

// Handle notification click (redirects to the task or dashboard)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  let targetUrl = '/';
  if (event.notification.data && event.notification.data.url) {
    targetUrl = event.notification.data.url;
  }

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, navigate to target and focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(self.location.host) && 'focus' in client) {
          return client.navigate(targetUrl).then(c => c.focus());
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

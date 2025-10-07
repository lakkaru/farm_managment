// Additional service worker functionality
console.log('PWA Service Worker loaded');

// Handle background sync
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle any queued requests when back online
  }
});

// Handle push notifications
self.addEventListener('push', function(event) {
  console.log('Push notification received');
  const options = {
    body: 'You have new updates in your farm management system',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
  };
  
  event.waitUntil(
    self.registration.showNotification('Farm Management', options)
  );
});
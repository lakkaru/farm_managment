// PWA utility functions
export const isPWAInstallable = () => {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'getRegistration' in navigator.serviceWorker &&
    window.location.protocol === 'https:' // PWA requires HTTPS
  );
};

export const registerServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
          
          // Update available
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available, show update notification
                if (window.confirm('New version available! Click OK to refresh.')) {
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });

    // Listen for online/offline events
    window.addEventListener('online', () => {
      console.log('Back online');
      // Optionally show a toast notification
    });

    window.addEventListener('offline', () => {
      console.log('Gone offline');
      // Optionally show a toast notification
    });
  }
};

export const unregisterServiceWorker = () => {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
};

// Check if app is running in standalone mode (PWA)
export const isPWAMode = () => {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

// Install PWA prompt
let deferredPrompt;

export const initInstallPrompt = () => {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('PWA: beforeinstallprompt event fired');
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Dispatch custom event to notify app
    window.dispatchEvent(new CustomEvent('pwa-installable'));
  });

  // Listen for app installed event
  window.addEventListener('appinstalled', (e) => {
    console.log('PWA: App was installed');
    deferredPrompt = null;
    // Hide install promotion
    window.dispatchEvent(new CustomEvent('pwa-installed'));
  });
};

export const showInstallPrompt = async () => {
  if (!deferredPrompt) {
    throw new Error('Install prompt not available');
  }

  // Show the prompt
  deferredPrompt.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.userChoice;
  
  // Clear the deferredPrompt variable
  deferredPrompt = null;
  
  return outcome === 'accepted';
};

export const canShowInstallPrompt = () => {
  return !!deferredPrompt;
};
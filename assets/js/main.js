// Inline scripts extracted from index.html

// Keep GA and OneSignal external as-is in head via their CDN tags.

// Adsensense is left as external async tag in HTML head or header.

// Application scripts

// 1) Main UI interactions and search, popups, sidebar
(function(){
  const elements = {
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    searchResults: document.getElementById('searchResults'),
    clock: document.getElementById('clock'),
    notificationBtn: document.querySelector('.taskbar-icon[title="Notifications"]'),
    settingsBtn: document.querySelector('.taskbar-icon[title="Settings"]'),
    refreshBtn: document.getElementById('refreshButton'),
    notificationPopup: document.getElementById('notificationPopup'),
    settingsPopup: document.getElementById('settingsPopup'),
    settingsInstallPWA: document.getElementById('settingsInstallPWA'),
    settingsNotificationPermission: document.getElementById('settingsNotificationPermission'),
    settingsClearCache: document.getElementById('settingsClearCache'),
    settingsHardRefresh: document.getElementById('settingsHardRefresh'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebarClose: document.getElementById('sidebarClose')
  };

  const handlers = {
    handleNavClick: (e) => {
      const anchor = e.currentTarget;
      const targetUrl = anchor.getAttribute('href');
      if (targetUrl && targetUrl.startsWith('#')) {
        e.preventDefault();
        const dataLink = anchor.getAttribute('data-link');
        if (dataLink) window.open(dataLink, '_blank');
      }
    },
    performSearch: () => {
      const query = elements.searchInput.value.trim().toLowerCase();
      const apps = document.querySelectorAll('#mainApps .icon');
      if (query.length < 2) {
        elements.searchResults.innerHTML = '<p>Please enter at least 2 characters to search</p>';
        elements.searchResults.classList.add('active');
        apps.forEach(app => app.style.display = '');
        return;
      }
      let matchFound = false;
      apps.forEach(app => {
        const appName = app.querySelector('p').textContent.toLowerCase();
        if (appName.includes(query)) {
          app.style.display = '';
          matchFound = true;
        } else {
          app.style.display = 'none';
        }
      });
      if (!matchFound) {
        elements.searchResults.innerHTML = '<p>No apps found matching your search.</p>';
        elements.searchResults.classList.add('active');
      } else {
        elements.searchResults.classList.remove('active');
      }
    },
    updateClock: () => {
      const now = new Date();
      const time = [now.getHours(), now.getMinutes(), now.getSeconds()]
        .map(n => String(n).padStart(2, '0'))
        .join(':');
      elements.clock.textContent = time;
    },
    openMiniPopup: (popup) => {
      popup.classList.remove('hidden');
      popup.focus();
      document.body.style.overflow = 'hidden';
    },
    closeMiniPopup: (popup) => {
      popup.classList.add('hidden');
      document.body.style.overflow = '';
    },
    openSidebar: () => {
      elements.sidebar.classList.add('active');
      elements.sidebar.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    },
    closeSidebar: () => {
      elements.sidebar.classList.remove('active');
      setTimeout(() => elements.sidebar.classList.add('hidden'), 150);
      document.body.style.overflow = '';
    }
  };

  const initEventListeners = () => {
    document.querySelectorAll('nav a').forEach(el => {
      el.addEventListener('click', handlers.handleNavClick);
    });

    if (elements.searchButton) elements.searchButton.addEventListener('click', handlers.performSearch);
    if (elements.searchInput) {
      elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlers.performSearch();
      });
      // override performSearch with auto-search version (same logic)
      elements.searchInput.addEventListener('input', handlers.performSearch);
    }

    document.addEventListener('click', (e) => {
      if (!elements.searchInput?.contains(e.target) && 
          !elements.searchResults?.contains(e.target) && 
          !elements.searchButton?.contains(e.target)) {
        elements.searchResults?.classList.remove('active');
      }
    });

    handlers.updateClock();
    setInterval(handlers.updateClock, 1000);

    elements.notificationBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.openMiniPopup(elements.notificationPopup);
    });

    elements.settingsBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.openMiniPopup(elements.settingsPopup);
    });

    elements.refreshBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.pwaInstaller) window.pwaInstaller.clearCache();
      window.location.reload(true);
    });

    document.querySelectorAll('.mini-popup-close').forEach(btn => {
      btn.addEventListener('click', () => handlers.closeMiniPopup(btn.closest('.mini-popup')));
    });

    document.addEventListener('mousedown', (e) => {
      [elements.notificationPopup, elements.settingsPopup].forEach(popup => {
        if (popup && !popup.classList.contains('hidden') && !popup.querySelector('.mini-popup-content').contains(e.target)) {
          handlers.closeMiniPopup(popup);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [elements.notificationPopup, elements.settingsPopup].forEach(popup => {
          if (popup && !popup.classList.contains('hidden')) handlers.closeMiniPopup(popup);
        });
      }
    });

    elements.sidebarToggle?.addEventListener('click', handlers.openSidebar);
    elements.sidebarClose?.addEventListener('click', handlers.closeSidebar);

    document.addEventListener('mousedown', (e) => {
      if (elements.sidebar?.classList.contains('active') && 
          !elements.sidebar.contains(e.target) && 
          !elements.sidebarToggle?.contains(e.target)) {
        handlers.closeSidebar();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && elements.sidebar?.classList.contains('active')) {
        handlers.closeSidebar();
      }
    });

    elements.settingsInstallPWA?.addEventListener('click', () => {
      if (window.pwaInstaller?.deferredPrompt) {
        window.pwaInstaller.installPWA();
      } else {
        const btn = elements.settingsInstallPWA;
        btn.textContent = 'Installation not available';
        btn.style.background = '#666';
        btn.disabled = true;
        setTimeout(() => {
          btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Install App
          `;
          btn.style.background = 'linear-gradient(145deg, #4fc3f7, #29b6f6)';
          btn.disabled = false;
        }, 2000);
      }
    });

    elements.settingsNotificationPermission?.addEventListener('click', async () => {
      try {
        const permission = await requestNotificationPermission();
        if (permission) {
          elements.settingsNotificationPermission.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            Notifications Enabled
          `;
          elements.settingsNotificationPermission.style.background = '#4caf50';
          setTimeout(sendTestNotification, 1000);
        } else {
          elements.settingsNotificationPermission.textContent = 'Permission Denied';
          elements.settingsNotificationPermission.style.background = '#f44336';
          setTimeout(() => {
            elements.settingsNotificationPermission.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
              </svg>
              Enable Notifications
            `;
            elements.settingsNotificationPermission.style.background = '#666';
          }, 2000);
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        elements.settingsNotificationPermission.textContent = 'Error';
        elements.settingsNotificationPermission.style.background = '#f44336';
      }
    });

    elements.settingsClearCache?.addEventListener('click', () => {
      if (window.pwaInstaller) {
        window.pwaInstaller.clearCache();
        elements.settingsClearCache.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
          Cache Cleared!
        `;
        elements.settingsClearCache.style.background = '#4caf50';
        setTimeout(() => {
          elements.settingsClearCache.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Clear Cache
          `;
          elements.settingsClearCache.style.background = '#ff9800';
        }, 2000);
      }
    });

    elements.settingsHardRefresh?.addEventListener('click', async () => {
      const btn = elements.settingsHardRefresh;
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.style.background = '#b71c1c';
      btn.innerHTML = 'Đang xóa cache...';
      try {
        if ('serviceWorker' in navigator) {
          const regs = await navigator.serviceWorker.getRegistrations();
          for (const reg of regs) {
            try { await reg.unregister(); } catch (_) {}
          }
        }
        if (window.caches && caches.keys) {
          const keys = await caches.keys();
          await Promise.all(keys.map(k => caches.delete(k)));
        }
        try {
          if (indexedDB && typeof indexedDB.databases === 'function') {
            const dbs = await indexedDB.databases();
            await Promise.all((dbs || []).map(db => db && db.name ? new Promise((resolve) => {
              const req = indexedDB.deleteDatabase(db.name);
              req.onsuccess = req.onerror = req.onblocked = () => resolve();
            }) : Promise.resolve()));
          }
        } catch (_) {}
        try { localStorage.clear(); } catch (_) {}
        try { sessionStorage.clear(); } catch (_) {}
      } catch (e) {
        console.error('Hard refresh error:', e);
      } finally {
        btn.innerHTML = 'Đang tải lại...';
        setTimeout(() => {
          const bust = Date.now();
          const path = window.location.pathname || '/';
          window.location.replace(`${path}?refresh=${bust}`);
        }, 300);
      }
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
  } else {
    initEventListeners();
  }
})();

// 2) App visibility controls
(function(){
  const initAppVisibility = () => {
    const apps = Array.from(document.querySelectorAll('#mainApps .main-app'));
    const showMoreBtn = document.getElementById('showMoreMainApps');
    const initialCount = 14;
    apps.forEach((el, idx) => {
      el.style.display = idx < initialCount ? '' : 'none';
    });
    if (apps.length > initialCount && showMoreBtn) {
      showMoreBtn.style.display = 'inline-flex';
      showMoreBtn.addEventListener('click', () => {
        apps.forEach(el => { el.style.display = ''; });
        showMoreBtn.style.display = 'none';
      }, { once: true });
    } else if (showMoreBtn) {
      showMoreBtn.style.display = 'none';
    }
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppVisibility);
  } else {
    initAppVisibility();
  }
})();

// 3) PWA installer and notification helpers
(function(){
  class PWAInstaller {
    constructor() {
      this.deferredPrompt = null;
      this.installButton = null;
      this.isInstalled = false;
      this.updateCheckInterval = null;
      this.init();
    }
    init() {
      this.checkInstallation();
      this.setupEventListeners();
      this.registerServiceWorker();
      this.setupAutoUpdate();
    }
    checkInstallation() {
      if (window.matchMedia('(display-mode: standalone)').matches || 
          window.navigator.standalone === true) {
        this.isInstalled = true;
        console.log('PWA is already installed');
      }
    }
    setupEventListeners() {
      window.addEventListener('beforeinstallprompt', (e) => {
        console.log('beforeinstallprompt event fired');
        e.preventDefault();
        this.deferredPrompt = e;
        this.showInstallButton();
      });
      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed');
        this.isInstalled = true;
        this.hideInstallButton();
        this.deferredPrompt = null;
        if (typeof gtag !== 'undefined') {
          gtag('event', 'pwa_installed', {
            'event_category': 'engagement',
            'event_label': 'PWA Installation'
          });
        }
      });
      window.addEventListener('online', () => {
        this.updateOnlineStatus(true);
        this.syncData();
      });
      window.addEventListener('offline', () => {
        this.updateOnlineStatus(false);
      });
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkForUpdates();
        }
      });
    }
    showInstallButton() {
      if (this.isInstalled) return;
      this.installButton = document.getElementById('installPWA');
      if (this.installButton) {
        this.installButton.style.display = 'flex';
        this.installButton.addEventListener('click', () => this.installPWA());
      }
    }
    hideInstallButton() {
      if (this.installButton) {
        this.installButton.style.display = 'none';
        this.installButton.removeEventListener('click', this.installPWA);
      }
    }
    async installPWA() {
      if (!this.deferredPrompt) {
        console.log('No install prompt available');
        return;
      }
      try {
        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        console.log('User', outcome === 'accepted' ? 'accepted' : 'dismissed', 'the install prompt');
        this.deferredPrompt = null;
        this.hideInstallButton();
      } catch (error) {
        console.error('Error during PWA installation:', error);
      }
    }
    async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('ServiceWorker registration successful with scope:', registration.scope);
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                this.showUpdateNotification();
              }
            });
          });
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data?.type === 'background-sync-complete') {
              console.log('Background sync completed');
            }
          });
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
        }
      }
    }
    showUpdateNotification() { return; }
    updateOnlineStatus(isOnline) {
      console.log(`Connection status: ${isOnline ? 'online' : 'offline'}`);
      const statusIndicator = document.querySelector('.connection-status') || this.createStatusIndicator();
      statusIndicator.textContent = isOnline ? '🟢 Online' : '🔴 Offline';
      statusIndicator.style.color = isOnline ? '#4fc3f7' : '#f44336';
    }
    createStatusIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'connection-status';
      indicator.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: #4fc3f7;
        padding: 5px 10px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: 600;
        z-index: 10002;
      `;
      document.body.appendChild(indicator);
      return indicator;
    }
    async syncData() {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        try {
          await navigator.serviceWorker.ready;
          const registration = await navigator.serviceWorker.getRegistration();
          if ('sync' in registration) {
            await registration.sync.register('background-sync');
            console.log('Background sync registered');
          }
        } catch (error) {
          console.error('Background sync registration failed:', error);
        }
      }
    }
    checkForUpdates() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) registration.update();
        });
      }
    }
    setupAutoUpdate() {
      this.updateCheckInterval = setInterval(() => { this.checkForUpdates(); }, 5 * 60 * 1000);
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event) => {
          this.handleServiceWorkerMessage(event.data);
        });
      }
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') this.checkForUpdates();
      });
    }
    handleServiceWorkerMessage(data) {
      switch (data.type) {
        case 'FORCE_RELOAD':
          console.log('Force reload requested by service worker');
          this.showUpdateNotification('New version detected! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
          break;
        case 'CONTENT_UPDATED':
          console.log('Content updated:', data.url);
          this.showUpdateNotification('Content updated! Click to refresh.');
          break;
        case 'UPDATE_AVAILABLE':
          console.log('Update available');
          this.showUpdateNotification('New version available! Click to update.');
          break;
        case 'background-sync-complete':
          console.log('Background sync completed');
          break;
      }
    }
    clearCache() {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration?.active) {
            registration.active.postMessage({ type: 'CLEAR_CACHE' });
          }
        });
      }
    }
  }

  window.PWAInstaller = PWAInstaller;

  const initPWA = () => {
    const pwaInstaller = new PWAInstaller();
    window.pwaInstaller = pwaInstaller;
  };

  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        return true;
      }
    }
    return false;
  }

  function sendTestNotification() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification('Text2', {
          body: 'Welcome to Text2! Your AI assistant is ready.',
          icon: '/logoc.jpg',
          badge: '/logoc.jpg',
          vibrate: [100, 50, 100],
          data: { url: '/' }
        });
      });
    }
  }

  window.requestNotificationPermission = requestNotificationPermission;
  window.sendTestNotification = sendTestNotification;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }
})();

// 4) Social dropdowns and mobile interactions
(function(){
  function closeDropdownOnOutsideClick(event) {
    const dropdowns = document.querySelectorAll('.social-dropdown');
    let clickedInside = false;
    dropdowns.forEach(dropdown => {
      if (dropdown.contains(event.target)) {
        clickedInside = true;
      }
    });
    if (!clickedInside) {
      const allOptions = document.querySelectorAll('.social-options');
      const allHeaders = document.querySelectorAll('.social-header');
      allOptions.forEach((opt, index) => {
        opt.classList.remove('show');
        allHeaders[index].classList.remove('active');
      });
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
  }

  function toggleSocialDropdown(platform) {
    const options = document.getElementById(`${platform}-options`);
    const header = options.previousElementSibling;
    const allOptions = document.querySelectorAll('.social-options');
    const allHeaders = document.querySelectorAll('.social-header');
    allOptions.forEach((opt, index) => {
      if (opt !== options) {
        opt.classList.remove('show');
        allHeaders[index].classList.remove('active');
      }
    });
    options.classList.toggle('show');
    header.classList.toggle('active');
    if (options.classList.contains('show')) {
      setTimeout(() => { document.addEventListener('click', closeDropdownOnOutsideClick); }, 100);
    } else {
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
  }

  window.toggleSocialDropdown = toggleSocialDropdown;

  document.addEventListener('DOMContentLoaded', function() {
    const socialMediaGroups = document.querySelectorAll('.social-media-group');
    socialMediaGroups.forEach(group => {
      const header = group.querySelector('.social-media-header');
      header.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          socialMediaGroups.forEach(otherGroup => {
            if (otherGroup !== group) {
              otherGroup.classList.remove('expanded');
            }
          });
          group.classList.toggle('expanded');
        }
      });
    });
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        socialMediaGroups.forEach(group => {
          group.classList.remove('expanded');
        });
      }
    });
  });
})();



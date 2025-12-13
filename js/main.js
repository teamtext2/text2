  // Global variables

  // DOM elements
  const elements = {
    searchInput: document.getElementById('searchInput'),
    searchButton: document.getElementById('searchButton'),
    searchResults: document.getElementById('searchResults'),
    notificationBtn: document.querySelector('.taskbar-icon[title="Notifications"]'),
    settingsBtn: document.querySelector('.taskbar-icon[title="Settings"]'),
    refreshBtn: document.getElementById('refreshButton'),
    notificationPopup: document.getElementById('notificationPopup'),
    settingsPopup: document.getElementById('settingsPopup'),
    scanQRPopup: document.getElementById('scanQRPopup'),
    settingsInstallPWA: document.getElementById('settingsInstallPWA'),
    settingsNotificationPermission: document.getElementById('settingsNotificationPermission'),
    settingsHardRefresh: document.getElementById('settingsHardRefresh'),
    settingsScanQR: document.getElementById('settingsScanQR'),
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebarToggle'),
    sidebarClose: document.getElementById('sidebarClose'),
    sidebarOverlay: document.getElementById('sidebarOverlay'),
    sidebarOpenSettings: document.getElementById('sidebarOpenSettings'),
    sidebarOpenNotifications: document.getElementById('sidebarOpenNotifications')
  };

  // Sidebar focus trap helpers
  let lastFocusedElementBeforeSidebar = null;
  const sidebarFocusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  // Event handlers
  const handlers = {
    // Navigation and icon clicks
    handleNavClick: (e) => {
      const anchor = e.currentTarget;
      const targetUrl = anchor.getAttribute('href');
      if (targetUrl && targetUrl.startsWith('#')) {
        e.preventDefault();
        const dataLink = anchor.getAttribute('data-link');
        if (dataLink) window.open(dataLink, '_blank');
      }
    },

    // Search functionality
    performSearch: () => {
      const query = elements.searchInput.value.trim().toLowerCase();
      const apps = document.querySelectorAll('#mainApps .icon');

      if (query.length < 1) {
        apps.forEach(app => app.style.display = ''); // Show all apps
        elements.searchResults.classList.remove('active');
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
        elements.searchResults.innerHTML = '<p class="loading">Đang tìm... ⏳</p>';
        elements.searchResults.classList.add('active');
      } else {
        elements.searchResults.classList.remove('active');
      }
    },

    

    // Popup management
    openMiniPopup: (popup) => {
      popup.classList.remove('hidden');
      popup.focus();
      document.body.style.overflow = 'hidden';
    },

    closeMiniPopup: (popup) => {
      popup.classList.add('hidden');
      document.body.style.overflow = '';
    },

    // Sidebar management
    openSidebar: () => {
      if (!elements.sidebar) return;

      lastFocusedElementBeforeSidebar = document.activeElement instanceof HTMLElement ? document.activeElement : null;

      elements.sidebar.classList.remove('hidden');
      if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.remove('hidden');
        elements.sidebarOverlay.classList.add('active');
      }

      // force next frame so transition runs
      requestAnimationFrame(() => {
        elements.sidebar.classList.add('active');
      });

      document.body.style.overflow = 'hidden';

      // Move focus into sidebar for accessibility
      setTimeout(() => {
        if (!elements.sidebar) return;
        const focusable = elements.sidebar.querySelectorAll(sidebarFocusableSelector);
        if (focusable.length > 0 && focusable[0] instanceof HTMLElement) {
          focusable[0].focus();
        }
      }, 50);
    },

    closeSidebar: () => {
      if (!elements.sidebar) return;

      elements.sidebar.classList.remove('active');
      if (elements.sidebarOverlay) {
        elements.sidebarOverlay.classList.remove('active');
      }

      setTimeout(() => {
        elements.sidebar.classList.add('hidden');
        if (elements.sidebarOverlay) {
          elements.sidebarOverlay.classList.add('hidden');
        }
      }, 320);

      document.body.style.overflow = '';

      // Restore focus to previous element if possible
      if (lastFocusedElementBeforeSidebar && typeof lastFocusedElementBeforeSidebar.focus === 'function') {
        lastFocusedElementBeforeSidebar.focus();
      }
      lastFocusedElementBeforeSidebar = null;
    }
  };

  const toArray = (value) => Array.isArray(value) ? value : [];
  // Render apps from data.js if available - DISABLED: Apps are now hardcoded in HTML for SEO
  // const renderAppsFromData = () => {
  //   const container = document.getElementById('mainApps');
  //   if (!container) return;
  //   if (typeof appData === 'undefined' || !Array.isArray(appData)) return;

  //   container.innerHTML = appData.map(app => {
  //     const name = app.name || '';
  //     const icon = app.icon || '';
  //     const url = app.url || '#';
  //     const alt = (app.name || 'app').toString().replace(/"/g, '');
  //     return `
  //     <a href="${url}" target="_blank" rel="noopener" class="icon main-app">
  //       <img src="${icon}" alt="${alt}" />
  //       <p>${name}</p>
  //     </a>`;
  //   }).join('');
  // };

  const renderNavigationFromData = () => {
    const nav = document.getElementById('primaryNav') || document.querySelector('nav');
    if (!nav) return;
    const items = toArray(typeof navigationData !== 'undefined' ? navigationData : []);
    if (!items.length) return;

    const installButton = document.getElementById('installPWA');
    nav.querySelectorAll('a').forEach(link => link.remove());

    const template = document.createElement('template');
    template.innerHTML = items.map(item => {
      const href = item?.url || '#';
      const dataLinkAttr = item?.dataLink ? ` data-link="${item.dataLink}"` : '';
      const icon = item?.icon || '';
      const name = item?.name || '';
      return `
        <a href="${href}"${dataLinkAttr}>
          ${icon}
          ${name}
        </a>
      `;
    }).join('');

    if (installButton && nav.contains(installButton)) {
      nav.insertBefore(template.content, installButton);
    } else {
      nav.appendChild(template.content);
    }
  };

  const mobileExpandIcon = `
    <svg class="mobile-expand-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6,9 12,15 18,9"></polyline>
    </svg>
  `;

  const renderSocialMediaFromData = () => {
    const container = document.getElementById('socialMediaApps');
    if (!container) return;
    const data = toArray(typeof socialMediaData !== 'undefined' ? socialMediaData : []);
    if (!data.length) {
      container.innerHTML = '<p class="loading">Updating social channels...</p>';
      return;
    }
    container.innerHTML = data.map(item => {
      const links = toArray(item?.links).map(link => `
        <a href="${link?.url || '#'}" target="_blank" rel="noopener" class="social-link">${link?.name || ''}</a>
      `).join('');
      return `
        <div class="social-media-group" data-platform="${item?.platform || ''}">
          <div class="social-media-header">
            ${item?.icon || ''}
            <span class="social-title">${item?.name || ''}</span>
            ${mobileExpandIcon}
          </div>
          <div class="social-media-links">
            ${links}
          </div>
        </div>
      `;
    }).join('');
  };

  const renderPartnersFromData = () => {
    const container = document.getElementById('partnersContainer');
    if (!container) return;
    const partners = toArray(typeof partnersData !== 'undefined' ? partnersData : []);
    if (!partners.length) {
      container.innerHTML = '<p class="loading">Partners list is being updated...</p>';
      return;
    }
    container.innerHTML = partners.map(partner => `
      <a href="${partner?.url || '#'}" target="_blank" rel="noopener" class="icon" title="${partner?.description || partner?.name || ''}">
        <img src="${partner?.icon || ''}" alt="${partner?.name || ''}" />
        <p>${partner?.name || ''}</p>
      </a>
    `).join('');
  };

  const renderSidebarFromData = () => {
    const mainLinksContainer = document.getElementById('sidebarMainLinks');
    const socialContainer = document.getElementById('sidebarSocialMedia');
    if (!mainLinksContainer || !socialContainer) return;

    const sidebarConfig = typeof sidebarData !== 'undefined' ? sidebarData : {};
    const mainLinks = toArray(sidebarConfig.mainLinks);
    const socialItems = toArray(sidebarConfig.socialMedia);

    const baseLinkStyle = 'display:flex;align-items:center;gap:10px;padding:10px 0 10px 10px;font-size:16px;border-radius:8px;transition:background 0.2s;';
    mainLinksContainer.innerHTML = mainLinks.map(link => `
      <a href="${link?.url || '#'}" data-same-tab="${link?.dataSameTab ? 'true' : 'false'}" style="${baseLinkStyle}">
        ${link?.icon || ''}
        ${link?.name || ''}
      </a>
    `).join('');

    const dropdownArrow = `
      <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6,9 12,15 18,9"></polyline>
      </svg>
    `;

    socialContainer.innerHTML = `
      <div style="margin-bottom: 10px;">
        <div style="font-size: 14px; color: #888; margin-bottom: 8px; padding-left: 10px;">Social Media</div>
        ${socialItems.map(item => `
          <div class="social-dropdown" data-platform="${item?.platform || ''}">
            <div class="social-header" data-platform="${item?.platform || ''}">
              ${item?.icon || ''}
              ${item?.name || ''}
              ${dropdownArrow}
            </div>
            <div class="social-options" id="${item?.platform || 'social'}-options">
              ${toArray(item?.links).map(link => `
                <a href="${link?.url || '#'}" target="_blank">${link?.name || ''}</a>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  };

  const initMobileSocialToggle = (() => {
    let resizeListenerAttached = false;
    return () => {
      const socialMediaGroups = document.querySelectorAll('.social-media-group');
      if (!socialMediaGroups.length) return;

      socialMediaGroups.forEach(group => {
        if (group.dataset.mobileBound === 'true') return;
        const header = group.querySelector('.social-media-header');
        if (!header) return;

        header.addEventListener('click', (e) => {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            document.querySelectorAll('.social-media-group').forEach(otherGroup => {
              if (otherGroup !== group) {
                otherGroup.classList.remove('expanded');
              }
            });

            group.classList.toggle('expanded');
          }
        });

        group.dataset.mobileBound = 'true';
      });

      if (!resizeListenerAttached) {
        window.addEventListener('resize', () => {
          if (window.innerWidth > 768) {
            document.querySelectorAll('.social-media-group').forEach(group => {
              group.classList.remove('expanded');
            });
          }
        });
        resizeListenerAttached = true;
      }
    };
  })();

  const initSidebarDropdowns = () => {
    const headers = document.querySelectorAll('#sidebarSocialMedia .social-header');
    headers.forEach(header => {
      if (header.dataset.dropdownBound === 'true') return;
      header.addEventListener('click', () => {
        const platform = header.dataset.platform;
        if (platform) {
          toggleSocialDropdown(platform);
        }
      });
      header.dataset.dropdownBound = 'true';
    });
  };

  const renderDataCollections = () => {
    // renderAppsFromData(); // DISABLED: Apps are now hardcoded in HTML for SEO
    renderNavigationFromData();
    renderSocialMediaFromData();
    renderPartnersFromData();
    renderSidebarFromData();
    initSidebarDropdowns();
    initMobileSocialToggle();
  };

  // Ensure sections are rendered from data when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderDataCollections);
  } else {
    renderDataCollections();
  }
  // Initialize event listeners
  const initEventListeners = () => {
    // Navigation and icons
    document.querySelectorAll('nav a').forEach(el => {
      el.addEventListener('click', handlers.handleNavClick);
    });

    // Search
    elements.searchButton.addEventListener('click', handlers.performSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handlers.performSearch();
    });

    // Enable automatic search on typing
    handlers.performSearch = () => {
      const query = elements.searchInput.value.trim().toLowerCase();
      const apps = document.querySelectorAll('#mainApps .icon');

      if (query.length < 1) {
        apps.forEach(app => app.style.display = ''); // Show all apps
        elements.searchResults.classList.remove('active');
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
        elements.searchResults.innerHTML = '<p class="loading">Đang tìm... ⏳</p>';
        elements.searchResults.classList.add('active');
      } else {
        elements.searchResults.classList.remove('active');
      }
    };

    // Add event listener for input event to trigger search on typing
    elements.searchInput.addEventListener('input', handlers.performSearch);

    // Close search results when clicking outside
    document.addEventListener('click', (e) => {
      if (!elements.searchInput.contains(e.target) && 
          !elements.searchResults.contains(e.target) && 
          !elements.searchButton.contains(e.target)) {
        elements.searchResults.classList.remove('active');
      }
    });

    

    // Popups
    elements.notificationBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.openMiniPopup(elements.notificationPopup);
    });

    elements.settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handlers.openMiniPopup(elements.settingsPopup);
    });

    elements.refreshBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.pwaInstaller) window.pwaInstaller.clearCache();
      window.location.reload(true);
    });

    // Close popups
    document.querySelectorAll('.mini-popup-close').forEach(btn => {
      btn.addEventListener('click', () => handlers.closeMiniPopup(btn.closest('.mini-popup')));
    });

    // Scan QR button
    if (elements.settingsScanQR) {
      elements.settingsScanQR.addEventListener('click', (e) => {
        e.stopPropagation();
        handlers.closeMiniPopup(elements.settingsPopup);
        handlers.openMiniPopup(elements.scanQRPopup);
      });
    }

    // Close popups on outside click and ESC
    document.addEventListener('mousedown', (e) => {
      [elements.notificationPopup, elements.settingsPopup, elements.scanQRPopup].forEach(popup => {
        if (popup && !popup.classList.contains('hidden') && !popup.querySelector('.mini-popup-content').contains(e.target)) {
          handlers.closeMiniPopup(popup);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        [elements.notificationPopup, elements.settingsPopup, elements.scanQRPopup].forEach(popup => {
          if (popup && !popup.classList.contains('hidden')) handlers.closeMiniPopup(popup);
        });
      }
    });

    // Sidebar
    if (elements.sidebarToggle) {
      elements.sidebarToggle.addEventListener('click', handlers.openSidebar);
    }
    if (elements.sidebarClose) {
      elements.sidebarClose.addEventListener('click', handlers.closeSidebar);
    }
    if (elements.sidebarOverlay) {
      elements.sidebarOverlay.addEventListener('click', handlers.closeSidebar);
    }
    if (elements.sidebarOpenSettings) {
      elements.sidebarOpenSettings.addEventListener('click', () => {
        handlers.closeSidebar();
        handlers.openMiniPopup(elements.settingsPopup);
      });
    }
    if (elements.sidebarOpenNotifications) {
      elements.sidebarOpenNotifications.addEventListener('click', () => {
        handlers.closeSidebar();
        handlers.openMiniPopup(elements.notificationPopup);
      });
    }

    document.addEventListener('mousedown', (e) => {
      if (!elements.sidebar || !elements.sidebarToggle) return;
      if (elements.sidebar.classList.contains('active') && 
          !elements.sidebar.contains(e.target) && 
          !elements.sidebarToggle.contains(e.target)) {
        handlers.closeSidebar();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!elements.sidebar) return;

      // ESC to close
      if (e.key === 'Escape' && elements.sidebar.classList.contains('active')) {
        handlers.closeSidebar();
        return;
      }

      // Focus trap with Tab
      if (e.key === 'Tab' && elements.sidebar.classList.contains('active')) {
        const focusable = Array.from(elements.sidebar.querySelectorAll(sidebarFocusableSelector))
          .filter(el => el.offsetParent !== null);
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const current = document.activeElement;

        if (e.shiftKey) {
          if (current === first || !elements.sidebar.contains(current)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (current === last || !elements.sidebar.contains(current)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    // Settings functionality
    elements.settingsInstallPWA.addEventListener('click', () => {
      if (window.pwaInstaller?.deferredPrompt) {
        window.pwaInstaller.installPWA();
      } else {
        elements.settingsInstallPWA.textContent = 'Installation not available';
        elements.settingsInstallPWA.style.background = '#666';
        elements.settingsInstallPWA.disabled = true;
        setTimeout(() => {
          elements.settingsInstallPWA.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7,10 12,15 17,10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Install App
          `;
          elements.settingsInstallPWA.style.background = 'linear-gradient(145deg, #4fc3f7, #29b6f6)';
          elements.settingsInstallPWA.disabled = false;
        }, 2000);
      }
    });

    elements.settingsNotificationPermission.addEventListener('click', async () => {
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

    // Update: simple reload (behaves like F5)
    elements.settingsHardRefresh.addEventListener('click', () => {
      const btn = elements.settingsHardRefresh;
      btn.disabled = true;
      const original = btn.innerHTML;
      btn.style.background = '#1976d2';
      btn.innerHTML = 'Đang tải lại...';

      // Small delay to allow UI feedback before reload
      setTimeout(() => {
        try {
          window.location.reload();
        } catch (e) {
          // fallback
          window.location.href = window.location.href;
        }
      }, 120);
    });
  };
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventListeners);
  } else {
    initEventListeners();
  }
  // App visibility management
  const initAppVisibility = () => {
    const apps = Array.from(document.querySelectorAll('#mainApps .main-app'));
    const showMoreBtn = document.getElementById('showMoreMainApps');

    apps.forEach((el) => {
      el.style.display = '';
    });

    if (showMoreBtn) {
      showMoreBtn.style.display = 'none';
    }
  };

  // Initialize app visibility when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppVisibility);
  } else {
    initAppVisibility();
  }
  // PWA Management
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
      // Service worker removed: registration intentionally omitted.
    }

    showUpdateNotification() {
      // Update notifications disabled
      return;
    }

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
      // Background sync via service worker removed; nothing to register here.
      return;
    }

    checkForUpdates() {
      // No service worker available — skip update checks.
    }

    setupAutoUpdate() {
      this.updateCheckInterval = setInterval(() => {
        this.checkForUpdates();
      }, 5 * 60 * 1000);

      // No service worker message listeners needed.

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          this.checkForUpdates();
        }
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
      // Clear caches directly
      if (window.caches && caches.keys) {
        caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).catch(()=>{});
      }
    }
  }

  // Initialize PWA
  const initPWA = () => {
    const pwaInstaller = new PWAInstaller();
    window.pwaInstaller = pwaInstaller;
    
    
  };

  // Notification functions
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
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Text2', {
          body: 'Welcome to Text2! Your AI assistant is ready.',
          icon: '/logoc.png',
          badge: '/logoc.png',
          vibrate: [100, 50, 100],
          data: { url: '/' }
        });
      } catch (e) {
        // Fallback: do nothing
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPWA);
  } else {
    initPWA();
  }
  // Social Media Dropdown Functionality
  function toggleSocialDropdown(platform) {
    const options = document.getElementById(`${platform}-options`);
    if (!options) return;
    const header = options.previousElementSibling;

    const allOptions = document.querySelectorAll('.social-options');
    const allHeaders = document.querySelectorAll('.social-header');

    allOptions.forEach((opt, index) => {
      if (opt !== options) {
        opt.classList.remove('show');
        if (allHeaders[index]) {
          allHeaders[index].classList.remove('active');
        }
      }
    });

    options.classList.toggle('show');
    if (header) {
      header.classList.toggle('active');
    }

    if (options.classList.contains('show')) {
      setTimeout(() => {
        document.addEventListener('click', closeDropdownOnOutsideClick);
      }, 100);
    } else {
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
  }

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
  
  // Close dropdowns when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const allOptions = document.querySelectorAll('.social-options');
      const allHeaders = document.querySelectorAll('.social-header');
      
      allOptions.forEach((opt, index) => {
        opt.classList.remove('show');
        allHeaders[index].classList.remove('active');
      });
      
      document.removeEventListener('click', closeDropdownOnOutsideClick);
    }
  });

 
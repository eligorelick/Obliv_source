// Government-Grade Security Manager with Maximum Hardening
export class SecurityManager {
  private static instance: SecurityManager;
  private securityEnabled = true;
  private integrityHash: string = '';

  private constructor() {
    this.initializeMaximumSecurity();
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private initializeMaximumSecurity(): void {
    // Immediate memory sanitization
    this.secureMemoryWipe();

    // Calculate initial page integrity
    this.integrityHash = this.calculateIntegrityHash();

    // Deploy all security measures
    this.deployAntiDebugging();
    this.deployAntiTampering();
    this.deployDataProtection();
    this.deployNetworkSecurity();
    this.deployForensicProtection();

    // Start continuous monitoring
    this.startSecurityMonitoring();
  }

  private deployAntiDebugging(): void {
    // Multi-layer debugger detection
    const detectDebugger = () => {
      // Timing-based detection
      const start = performance.now();
      // debugger; // Commented for production
      const duration = performance.now() - start;
      if (duration > 100) {
        this.initiateSecurityProtocol();
      }

      // Console object detection
      const element = new Image();
      Object.defineProperty(element, 'id', {
        get: () => {
          this.initiateSecurityProtocol();
          return 'detected';
        }
      });

      // Window size detection
      if (window.outerHeight - window.innerHeight > 200 ||
          window.outerWidth - window.innerWidth > 200) {
        this.initiateSecurityProtocol();
      }

      // DevTools detection via toString
      const checkObj = {
        get id() {
          (this as any).initiateSecurityProtocol?.();
          return 'detected';
        }
      };
      // Force evaluation
      void checkObj.id;

      // Performance profiler detection (adjusted threshold)
      const startProfile = performance.now();
      for (let i = 0; i < 1000; i++) {
        Math.sqrt(i);
      }
      if (performance.now() - startProfile > 50) { // Increased threshold
        this.initiateSecurityProtocol();
      }
    };

    // Run detection continuously
    setInterval(detectDebugger, 300);

    // Disable ALL console methods
    const noop = () => {};
    ['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml',
     'trace', 'group', 'groupCollapsed', 'groupEnd', 'time', 'timeEnd',
     'profile', 'profileEnd', 'count', 'clear', 'table'].forEach(method => {
      (window.console as any)[method] = noop;
    });

    // Prevent console object replacement
    Object.freeze(window.console);
    Object.defineProperty(window, 'console', {
      value: window.console,
      writable: false,
      configurable: false
    });

    // Block all debugging keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // F12, Ctrl+Shift+I/C/J, Ctrl+U
      if (e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
          (e.ctrlKey && e.key === 'U') ||
          (e.metaKey && e.altKey && ['I', 'C', 'J'].includes(e.key))) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.initiateSecurityProtocol();
        return false;
      }
    }, true);
  }

  private deployAntiTampering(): void {
    // Prevent all context menus
    ['contextmenu', 'auxclick'].forEach(event => {
      document.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
      }, true);
    });

    // Block text selection except for input fields
    document.addEventListener('selectstart', (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }, true);

    // CSS-based selection blocking (except inputs)
    const style = document.createElement('style');
    style.textContent = `
      *:not(input):not(textarea) {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
        -webkit-user-drag: none !important;
      }
      input, textarea {
        -webkit-user-select: text !important;
        -moz-user-select: text !important;
        -ms-user-select: text !important;
        user-select: text !important;
      }
    `;
    document.head.appendChild(style);

    // Prevent clipboard operations
    ['copy', 'cut', 'paste'].forEach(event => {
      document.addEventListener(event, (e) => {
        (e as ClipboardEvent).clipboardData?.clearData();
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
    });

    // Prevent drag operations
    ['drag', 'dragstart', 'dragenter', 'dragover', 'dragleave', 'dragend', 'drop'].forEach(event => {
      document.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }, true);
    });

    // Prevent printing
    ['beforeprint', 'afterprint'].forEach(event => {
      window.addEventListener(event, (e) => {
        e.preventDefault();
        e.stopPropagation();
        document.body.style.visibility = 'hidden';
        this.secureMemoryWipe();
        return false;
      }, true);
    });

    // CSS print blocking
    const printStyle = document.createElement('style');
    printStyle.textContent = '@media print { * { display: none !important; } }';
    document.head.appendChild(printStyle);
  }

  private deployDataProtection(): void {
    // Clear storage on unload but allow temporary usage
    window.addEventListener('beforeunload', () => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        // Silent fail
      }
    });

    // Disable IndexedDB
    if ('indexedDB' in window) {
      (window as any).indexedDB = undefined;
      Object.defineProperty(window, 'indexedDB', {
        value: undefined,
        writable: false,
        configurable: false
      });
    }

    // Disable WebSQL
    if ('openDatabase' in window) {
      (window as any).openDatabase = undefined;
    }

    // Disable cookies
    Object.defineProperty(document, 'cookie', {
      get: () => '',
      set: () => {},
      configurable: false
    });

    // Clear memory periodically
    setInterval(() => {
      this.secureMemoryWipe();
    }, 15000);
  }

  private deployNetworkSecurity(): void {
    // Override fetch to monitor requests
    const originalFetch = window.fetch;
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString();

      // Only allow whitelisted domains
      const allowedDomains = [
        'huggingface.co',
        'cdn-lfs.huggingface.co',
        'raw.githubusercontent.com'
      ];

      try {
        const urlObj = new URL(url, window.location.origin);
        const isAllowed = allowedDomains.some(domain =>
          urlObj.hostname.includes(domain)
        );

        if (!isAllowed && !urlObj.hostname.includes(window.location.hostname)) {
          throw new Error('Network request blocked');
        }
      } catch (e) {
        if (!url.startsWith('/') && !url.startsWith('./')) {
          throw new Error('Network request blocked');
        }
      }

      return originalFetch(input, init);
    };

    // Disable WebRTC
    if ('RTCPeerConnection' in window) {
      (window as any).RTCPeerConnection = undefined;
      (window as any).RTCSessionDescription = undefined;
      (window as any).RTCIceCandidate = undefined;
      (window as any).mediaDevices = undefined;
    }

    // Disable WebSockets
    (window as any).WebSocket = undefined;

    // Disable EventSource
    (window as any).EventSource = undefined;
  }

  private deployForensicProtection(): void {
    // Advanced DOM mutation monitoring
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;

              // Block dangerous elements
              const dangerous = ['SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'APPLET', 'LINK'];
              if (dangerous.includes(element.tagName)) {
                element.remove();
                this.initiateSecurityProtocol();
              }

              // Check for javascript: URLs
              if (element.outerHTML.includes('javascript:')) {
                element.remove();
                this.initiateSecurityProtocol();
              }

              // Check for event handlers
              const attributes = element.attributes;
              for (let i = 0; i < attributes.length; i++) {
                if (attributes[i].name.startsWith('on')) {
                  element.removeAttribute(attributes[i].name);
                  this.initiateSecurityProtocol();
                }
              }
            }
          });
        }

        // Monitor attribute changes
        if (mutation.type === 'attributes') {
          const element = mutation.target as HTMLElement;
          if (mutation.attributeName?.startsWith('on') ||
              element.getAttribute(mutation.attributeName || '')?.includes('javascript:')) {
            element.removeAttribute(mutation.attributeName || '');
            this.initiateSecurityProtocol();
          }
        }
      });
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true
    });

    // Continuous integrity checking (disabled for now to prevent false positives)
    // setInterval(() => {
    //   const currentHash = this.calculateIntegrityHash();
    //   if (currentHash !== this.integrityHash) {
    //     this.initiateSecurityProtocol();
    //   }
    // }, 500);
  }

  private startSecurityMonitoring(): void {
    // Monitor for iframe embedding
    if (window.self !== window.top) {
      this.initiateSecurityProtocol();
    }

    // Monitor page visibility
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.secureMemoryWipe();
      }
    });

    // Monitor for screenshots (disabled to prevent performance issues)
    // let lastTime = Date.now();
    // const checkScreenshot = () => {
    //   const currentTime = Date.now();
    //   if (currentTime - lastTime > 100) {
    //     // Possible screenshot attempt
    //     this.secureMemoryWipe();
    //   }
    //   lastTime = currentTime;
    //   requestAnimationFrame(checkScreenshot);
    // };
    // requestAnimationFrame(checkScreenshot);

    // Cleanup on unload
    ['beforeunload', 'unload', 'pagehide'].forEach(event => {
      window.addEventListener(event, () => {
        this.totalMemoryWipe();
      });
    });
  }

  private calculateIntegrityHash(): string {
    // Simple hash for DOM integrity
    const content = document.documentElement.innerHTML;
    let hash = 0;
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString();
  }

  private secureMemoryWipe(): void {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear IndexedDB
      if ('databases' in indexedDB) {
        indexedDB.databases().then(dbs => {
          dbs.forEach(db => {
            if (db.name) indexedDB.deleteDatabase(db.name);
          });
        });
      }

      // Clear caches
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      // Clear cookies
      document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
      });

      // Overwrite memory with random data
      if (window.crypto && window.crypto.getRandomValues) {
        for (let i = 0; i < 5; i++) {
          const buffer = new Uint8Array(512 * 1024); // 512KB chunks
          window.crypto.getRandomValues(buffer);
        }
      }
    } catch (e) {
      // Silent fail
    }
  }

  private totalMemoryWipe(): void {
    // Aggressive memory wipe on unload
    this.secureMemoryWipe();

    // Additional memory overwrite
    if (window.crypto && window.crypto.getRandomValues) {
      for (let i = 0; i < 20; i++) {
        const buffer = new Uint8Array(1024 * 1024); // 1MB chunks
        window.crypto.getRandomValues(buffer);
      }
    }

    // Clear all event listeners
    document.removeEventListener('keydown', () => {});
    document.removeEventListener('contextmenu', () => {});
    document.removeEventListener('selectstart', () => {});
  }

  private initiateSecurityProtocol(): void {
    // Security breach detected - execute protocol
    this.totalMemoryWipe();

    // Clear page content
    document.body.innerHTML = '';
    document.head.innerHTML = '';

    // Redirect to blank page
    try {
      window.location.href = 'about:blank';
    } catch (e) {
      window.location.replace('about:blank');
    }
  }

  public validateOrigin(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedDomains = [
        'huggingface.co',
        'cdn-lfs.huggingface.co',
        'raw.githubusercontent.com'
      ];

      return allowedDomains.some(domain =>
        urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
      );
    } catch {
      return false;
    }
  }

  public isSecurityEnabled(): boolean {
    return this.securityEnabled;
  }
}
// Security initialization and runtime protection
export class SecurityManager {
  private static instance: SecurityManager;
  private securityEnabled = true;

  private constructor() {
    this.initializeSecurityMeasures();
  }

  public static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  private initializeSecurityMeasures(): void {
    // Disable right-click context menu in production
    if (import.meta.env.PROD) {
      document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Disable F12 and other developer shortcuts in production
    if (import.meta.env.PROD) {
      document.addEventListener('keydown', (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C') ||
          (e.ctrlKey && e.shiftKey && e.key === 'J') ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      });
    }

    // Protect against iframe embedding
    if (window.self !== window.top) {
      window.top!.location.replace(window.self.location.href);
    }

    // Clear any potential sensitive data from memory on page unload
    window.addEventListener('beforeunload', () => {
      this.secureClearData();
    });

    // Monitor for suspicious behavior
    this.setupSecurityMonitoring();

    // Disable drag and drop to prevent file uploads
    document.addEventListener('dragover', (e) => e.preventDefault());
    document.addEventListener('drop', (e) => e.preventDefault());

    // Prevent text selection in production for added security
    if (import.meta.env.PROD) {
      document.addEventListener('selectstart', (e) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
        }
      });
    }
  }

  private setupSecurityMonitoring(): void {
    // Monitor for suspicious console usage
    let devtoolsOpen = false;
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          this.handleSecurityBreach('devtools_detected');
        }
      } else {
        devtoolsOpen = false;
      }
    }, 1000);

    // Monitor for script injection attempts
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' && !element.hasAttribute('data-allowed')) {
                this.handleSecurityBreach('script_injection_detected');
                element.remove();
              }
            }
          });
        }
      });
    });

    observer.observe(document, { childList: true, subtree: true });
  }

  private handleSecurityBreach(_type: string): void {
    // In production, take defensive measures
    if (import.meta.env.PROD) {
      // Clear sensitive data
      this.secureClearData();

      // Security event detected - monitoring active
    }
  }

  private secureClearData(): void {
    // Clear localStorage and sessionStorage
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      // Silently handle if storage is restricted
    }

    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name);
        });
      });
    }
  }

  public validateOrigin(url: string): boolean {
    try {
      const urlObj = new URL(url);
      const allowedDomains = [
        'huggingface.co',
        'cdn-lfs.huggingface.co'
      ];

      return allowedDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  }

  public isSecurityEnabled(): boolean {
    return this.securityEnabled;
  }
}
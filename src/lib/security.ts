import DOMPurify from 'dompurify';

// Prevent prompt injection and XSS
export const sanitizeInput = (input: string): string => {
  // Remove any HTML/script tags
  const cleaned = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  });

  // Prevent prompt injection patterns
  const injectionPatterns = [
    /ignore previous instructions/gi,
    /system:/gi,
    /\[INST\]/gi,
    /<\|im_start\|>/gi,
    /\[\/INST\]/gi,
    /<\|im_end\|>/gi,
    /###.*?system/gi,
    /###.*?instruction/gi
  ];

  let sanitized = cleaned;
  injectionPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '[BLOCKED]');
  });

  return sanitized;
};

// Sanitize markdown output from models
export const sanitizeMarkdown = (content: string): string => {
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'blockquote', 'code', 'pre', 'ol', 'ul', 'li', 'a', 'img'
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false
  });
};

// Rate limiting for input
export class RateLimiter {
  private timestamps: number[] = [];
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 10, windowMs = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  canProceed(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < this.windowMs);

    if (this.timestamps.length >= this.maxRequests) {
      return false;
    }

    this.timestamps.push(now);
    return true;
  }

  getRemainingTime(): number {
    if (this.timestamps.length === 0) return 0;
    const oldest = Math.min(...this.timestamps);
    return Math.max(0, this.windowMs - (Date.now() - oldest));
  }
}
// Content Security Policy Configuration for PyXom
// Provides security hardening for the application

export const CSP_CONFIG = {
  // Default directive - fallback for other resource types  
  'default-src': ["'self'"],
  
  // Script sources - allow Pyodide CDN and specific inline scripts
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Monaco Editor and dynamic script loading
    "'unsafe-eval'", // Required for Pyodide Python execution
    "https://cdn.jsdelivr.net", // Pyodide CDN
    "https://cdn.pyodide.org", // Backup Pyodide CDN
    "blob:", // For web workers
  ],
  
  // Style sources - allow inline styles for dynamic components
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for Monaco Editor themes
    "https://fonts.googleapis.com",
    "https://cdn.jsdelivr.net"
  ],
  
  // Image sources
  'img-src': [
    "'self'",
    "data:", // For inline images
    "https:", // Allow HTTPS images
    "blob:" // For dynamically generated images
  ],
  
  // Font sources
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com",
    "https://cdn.jsdelivr.net",
    "data:" // For embedded fonts
  ],
  
  // Connection sources for AJAX/fetch requests
  'connect-src': [
    "'self'",
    "https://cdn.jsdelivr.net", // Pyodide resources
    "https://cdn.pyodide.org",
    "https://files.pythonhosted.org", // Python packages
    "wss:", // WebSocket connections if needed
    "ws:" // WebSocket connections (development)
  ],
  
  // Web Worker sources
  'worker-src': [
    "'self'",
    "blob:" // For dynamic workers
  ],
  
  // Child frame sources (for Python Tutor integration)
  'child-src': [
    "'self'",
    "https://pythontutor.com"
  ],
  
  // Frame sources
  'frame-src': [
    "'self'",
    "https://pythontutor.com"
  ],
  
  // Object and embed sources (restricted)
  'object-src': ["'none'"],
  'embed-src': ["'none'"],
  
  // Base URI restriction
  'base-uri': ["'self'"],
  
  // Form action restriction
  'form-action': ["'self'"],
  
  // Frame ancestors (prevent clickjacking)
  'frame-ancestors': ["'none'"],
  
  // Manifest source
  'manifest-src': ["'self'"],
  
  // Media sources
  'media-src': ["'self'", "blob:", "data:"],
  
  // Additional security directives
  'upgrade-insecure-requests': true,
  'block-all-mixed-content': true
};

// Development vs Production CSP differences
export const DEV_CSP_OVERRIDES = {
  'connect-src': [
    "'self'",
    "https://cdn.jsdelivr.net",
    "https://cdn.pyodide.org", 
    "https://files.pythonhosted.org",
    "http://localhost:*", // Development servers
    "ws://localhost:*", // Hot reload
    "wss://localhost:*"
  ]
};

// Generate CSP header string
export function generateCSPHeader(isDevelopment: boolean = false): string {
  const config = isDevelopment 
    ? { ...CSP_CONFIG, ...DEV_CSP_OVERRIDES }
    : CSP_CONFIG;
  
  const directives: string[] = [];
  
  for (const [directive, values] of Object.entries(config)) {
    if (typeof values === 'boolean') {
      if (values) {
        directives.push(directive.replace(/([A-Z])/g, '-$1').toLowerCase());
      }
    } else if (Array.isArray(values)) {
      const valueString = values.join(' ');
      const directiveName = directive.replace(/([A-Z])/g, '-$1').toLowerCase();
      directives.push(`${directiveName} ${valueString}`);
    }
  }
  
  return directives.join('; ');
}

// Security headers configuration
export const SECURITY_HEADERS = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Prevent page embedding (clickjacking protection)
  'X-Frame-Options': 'DENY',
  
  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (feature policy)
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'accelerometer=()',
    'gyroscope=()'
  ].join(', ')
};

// Generate all security headers
export function generateSecurityHeaders(isDevelopment: boolean = false): Record<string, string> {
  return {
    ...SECURITY_HEADERS,
    'Content-Security-Policy': generateCSPHeader(isDevelopment)
  };
}

// Middleware function for Next.js
export function securityMiddleware(isDevelopment: boolean = false) {
  return (req: any, res: any, next: any) => {
    const headers = generateSecurityHeaders(isDevelopment);
    
    for (const [headerName, headerValue] of Object.entries(headers)) {
      res.setHeader(headerName, headerValue);
    }
    
    if (next) next();
  };
}

// Runtime CSP violation reporting
export function setupCSPReporting() {
  if (typeof window !== 'undefined') {
    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('CSP Violation:', {
        blockedURI: event.blockedURI,
        directive: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        disposition: event.disposition
      });
      
      // Report to analytics/monitoring service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to error reporting service
        fetch('/api/csp-violation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            blockedURI: event.blockedURI,
            directive: event.violatedDirective,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          })
        }).catch(err => console.error('Failed to report CSP violation:', err));
      }
    });
  }
}

// Sandbox configuration for iframe content
export const IFRAME_SANDBOX_CONFIG = {
  // Allow scripts but not form submission or top navigation
  basic: 'allow-scripts allow-same-origin',
  
  // For Python Tutor iframe
  pythonTutor: 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox',
  
  // Restricted sandbox for user content
  userContent: 'allow-scripts allow-same-origin',
  
  // Most restrictive - no scripts
  static: 'allow-same-origin'
};

// Feature policy for modern browsers
export const FEATURE_POLICY = {
  // Disable dangerous features
  camera: 'none',
  microphone: 'none',
  geolocation: 'none',
  payment: 'none',
  usb: 'none',
  
  // Allow specific features for educational content
  fullscreen: 'self',
  
  // Control resource-intensive features
  'sync-xhr': 'none',
  'document-domain': 'none'
};

export default {
  CSP_CONFIG,
  DEV_CSP_OVERRIDES,
  SECURITY_HEADERS,
  IFRAME_SANDBOX_CONFIG,
  FEATURE_POLICY,
  generateCSPHeader,
  generateSecurityHeaders,
  securityMiddleware,
  setupCSPReporting
};

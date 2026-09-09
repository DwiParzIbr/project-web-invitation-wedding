/**
 * Centralized utility for dynamic application domain and URL resolution.
 * 
 * Automatically resolves the domain based on:
 * 1. Environment variable `NEXT_PUBLIC_APP_DOMAIN` / `NEXT_PUBLIC_APP_URL` (if configured)
 * 2. Incoming HTTP request Host / x-forwarded-host header (on server side, e.g. 'weddora.web.id')
 * 3. `window.location.host` (in browser client side)
 * 4. Fallback to production default: 'weddora.web.id'
 */

export function getAppDomain(serverHost?: string | null): string {
  // 1. Explicit env var override
  if (process.env.NEXT_PUBLIC_APP_DOMAIN) {
    return process.env.NEXT_PUBLIC_APP_DOMAIN.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    try {
      const parsed = new URL(process.env.NEXT_PUBLIC_APP_URL);
      return parsed.host;
    } catch {
      return process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
  }

  // 2. Server-side host header (from next/headers)
  if (serverHost) {
    const cleanHost = serverHost.split(':')[0];
    if (cleanHost !== 'localhost' && cleanHost !== '127.0.0.1' && !cleanHost.endsWith('.local')) {
      return serverHost;
    }
  }

  // 3. Client-side browser window
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.endsWith('.local')) {
      return window.location.host;
    }
  }

  // 4. Default production domain
  return 'weddora.web.id';
}

export function getAppBaseUrl(serverHost?: string | null): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1' && !hostname.endsWith('.local')) {
      return window.location.origin;
    }
  }

  const domain = getAppDomain(serverHost);
  const protocol = domain.includes('localhost') || domain.includes('127.0.0.1') ? 'http' : 'https';
  return `${protocol}://${domain}`;
}

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self' https://formspree.io",
  "connect-src 'self' https://formspree.io https://fonts.googleapis.com https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "font-src 'self' https://fonts.gstatic.com data:",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "script-src 'self'"
].join('; ');

const securityHeaders = {
  'Content-Security-Policy': contentSecurityPolicy,
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()'
};

function resolveBase() {
  const explicitBase = process.env.VITE_BASE_PATH;
  if (explicitBase) return explicitBase;

  const runningOnGitHubActions = process.env.GITHUB_ACTIONS === 'true';
  if (!runningOnGitHubActions) return '/';

  const repository = process.env.GITHUB_REPOSITORY;
  const repositoryName = repository ? repository.split('/')[1] : '';
  if (!repositoryName || repositoryName.endsWith('.github.io')) return '/';

  return `/${repositoryName}/`;
}

export default defineConfig({
  base: resolveBase(),
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: false
  },
  preview: {
    headers: securityHeaders
  }
});

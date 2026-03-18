/**
 * Frontend environment configuration utility.
 * Safely reads build-time configuration from Vite's import.meta.env.
 */

interface FrontendConfig {
  iiUrl: string;
}

/**
 * Get the Internet Identity provider URL from environment.
 * Falls back to production II URL if not configured.
 */
export function getInternetIdentityUrl(): string {
  // Vite exposes env vars via import.meta.env (not process.env)
  const envUrl = import.meta.env.VITE_II_URL;
  
  if (envUrl && typeof envUrl === 'string') {
    return envUrl;
  }
  
  // Default to production Internet Identity
  return 'https://identity.ic0.app';
}

/**
 * Get all frontend configuration.
 */
export function getFrontendConfig(): FrontendConfig {
  return {
    iiUrl: getInternetIdentityUrl(),
  };
}

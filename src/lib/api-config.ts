// API configuration for web vs mobile
// In mobile (Capacitor), we need to call the deployed Vercel APIs
// In web, we use relative paths

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export const getApiUrl = (path: string) => {
  // Remove leading slash if API_BASE_URL is set to avoid double slashes
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const API_ENDPOINTS = {
  chat: '/api/chat',
  submitIsland: '/api/submit-island',
} as const;

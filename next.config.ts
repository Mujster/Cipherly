import { NextConfig } from 'next';
import withPWA from 'next-pwa';

// Configure Next.js with PWA functionality
const nextConfig: NextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // You can add more Next.js config options here
});

export default nextConfig;

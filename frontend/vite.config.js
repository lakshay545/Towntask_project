import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: process.cwd(),
  base: '/',
  
  // Cache configuration
  cacheDir: 'node_modules/.vite',
  
  server: {
    port: 9999,
    strictPort: false,
    host: 'localhost',
    allowedHosts: true,
    
    // Disable caching
    middlewareMode: false,
    
    // File watching with proper OneDrive handling
    watch: {
      usePolling: true,
      interval: 100,
      ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**']
    },
    
    // HMR configuration
    hmr: {
      host: 'localhost',
      port: 9999,
      protocol: 'ws'
    },
    
    // Force fresh responses
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'esbuild',
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'socket.io-client'],
    exclude: ['node_modules']
  }
});
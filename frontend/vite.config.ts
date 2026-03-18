import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    'global': 'window',
    'process.env': {},
  },
  server: {
    port: 3000,
    strictPort: false,
    host: '127.0.0.1', // Use IP to skip DNS resolution
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/dist/**', '**/.dfx/**'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/openai': {
        target: 'https://api.openai.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/openai/, '')
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'lucide-react',
      '@tanstack/react-query',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore'
    ],
    exclude: ['@capacitor/core', '@capacitor/android']
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
          'vendor-ui': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-select'],
          'vendor-icp': ['@dfinity/agent', '@dfinity/auth-client', '@dfinity/candid'],
        }
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ponytail: optimized vite configuration with vendor chunking for long-term HTTP caching
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  }
});

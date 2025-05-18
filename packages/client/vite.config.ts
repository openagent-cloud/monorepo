import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env files based on mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],

    server: {
      port: parseInt(env.CLIENT_PORT || '5850'),
      host: '0.0.0.0',
      watch: {
        usePolling: true, // Needed for Docker volumes on some systems
      },
      fs: {
        strict: false, // Allow serving files from outside the project root
      },
    },

    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      },
      // Add this to help Vite find node_modules in Docker environment
      preserveSymlinks: true,
      // Fix for Docker environment - look in the root app node_modules too
      modules: [
        path.resolve(__dirname, 'node_modules'),
        '/app/node_modules'
      ]
    },

    // ⚠️ CRITICAL: Must exclude pglite from optimization
    optimizeDeps: {
      exclude: ['@electric-sql/pglite'],
    },

    build: {
      target: 'es2020',
    },

    worker: {
      format: 'es',
    },

    // Configure proper handling of ElectricSQL assets
    assetsInclude: ['**/*.wasm', '**/*.fs']
  };
});

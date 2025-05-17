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
      }
    },

    // Optimize dependencies
    optimizeDeps: {
      include: ['react', 'react-dom'],
      exclude: ['@electric-sql/pglite'] // Exclude PGlite from optimization to prevent FS bundle issues
    },

    // Configure proper handling of ElectricSQL assets
    assetsInclude: ['**/*.wasm', '**/*.fs']
  };
});

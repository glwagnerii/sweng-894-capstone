import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

const host = process.env.TAURI_DEV_HOST

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ['**/src-tauri/**'],
    },
  },
  publicDir: 'static',
  test: {
    globals: true, // Enables global `expect`, `describe`, etc.
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      exclude: ['src-tauri', 'src/plugins', 'dist', '.ignore', '.venv', '**/index.ts', '**/*.config.*', '**/*.d.ts'],
    },
  },
  plugins: [tailwindcss(), svelte(), svelteTesting()],

  resolve: {
    alias: {
      $views: path.resolve(__dirname, 'src/views'),
      $components: path.resolve(__dirname, 'src/components'),
      $lib: path.resolve(__dirname, 'src/lib'),
      $store: path.resolve(__dirname, 'src/store'),
    },
  },

  build: {
    rollupOptions: {
      external: ['@tauri-apps/api'],
    },
  },
})

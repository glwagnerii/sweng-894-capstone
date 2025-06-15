import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { svelteTesting } from '@testing-library/svelte/vite'
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
    coverage: {
      provider: 'v8',
      exclude: [
        'src-tauri', 'src/plugins', 'dist', '.ignore', '.venv', '**/index.ts', '**/*.config.*', '**/*.d.ts',
      ],
    },
    environment: 'jsdom',
  },
  plugins: [tailwindcss(), svelte(), svelteTesting()],
})

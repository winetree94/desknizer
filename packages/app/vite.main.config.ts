import { defineConfig } from 'vite';
import { externalizeDepsPlugin, swcPlugin } from 'electron-vite';

// https://vitejs.dev/config
export default defineConfig(() => {
  return {
    plugins: [swcPlugin(), externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['better-sqlite3', 'typeorm'],
      },
    },
  };
});

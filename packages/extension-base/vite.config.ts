import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export const getConfigs = (name: string) =>
  defineConfig({
    plugins: [react()],
    build: {
      outDir: `../app/public/${name}`,
      rollupOptions: {
        input: {
          index: './index.html',
          widget: './widget.html',
        },
      },
    },
  });

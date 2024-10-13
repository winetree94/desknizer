import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export interface CreateBaseConfigsOptions {
  uuid: string;
}

// https://vitejs.dev/config/
export const createBaseConfigs = (options: CreateBaseConfigsOptions) =>
  defineConfig({
    plugins: [react()],
    build: {
      outDir: `../app/public/${options.uuid}`,
      rollupOptions: {
        input: {
          index: './index.html',
          widget: './widget.html',
        },
      },
    },
  });

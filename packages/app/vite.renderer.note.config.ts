import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
export default defineConfig({
  root: resolve(__dirname, 'windows', 'note'),
  plugins: [react()],
});

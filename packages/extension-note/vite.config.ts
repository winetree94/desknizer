import Meta from './package.json';
import react from '@vitejs/plugin-react';

export default {
  plugins: [react()],
  build: {
    outDir: `../app/public/extensions/${Meta.extensionConfigs.uuid}`,
    rollupOptions: {
      input: {
        index: './index.html',
        widget: './widget.html',
      },
    },
  },
  server: {
    port: Meta.extensionConfigs.devPort,
  },
};

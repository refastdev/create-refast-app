import { refastPlugin } from '@refastdev/refast-dev';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  appType: 'spa',
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    refastPlugin({
      appType: 'react',
    }),
  ],
});

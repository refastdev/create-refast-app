/// <reference types="vite" />
import { refastPlugin } from '@refastdev/refast-dev';
import path from 'path';
import tailwindcss from 'tailwindcss';
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
      appType: 'preact',
    }),
  ],
  css: {
    postcss: {
      // tailwindcss支持
      plugins: [tailwindcss],
    },
  },
});

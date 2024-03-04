import { refastPlugin } from '@refastdev/refast-dev';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'path';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: 'src/main/index.js',
      },
      outDir: 'out/main',
      assetsInlineLimit: 0, // 小于4kb的资源将会被内联为base64
      chunkSizeWarningLimit: 10000, // 触发警告的chunk大小, kb
      minify: false,
      reportCompressedSize: false, // gzip压缩大小报告, 禁用可以提高构建速度
      sourcemap: true, // sourcemap
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      // 路径别名
      alias: {
        '@main': path.resolve('src/main'),
        '@common': path.resolve('src/common'),
      },
    },
  },
  preload: {
    build: {
      outDir: 'out/preload',
      assetsInlineLimit: 0, // 小于4kb的资源将会被内联为base64
      chunkSizeWarningLimit: 10000, // 触发警告的chunk大小, kb
      minify: false,
      reportCompressedSize: false, // gzip压缩大小报告, 禁用可以提高构建速度
      sourcemap: true, // sourcemap
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      // 路径别名
      alias: {
        '@renderer': path.resolve('src/renderer/src'),
        '@main': path.resolve('src/main'),
        '@common': path.resolve('src/common'),
      },
    },
  },
  renderer: {
    build: {
      outDir: 'out/renderer',
      assetsInlineLimit: 0, // 小于4kb的资源将会被内联为base64
      chunkSizeWarningLimit: 10000, // 触发警告的chunk大小, kb
      minify: false,
      reportCompressedSize: false, // gzip压缩大小报告, 禁用可以提高构建速度
      sourcemap: true, // sourcemap
    },
    plugins: [
      refastPlugin({
        appType: 'react',
      }),
    ],
    resolve: {
      alias: {
        '@renderer': path.resolve('src/renderer/src'),
        '@common': path.resolve('src/common'),
      },
    },
  },
});

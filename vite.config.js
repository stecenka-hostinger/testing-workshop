import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig, splitVendorChunkPlugin, loadEnv } from 'vite';
import viteCompression from 'vite-plugin-compression';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd(), '');
  const exposedEnv = loadEnv(mode, process.cwd());
  const port = 3333;

  process.env = {
    ...process.env,
    ...loadedEnv,
  };

  return {
    base: process.env.VITE_PUBLIC_PATH,
    define: {
      'process.env': {
        ...exposedEnv,
        NODE_ENV: process.env.NODE_ENV,
      },
    },
    build: {
      manifest: true,
      cssCodeSplit: true,
      ...(process.env.GENERATE_SOURCEMAP !== 'false' && { sourcemap: true }),
      rollupOptions: {
        input: ['index.html'],
        output: {
          chunkFileNames: path.join('assets', 'chunk/[name].[hash].js'),
          entryFileNames: path.join('assets', 'js/[name].[hash].js'),
          assetFileNames: path.join('assets', '[ext]/[name].[hash].[ext]'),
        },
      },
    },
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: (tag) => tag.startsWith('hp-'),
          },
        },
      }),
      dynamicImport(),
      splitVendorChunkPlugin(),
      viteCompression(),
    ],
    server: {
      port,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'types/components': path.resolve(__dirname, './types/shared.d.ts'),
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
  };
});

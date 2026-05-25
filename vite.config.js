import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './dev', // ⬅️ serve dari folder dev
  server: {
    open: true,
    port: 4000,
  },
  // resolve: {
  //   alias: {
  //     '@/': '/src/',
  //   },
  // },
});

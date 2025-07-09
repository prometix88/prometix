import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './dev', // ⬅️ serve dari folder dev
  // resolve: {
  //   alias: {
  //     '@/': '/src/',
  //   },
  // },
});

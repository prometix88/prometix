import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { DEFAULT_EXTENSIONS } from '@babel/core';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import prefixSelector from 'postcss-prefix-selector';

export default [
  {
    input: ['./src/index.tsx'],
    output: [
      {
        file: 'index.js',
        format: 'cjs',
        exports: 'named',
      },
      {
        file: 'index.esm.js',
        format: 'esm',
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      resolve(),
      commonjs(),
      postcss({
        plugins: [
          tailwind(),
          autoprefixer(),
          prefixSelector({
            prefix: '#nps-widget', // 👈 semua selector akan jadi #nps-widget .bg-blue-500, dll
            transform(_prefix, selector, prefixedSelector) {
              if (selector.startsWith(':root')) return selector; // biar tidak rusak
              return prefixedSelector;
            },
          }),
        ],
        include: '**/*.css', // ⬅️ Wajibkan semua file .css ikut diproses
        extensions: ['.css'],
        inject: true, // ⬅️ Ini Wajib: Inject CSS sebagai <style> ke JS
        extract: false, //'nps-widget.css', // ⬅️ Jangan bikin file CSS terpisah
        minimize: true,
        // sourceMap: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
      }),
      terser(),
    ],
  },
  {
    input: ['./src/index.tsx'],
    output: [
      {
        file: 'nps-widget.min.js',
        format: 'iife', // bundling untuk browser biasa
        // name: 'NPSModule', // akan tersedia di window.NPSModule
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    ],
    plugins: [
      peerDepsExternal(),
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      resolve(),
      commonjs(),
      postcss({
        plugins: [
          tailwind(),
          autoprefixer(),
          prefixSelector({
            prefix: '#nps-widget', // 👈 semua selector akan jadi #nps-widget .bg-blue-500, dll
            transform(_prefix, selector, prefixedSelector) {
              if (selector.startsWith(':root')) return selector; // biar tidak rusak
              return prefixedSelector;
            },
          }),
        ],
        include: '**/*.css', // ⬅️ Wajibkan semua file .css ikut diproses
        extensions: ['.css'],
        inject: true, // ⬅️ Ini Wajib: Inject CSS sebagai <style> ke JS
        extract: false, //'nps-widget.css', // ⬅️ Jangan bikin file CSS terpisah
        minimize: true,
        // sourceMap: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
      }),
      babel({
        exclude: 'node_modules/**',
        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
        babelHelpers: 'bundled',
        extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
      }),
      terser(),
    ],
  },
];

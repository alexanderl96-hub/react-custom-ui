import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
export default defineConfig({ plugins: [react()], build: { outDir: 'dist', lib: { entry: resolve(process.cwd(), 'src/index.js'), name: 'ReactUIKit', formats: ['es', 'umd'], fileName: format => format === 'es' ? 'react-ui-kit.js' : 'react-ui-kit.umd.js' }, rollupOptions: { external: ['react', 'react-dom'], output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } } } } });

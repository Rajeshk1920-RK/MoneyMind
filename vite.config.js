import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function apkDownloadPlugin() {
  return {
    name: 'apk-download-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const cleanUrl = req.url ? req.url.split('?')[0] : '';
        if (
          cleanUrl === '/api/download-apk' ||
          cleanUrl === '/MoneyMind-v1.0.apk' ||
          cleanUrl === '/moneymind-v1.0.apk' ||
          cleanUrl === '/app-debug.apk'
        ) {
          const possiblePaths = [
            path.resolve(__dirname, 'android/app/build/outputs/apk/debug/app-debug.apk'),
            path.resolve(__dirname, 'public/MoneyMind-v1.0.apk'),
            path.resolve(__dirname, 'public/moneymind-v1.0.apk')
          ];

          for (const apkPath of possiblePaths) {
            if (fs.existsSync(apkPath)) {
              const stat = fs.statSync(apkPath);
              res.writeHead(200, {
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Length': stat.size,
                'Content-Disposition': 'attachment; filename="MoneyMind-v1.0.apk"'
              });
              const readStream = fs.createReadStream(apkPath);
              return readStream.pipe(res);
            }
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), apkDownloadPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    host: true,
    port: 5173,
    open: false,
    watch: {
      ignored: ['**/android/**', '**/*.apk', '**/public/*.apk']
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
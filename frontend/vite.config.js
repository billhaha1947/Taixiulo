import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './src',  // 👈 báo cho Vite biết src là thư mục gốc frontend
  plugins: [react()],
  server: {
    port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: '../dist',  // 👈 Vercel cần file build nằm trong /frontend/dist
    emptyOutDir: true
  }
});

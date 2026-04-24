import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    assetsDir: 'static',
    rollupOptions: {
      output: {
        entryFileNames: `static/[name]-[hash].js`,
        chunkFileNames: `static/[name]-[hash].js`,
        assetFileNames: `static/[name]-[hash].[ext]`,
      }
    }
  },
  server: {
    port: 8002,
    host: '0.0.0.0'
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/congestion': {
        target: 'https://api.odcloud.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/congestion/, ''),
      },
      '/api/arrival': {
        target: 'http://swopenapi.seoul.go.kr',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/arrival/, ''),
      },
    },
  },
})

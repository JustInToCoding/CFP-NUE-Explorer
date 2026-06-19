import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.cfp.coolfarm.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/faostat': {
        target: 'https://faostatservices.fao.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/faostat/, '/api/v1'),
      },
    },
  },
})

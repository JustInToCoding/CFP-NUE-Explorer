import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.cfp.coolfarm.org',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (env.CFP_API_TOKEN) {
                proxyReq.setHeader('Authorization', `Bearer ${env.CFP_API_TOKEN}`)
              }
            })
          },
        },
      },
    },
  }
})

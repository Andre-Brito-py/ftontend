import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração Vite do cliente: porta 5175 e proxy para o backend
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,
    proxy: {
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true
      }
    }
  }
})

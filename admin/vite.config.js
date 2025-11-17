import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      // Permite importar SCSS diretamente da pasta referencias
      allow: [
        '..',
        '../..',
        'c:/Users/Usuário/Documents/novo/aqui/versão_003/referencias'
      ]
    },
    proxy: {
      // Proxy para o backend local
      '/api': 'http://localhost:4002'
    }
  },
  define: {
    'process.env': {}
  }
})

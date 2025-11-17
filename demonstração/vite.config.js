import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  server: {
    port: 5174,
    fs: {
      // Permite importar arquivos fora da raiz do projeto (para usar external/tabler)
      allow: [path.resolve(__dirname, '..')]
    }
  },
  resolve: {
    alias: {
      '@external': path.resolve(__dirname, '../external')
    }
  }
})
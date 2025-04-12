import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuração segura para ambientes Lovable
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true
    }
  },
  define: {
    'process.env': process.env,
    'import.meta.env': JSON.stringify(process.env)
  }
})
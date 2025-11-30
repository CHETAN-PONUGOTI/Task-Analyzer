import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy API requests from React (e.g., /api/tasks/analyze/) to Django
    proxy: {
      '/api': {
        target: 'https://task-analyzer-1-r6v2.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
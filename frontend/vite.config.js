import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    // Решаем проблему с хостом
    allowedHosts: true,
    
    // Настраиваем прокси
    proxy: {
      // Все запросы, начинающиеся с /api, будут перенаправлены
      '/api': {
        target: 'http://127.0.0.1:8000', // Адрес вашего бэкенда
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 🌟 استدعينا الإضافة هنا

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🌟 شغلناها هنا
  ],
})
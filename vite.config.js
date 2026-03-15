import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve('src'),
      '@components': path.resolve('src/components'),
      '@pages': path.resolve('src/pages'),
      '@hooks': path.resolve('src/hooks'),
      '@utils': path.resolve('src/utils'),
      '@services': path.resolve('src/services'),
      '@assets': path.resolve('src/assets'),
      '@styles': path.resolve('src/styles'),
      '@store': path.resolve('src/store'),
    }
  }
})

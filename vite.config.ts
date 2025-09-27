import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  server: {
    open: '/home/home.html',
  },
  plugins: [    tailwindcss(),  ],
})
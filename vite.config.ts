import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    // Public site is served from GitHub Pages under https://deticaru.github.io/ECOPuntosVerdes/
    // Build to /docs so Pages can deploy from that folder.
    outDir: '../docs',
    rollupOptions: {
      // Build all app entry points so they are available as standalone pages
      input: {
        index: resolve(__dirname, 'src/index.html'),
        home: resolve(__dirname, 'src/home/home.html'),
        dashboard: resolve(__dirname, 'src/dashboard/dashboard.html'),
        login: resolve(__dirname, 'src/login/login.html'),
        tienda: resolve(__dirname, 'src/tienda/tienda.html'),
        admin: resolve(__dirname, 'src/admin/admin.html'),
        historial: resolve(__dirname, 'src/historial/historial.html'),
        menu: resolve(__dirname, 'src/menu/menu.html'),
        registro: resolve(__dirname, 'src/registro/registro.html'),
        escaneo: resolve(__dirname, 'src/escaneo/escaneo.html'),
      },
    },
  },
  server: {
    open: '/home/home.html',
  },
  // Important for GitHub Pages to resolve assets under /<repo-name>/
  base: '/ECOPuntosVerdes/',
  plugins: [    tailwindcss(),  ],
})
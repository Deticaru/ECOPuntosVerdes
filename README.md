# Gestión de Proyectos

### Pre Requisitos
- **Node.js**
- **Git**

### Pasos de Instalación
1. Clonar Repositorio
2. Correr en terminal:
```
npm install 
```
4. Correr en Terminal:
```
npm run dev
```
5. Abrir en el navegador (url en terminal)

### Uso
- Tras haber hecho la instalación, para abrir el proyecto sólo será necesario correr
```
npm run dev
```

# Indicaciones Trabajo

## IT 2 - Francisca
### Desarrollar Autenticación de Usuario
### Desarrollar Escaneo y Validación de Compras
#### Fecha Límite: Sábado 27/09

## IT 3 - Maher
### Desarrollar Planilla de Presupuesto
### Desarrollar Asignación de Puntos Verdes
#### Fecha Límite: Domingo 28/09

## IT 4 - Sebastián
### Desarrollar Monitoreo de Stock y Logística
### Desarrollar Historial de Consumo y Puntos
#### Fecha Límite Lunes 29/09

## IT 5 - Benjamin
### Desarrollar Reporte de Impacto Ambiental
### Desarrollar Notificaciones y Recomendaciones
#### Fecha Límite Martes 30/09

## Deploy en GitHub Pages

Este proyecto está configurado para publicarse en GitHub Pages usando la carpeta `docs/`.

Pasos:

1) Build del proyecto (genera `docs/`)

```powershell
npm install
npm run build
```

2) Commit y Push de los cambios (incluye la carpeta `docs/`)

```powershell
git add .
git commit -m "build: generar docs para GitHub Pages"
git push origin main
```

3) Configurar GitHub Pages

- Ir a Settings > Pages
- En "Source" seleccionar: Deploy from a branch
- Branch: `main` — Folder: `/docs`
- Guardar. En 1-2 minutos debería estar publicado en:

https://deticaru.github.io/ECOPuntosVerdes/

Notas:

- La página inicial redirige automáticamente a `home/home.html` (archivo `src/index.html`).
- Vite está configurado con `base: '/ECOPuntosVerdes/'` para que los assets carguen correctamente en Pages.
- Si cambias el nombre del repositorio, también actualiza `base` en `vite.config.ts`.

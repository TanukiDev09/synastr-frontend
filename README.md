# Synastr – Frontend

Este directorio contiene el frontend de **Synastr**, construido con
**Vue 3**, **Vite** y **TypeScript**. La interfaz se centra en la experiencia
de onboarding, swipe/match y chat, siguiendo el diseño descrito en la
especificación.

## Estructura del proyecto

```
synastr-frontend/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile
├── .env.example
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── router.ts
│   ├── graphql/
│   │   ├── client.ts
│   │   └── queries.ts
│   ├── components/
│   │   ├── Onboarding.vue
│   │   ├── Feed.vue
│   │   ├── Chat.vue
│   │   ├── Profile.vue
│   │   └── Settings.vue
│   └── styles/
│       └── base.scss
└── .gitignore
```

## Instalación

1. Asegúrate de tener **Node.js** (>=18) y **pnpm** o **npm** instalados.
2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Copia `.env.example` a `.env` y modifica `VITE_GRAPHQL_ENDPOINT` para apuntar a tu servidor GraphQL (por defecto `http://localhost:8000/graphql`).

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

5. Abre `http://localhost:5173` en tu navegador para ver la aplicación.

## Construcción

Para crear una versión de producción optimizada:

```bash
npm run build
```

El resultado se generará en el directorio `dist/`.

## Docker

Se incluye un `Dockerfile` para construir la aplicación y servir los archivos estáticos con un servidor Nginx simple. Ejecuta:

```bash
docker build -t synastr-frontend .
docker run -p 5173:80 synastr-frontend
```

Esto expondrá la aplicación en `http://localhost:5173`.

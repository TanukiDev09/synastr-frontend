# Architecture.md - Arquitectura Técnica de Synastr Frontend

Este documento describe la arquitectura técnica completa del proyecto Synastr Frontend, incluyendo patrones de diseño, flujo de datos, estructura de componentes y decisiones arquitectónicas.

---

## 📐 Vista General de la Arquitectura

### Diagrama de Alto Nivel

```
┌─────────────────────────────────────────────────────────────┐
│                      SYNASTR FRONTEND                       │
│                     (Vue 3 + TypeScript)                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Presentation │  │   Business   │  │     Data     │     │
│  │    Layer     │  │     Logic    │  │   Access     │     │
│  │  (Components)│  │ (Composables)│  │   (GraphQL)  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         │                  │                  │            │
│         └──────────────────┴──────────────────┘            │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │
                    ┌───────▼────────┐
                    │   HTTP/HTTPS   │
                    └───────┬────────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
    ┌───────▼────────┐           ┌─────────▼──────────┐
    │ Backend GraphQL│           │    Cloudinary      │
    │  (Port 8000)   │           │  (Image Storage)   │
    └────────────────┘           └────────────────────┘
            │                            ⚠️ MOCK
    ┌───────▼────────┐
    │   PostgreSQL   │
    │   (Database)   │
    └────────────────┘
```

### Capas de la Aplicación

#### 1. **Capa de Presentación** (UI Components)
- 13 componentes Vue
- Responsable de renderizado y UX
- Maneja interacciones del usuario
- No contiene lógica de negocio compleja

#### 2. **Capa de Lógica de Negocio** (Composables)
- Composables reutilizables
- Estado global compartido
- Lógica de dominio
- Transformación de datos

#### 3. **Capa de Acceso a Datos** (GraphQL Client)
- Comunicación con backend
- Gestión de autenticación
- Caché de queries
- Manejo de errores de red

---

## 🏗️ Patrones Arquitectónicos

### 1. Composition API Pattern

**Decisión**: Usar Composition API en lugar de Options API

**Razones**:
- Mejor reutilización de lógica
- TypeScript más robusto
- Menor boilerplate
- Más fácil de testear

**Implementación**:
```vue
<script setup lang="ts">
// ✅ Composition API con <script setup>
import { ref, computed, onMounted } from 'vue';

// Estado reactivo
const count = ref(0);

// Lógica computada
const doubled = computed(() => count.value * 2);

// Lifecycle
onMounted(() => {
  // Inicialización
});
</script>
```

### 2. Composables Pattern (Shared State)

**Decisión**: Usar composables para compartir estado y lógica

**Ejemplo**: `useAuth()`

```typescript
// src/composables/useAuth.ts
import { ref } from 'vue';

// ✅ Estado compartido fuera de la función
const user = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

export function useAuth() {
  // Funciones que manipulan el estado compartido
  const login = async (email: string, password: string) => {
    // ...
  };

  return {
    user, // Reactivo y compartido entre todos los componentes
    loading,
    error,
    login,
    logout,
    // ...
  };
}
```

**Beneficios**:
- Estado global sin Vuex/Pinia
- Menos complejidad
- TypeScript nativo
- Fácil de testear

### 3. GraphQL Client Pattern

**Decisión**: Usar `graphql-request` en lugar de Apollo Client

**Razones**:
- Más ligero (Apollo es muy pesado)
- Más simple para aplicación pequeña
- TypeScript excelente
- No necesitamos caché complejo de Apollo

**Implementación**:
```typescript
// src/graphql/client.ts
import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
});

export function request<T>(query: string, variables?: Record<string, any>): Promise<T> {
  return graphqlClient.request<T>(query, variables);
}
```

### 4. Repository Pattern (Parcial)

**Ubicación**: `src/graphql/operations.ts`

**Ejemplo**:
```typescript
// operations.ts actúa como repositorio para operaciones complejas
export async function addPhotos(variables: AddPhotosVariables): Promise<AddPhotosResponse> {
  const input = {
    userId: variables.userId,
    photos: variables.photos,
  };

  return request<AddPhotosResponse>(ADD_PHOTOS_MUTATION, { inputData: input });
}
```

**Uso Limitado**: Solo para `addPhotos`. Otras operaciones usan mutations directamente.

---

## 📦 Estructura de Módulos

### Árbol de Dependencias

```
src/
├── main.ts                    # Entry point
│   ├── imports App.vue
│   ├── imports router
│   ├── imports initAuth()
│   └── mounts Vue app
│
├── App.vue                    # Root component
│   └── <router-view />       # Renderiza componentes según ruta
│
├── router.ts                  # Vue Router config
│   ├── imports 13 components
│   └── define routes
│
├── components/               # UI Components
│   ├── Landing.vue          → No dependencies
│   ├── Onboarding.vue       → useAuth()
│   ├── Login.vue            → mutations, auth, client
│   ├── UploadPhotos.vue     → operations (addPhotos)
│   ├── CompleteProfile.vue  → mutations, client
│   ├── Swipe.vue            → queries, mutations, client
│   ├── Feed.vue             → graphqlClient, gql
│   ├── Matches.vue          → graphqlClient, queries
│   ├── Likers.vue           → graphqlClient, queries
│   ├── Chat.vue             → No dependencies (placeholder)
│   ├── Profile.vue          → useAuth()
│   └── Settings.vue         → useAuth(), mutations, client
│
├── composables/
│   ├── useAuth.ts           → queries, mutations, client, auth
│   └── useAstroChart.ts     → @astrodraw/astrochart
│
├── graphql/
│   ├── client.ts            → graphql-request (GraphQLClient)
│   ├── auth.ts              → client.ts (graphqlClient)
│   ├── queries.ts           → graphql-request (gql)
│   ├── mutations.ts         → graphql-request (gql)
│   └── operations.ts        → client.ts (request), mutations
│
└── styles/
    └── base.scss            # Global styles
```

### Dependencias Cíclicas

**Estado**: ✅ No hay dependencias cíclicas

**Verificado**:
- `auth.ts` importa `graphqlClient` de `client.ts`
- `client.ts` NO importa nada de `auth.ts`
- `useAuth()` importa de `graphql/*` pero no al revés

---

## 🔄 Flujo de Datos

### Patrón de Flujo Unidireccional

```
User Action (Component)
        ↓
Event Handler (@click, @submit)
        ↓
Call Composable or Mutation
        ↓
GraphQL Request → Backend
        ↓
Response or Error
        ↓
Update Reactive State
        ↓
Vue Reactivity System
        ↓
Re-render Component (automatic)
```

### Ejemplo Completo: Login Flow

```typescript
// 1. USER ACTION
<button @click="handleSubmit">Login</button>

// 2. EVENT HANDLER
async function handleSubmit() {
  try {
    // 3. CALL MUTATION
    const data = await request<any>(LOGIN_MUTATION, {
      email: form.email,
      password: form.password,
    });

    // 4. RESPONSE
    const loginPayload = data.login;
    const token = loginPayload?.token;

    // 5. UPDATE STATE
    if (token) {
      setAuthToken(token); // Configura header global
    }

    // 6. NAVIGATION (side effect)
    router.push('/swipe');

  } catch (err) {
    // 5. ERROR STATE
    error.value = 'Credenciales inválidas';
  }
}

// 7. RE-RENDER (automatic)
// Vue detecta cambio en error.value y actualiza el DOM
```

---

## 🔐 Gestión de Autenticación

### Arquitectura de Auth

```
┌─────────────────────────────────────────────────────────┐
│                   Authentication Flow                    │
└─────────────────────────────────────────────────────────┘

1. User logs in
        ↓
2. Backend genera JWT token
        ↓
3. Frontend recibe token
        ↓
4. setAuthToken(token)
        ├─→ localStorage.setItem('synastr_token', token)
        └─→ graphqlClient.setHeader('Authorization', `Bearer ${token}`)
        ↓
5. Todas las requests subsecuentes incluyen el token
        ↓
6. Backend valida token en cada request
        ↓
7. Si token válido → procesa request
   Si token inválido → error 401
        ↓
8. Frontend detecta 401 → logout() automático
```

### Persistencia de Sesión

```typescript
// main.ts - Al iniciar la app
import { initAuth } from './graphql/auth';

initAuth(); // Lee token de localStorage y configura header

// auth.ts
export function initAuth(): void {
  const token = localStorage.getItem('synastr_token');
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }
}
```

**Ventajas**:
- Sesión persiste después de reload
- Token se configura automáticamente
- No necesita re-login constante

**Seguridad**:
- ⚠️ localStorage es vulnerable a XSS
- ✅ Backend valida cada request
- ⚠️ TODO: Considerar httpOnly cookies para producción

---

## 📡 Comunicación GraphQL

### Arquitectura de Cliente GraphQL

```typescript
┌──────────────────────────────────────┐
│        GraphQLClient Instance        │
│   (shared singleton en client.ts)   │
├──────────────────────────────────────┤
│ - endpoint: string                   │
│ - headers: { Authorization?: string }│
│ - credentials: 'include'             │
└──────────────────────────────────────┘
           │
           │ shared by
           ├──────────────┬──────────────┐
           │              │              │
    request() helper  graphqlClient  setHeader()
           │              │              │
       (usado por    (usado por    (usado por
        la mayoría)   algunos)      auth.ts)
```

### Dos Formas de Hacer Requests

#### Forma 1: Helper `request()` (Recomendado)

```typescript
import { request } from '../graphql/client';
import { LOGIN_MUTATION } from '../graphql/mutations';

const data = await request<LoginResponse>(LOGIN_MUTATION, { email, password });
```

**Beneficios**:
- Más conciso
- Tipado genérico incorporado
- Usado en la mayoría de componentes

#### Forma 2: Cliente Directo

```typescript
import { graphqlClient } from '../graphql/client';
import { GET_MATCHES_QUERY } from '../graphql/queries';

const { matches } = await graphqlClient.request<{ matches: User[] }>(GET_MATCHES_QUERY);
```

**Cuándo usar**:
- Cuando necesitas acceso directo al cliente
- Para operaciones avanzadas

**Ambos comparten la misma instancia** → headers se aplican a ambos.

### Manejo de Errores GraphQL

```typescript
try {
  const data = await request(MUTATION, variables);
} catch (error: any) {
  // GraphQL errors vienen en error.response.errors
  const errorMessage = error.response?.errors?.[0]?.message || 'Unknown error';

  // Mostrar al usuario
  errorState.value = errorMessage;
}
```

**Estructura de Error**:
```javascript
{
  response: {
    errors: [
      {
        message: "User not found",
        extensions: { code: "NOT_FOUND" }
      }
    ],
    data: null
  }
}
```

---

## 🎨 Arquitectura de Componentes

### Jerarquía de Componentes

```
App.vue (root)
 └── <router-view> (dinámico según ruta)
      ├── Landing.vue                    [NO AUTH]
      ├── Onboarding.vue                 [NO AUTH]
      ├── Login.vue                      [NO AUTH]
      ├── UploadPhotos.vue              [AUTH]
      ├── CompleteProfile.vue           [AUTH]
      ├── Swipe.vue                     [AUTH]
      ├── Feed.vue                      [AUTH]
      ├── Matches.vue                   [AUTH]
      ├── Likers.vue                    [AUTH]
      ├── Chat.vue                      [AUTH]
      ├── Profile.vue                   [AUTH]
      └── Settings.vue                  [AUTH]
```

**Nota**: No hay componentes anidados actualmente. Todos son "page components" de nivel superior.

**Oportunidad de Mejora**: Extraer componentes reutilizables:
- `UserCard.vue` (usado en Matches, Likers, Feed)
- `NatalChartDisplay.vue` (carta natal visual)
- `PhotoGrid.vue` (grid de fotos)
- `FormInput.vue` (inputs reutilizables)

### Patrones de Componentes

#### Pattern 1: Data Fetching Component

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Estado
const data = ref<Type[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Fetch en mount
onMounted(async () => {
  loading.value = true;
  try {
    const result = await request(QUERY);
    data.value = result.data;
  } catch (err) {
    error.value = 'Failed to load';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <div v-for="item in data" :key="item.id">
      {{ item.name }}
    </div>
  </div>
</template>
```

**Usado en**: `Matches.vue`, `Likers.vue`, `Feed.vue`, `Swipe.vue`

#### Pattern 2: Form Submission Component

```vue
<script setup lang="ts">
import { ref } from 'vue';

// Form state
const form = ref({ field1: '', field2: '' });
const loading = ref(false);
const error = ref<string | null>(null);

// Submit handler
const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    await request(MUTATION, form.value);
    // Success: navigate or show message
    router.push('/success');
  } catch (err: any) {
    error.value = err.response?.errors?.[0]?.message || 'Error';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.field1" required />
    <input v-model="form.field2" required />

    <button :disabled="loading">
      {{ loading ? 'Submitting...' : 'Submit' }}
    </button>

    <p v-if="error">{{ error }}</p>
  </form>
</template>
```

**Usado en**: `Onboarding.vue`, `Login.vue`, `CompleteProfile.vue`, `Settings.vue`

#### Pattern 3: Stateless/Static Component

```vue
<script setup lang="ts">
// Sin estado, solo presentación
</script>

<template>
  <div class="landing">
    <h1>Welcome to Synastr</h1>
    <button @click="$router.push('/onboarding')">Sign Up</button>
    <button @click="$router.push('/login')">Login</button>
  </div>
</template>
```

**Usado en**: `Landing.vue`, `Chat.vue` (placeholder)

---

## 🗄️ Gestión de Estado

### Estado Global vs Local

#### Estado Global (Shared via Composables)

```typescript
// useAuth() - Estado compartido
const user = ref<User | null>(null); // ✅ Global

export function useAuth() {
  return { user, login, logout };
}

// Usado en múltiples componentes
// Settings.vue
const { user } = useAuth(); // Mismo user

// Profile.vue
const { user } = useAuth(); // Mismo user
```

**Estado Global Actual**:
- `user` (via `useAuth`)
- `loading` (via `useAuth`)
- `error` (via `useAuth`)

**No hay**:
- Feed global
- Matches global
- Likers global

Cada componente fetcha sus propios datos.

#### Estado Local (Per-Component)

```typescript
// Swipe.vue
const profiles = ref<User[]>([]); // ❌ Local a Swipe.vue
const currentProfile = computed(() => profiles.value[0]);
```

**Ventaja**: Simplicidad
**Desventaja**: Re-fetch en cada navegación

---

## 🎯 Routing Architecture

### Configuración de Rutas

```typescript
const routes: Array<RouteRecordRaw> = [
  { path: "/", redirect: "/landing" },
  { path: "/landing", component: Landing },
  { path: "/onboarding", component: Onboarding },
  { path: "/login", component: Login },
  { path: "/upload-photos", component: UploadPhotos },
  { path: "/swipe", component: Swipe },
  { path: "/matches", component: Matches },
  { path: "/likers", component: Likers },
  { path: "/feed", component: Feed },
  { path: "/chat/:id", component: Chat, props: true }, // ✅ Con parámetro
  { path: "/profile", component: Profile },
  { path: "/settings", component: Settings },
  {
    path: "/complete-profile",
    name: "CompleteProfile",
    component: () => import("./components/CompleteProfile.vue"), // ✅ Lazy load
    meta: { requiresAuth: true }, // ⚠️ Metadata pero sin guard
  },
];
```

### Route Guards (⚠️ NO IMPLEMENTADOS)

**Problema**: Cualquier usuario puede acceder a cualquier ruta, incluso sin autenticación.

**Solución Recomendada**:

```typescript
// router.ts
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('synastr_token');
  const publicPages = ['/landing', '/login', '/onboarding'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !token) {
    // No autenticado, redirigir a login
    return next('/login');
  }

  // Verificar perfil completo
  if (authRequired && token) {
    // TODO: Verificar si usuario tiene fotos y userInfo
    // Si no, redirigir a /upload-photos o /complete-profile
  }

  next();
});
```

### Navegación Programática

```typescript
import { useRouter } from 'vue-router';

const router = useRouter();

// Navegar a ruta
router.push('/swipe');

// Navegar con parámetros
router.push(`/chat/${userId}`);

// Navegar y reemplazar historial
router.replace('/login');

// Volver atrás
router.back();
```

---

## 🎨 Arquitectura de Estilos

### Estrategia de Estilos

```
Global Styles (base.scss)
        ↓
Component Scoped Styles
        ↓
Inline Styles (excepcional)
```

### Estructura de Estilos

```scss
// src/styles/base.scss
// ✅ Variables globales
$primary-color: #6c63ff;
$secondary-color: #e74c3c;

// ✅ Resets y base styles
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Inter', sans-serif;
}

// ✅ Utility classes (opcional)
.text-center { text-align: center; }
```

### Scoped Styles en Componentes

```vue
<style scoped>
/* ✅ Estilos con scope - no afectan otros componentes */
.component-name {
  max-width: 600px;
  margin: auto;
}

/* ✅ BEM naming para componentes complejos */
.user-card__photo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
</style>
```

**Beneficios**:
- No hay conflictos de nombres
- Estilos encapsulados
- Fácil de mantener

---

## 📱 Responsive Design

### Estrategia Responsive

**Enfoque**: Mobile-first (⚠️ no completamente implementado)

```scss
// Base styles para móvil
.grid {
  grid-template-columns: 1fr;
}

// Tablets
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

// Desktop
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Componentes Responsive**:
- ✅ `UploadPhotos.vue` - Grid adaptable
- ✅ `Matches.vue`, `Likers.vue` - Flexbox responsive
- ⚠️ Otros componentes - responsive básico

---

## 🔧 Build y Deploy Architecture

### Vite Build Process

```
┌─────────────────────────────────────┐
│     Development (npm run dev)       │
├─────────────────────────────────────┤
│ 1. Vite Dev Server (port 5173)     │
│ 2. Hot Module Replacement (HMR)    │
│ 3. TypeScript compilation on-fly   │
│ 4. SASS compilation on-fly         │
│ 5. Import path resolution          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│    Production (npm run build)       │
├─────────────────────────────────────┤
│ 1. TypeScript compilation          │
│ 2. SASS → CSS compilation          │
│ 3. Tree-shaking (dead code removal)│
│ 4. Minification (JS + CSS)         │
│ 5. Code splitting (lazy routes)    │
│ 6. Asset optimization (images)     │
│ 7. Output to /dist folder          │
└─────────────────────────────────────┘
```

### Configuración Vite

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Permite import '@/components/...'
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/graphql': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production image
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Deployment Flow**:
```
Local Development
        ↓
npm run build
        ↓
Docker build
        ↓
Docker image
        ↓
Deploy to cloud (AWS/GCP/Vercel)
        ↓
Production
```

---

## 🧪 Testing Architecture (⚠️ NO IMPLEMENTADO)

### Propuesta de Arquitectura de Testing

```
┌─────────────────────────────────────────────┐
│            Testing Pyramid                  │
├─────────────────────────────────────────────┤
│                                             │
│        E2E Tests (Playwright/Cypress)       │
│              [5% de tests]                  │
│        ┌─────────────────────┐             │
│        │  User flows         │             │
│        │  - Login → Swipe    │             │
│        │  - Register → Match │             │
│        └─────────────────────┘             │
│                  ▲                          │
│                  │                          │
│     Integration Tests (Testing Library)    │
│              [15% de tests]                 │
│        ┌─────────────────────┐             │
│        │  Component + API    │             │
│        │  - Swipe component  │             │
│        │  - Fetch & render   │             │
│        └─────────────────────┘             │
│                  ▲                          │
│                  │                          │
│          Unit Tests (Vitest)               │
│              [80% de tests]                 │
│        ┌─────────────────────┐             │
│        │  - Composables      │             │
│        │  - Utils            │             │
│        │  - Helpers          │             │
│        └─────────────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔍 Performance Considerations

### Optimizaciones Actuales

✅ **Lazy Loading de Rutas**:
```typescript
component: () => import("./components/CompleteProfile.vue")
```

✅ **Code Splitting**: Vite hace automáticamente

✅ **Tree Shaking**: Vite elimina código no usado

### Optimizaciones Pendientes

❌ **Image Optimization**:
- Usar Cloudinary transformations
- Lazy load de imágenes
- Responsive images con srcset

❌ **GraphQL Caching**:
- Cache de queries frecuentes
- Invalidación inteligente de cache

❌ **Virtualization**:
- Virtual scrolling para listas largas (feed, matches)

❌ **Service Worker**:
- Offline support
- Cache de assets estáticos

---

## 📊 Monitoreo y Observabilidad (⚠️ NO IMPLEMENTADO)

### Propuesta de Arquitectura de Monitoreo

```
Frontend → Logs → Console / Sentry
        ↓
        Analytics → Google Analytics / Mixpanel
        ↓
        Performance → Web Vitals
        ↓
        Errors → Sentry / LogRocket
```

**Métricas a Rastrear**:
- Core Web Vitals (LCP, FID, CLS)
- Time to Interactive
- GraphQL request duration
- Error rate
- User flows completion rate

---

## 🔒 Seguridad Architecture

### Amenazas y Mitigaciones

| Amenaza | Estado | Mitigación |
|---------|--------|------------|
| XSS | ⚠️ Parcial | Vue escapa HTML automáticamente |
| CSRF | ❌ No | ⚠️ TODO: CSRF tokens |
| Token theft | ⚠️ Vulnerable | ⚠️ localStorage expuesto a XSS |
| Man-in-Middle | ✅ OK | HTTPS en producción |
| SQL Injection | ✅ Backend | GraphQL + ORM previene |

### Recomendaciones de Seguridad

1. **Migrar de localStorage a httpOnly cookies**
2. **Implementar CSRF protection**
3. **Sanitizar inputs del usuario**
4. **Rate limiting en backend**
5. **Content Security Policy (CSP)**

---

## 📚 Decisiones Arquitectónicas (ADRs)

### ADR-001: Vue 3 Composition API

**Decisión**: Usar Composition API en lugar de Options API

**Contexto**: Vue 3 ofrece dos APIs

**Razones**:
- Mejor TypeScript support
- Lógica más reutilizable
- Menos boilerplate
- Más moderno

**Consecuencias**:
- ✅ Código más limpio
- ✅ Mejor tipado
- ⚠️ Curva de aprendizaje para devs de Vue 2

### ADR-002: graphql-request vs Apollo Client

**Decisión**: Usar graphql-request

**Contexto**: Necesitamos cliente GraphQL

**Razones**:
- Más ligero (Apollo: 300KB, graphql-request: 50KB)
- Más simple
- No necesitamos cache complejo
- TypeScript excelente

**Consecuencias**:
- ✅ Bundle más pequeño
- ✅ Menos complejidad
- ❌ No hay cache automático
- ❌ No hay optimistic updates

### ADR-003: Composables para Estado Global

**Decisión**: Usar composables en lugar de Vuex/Pinia

**Contexto**: Necesitamos compartir estado de autenticación

**Razones**:
- Estado simple (solo usuario autenticado)
- Vuex/Pinia es overkill
- Composables son más TypeScript-friendly

**Consecuencias**:
- ✅ Menos dependencias
- ✅ Más simple
- ⚠️ Podría necesitar Pinia si crece mucho

### ADR-004: Cloudinary para Fotos

**Decisión**: Usar Cloudinary (⚠️ pendiente de implementar)

**Contexto**: Necesitamos almacenar fotos de usuarios

**Razones**:
- Optimización automática
- CDN global
- Transformaciones on-the-fly
- Free tier generoso

**Consecuencias**:
- ✅ Mejor performance
- ✅ Menos carga en backend
- ❌ Dependencia externa
- ⚠️ Costo en escala

---

**Última actualización**: 2025-11-22
**Mantenido por**: TanukiDev09
**Proyecto**: Synastr Frontend v0.1.0

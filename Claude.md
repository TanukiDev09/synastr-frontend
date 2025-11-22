# Claude.md - Guía para Desarrollo con IA

Este documento proporciona contexto y directrices para que Claude (o cualquier asistente de IA) trabaje efectivamente en el proyecto Synastr Frontend.

---

## 📋 Contexto del Proyecto

### ¿Qué es Synastr?

**Synastr** es una aplicación web de dating con enfoque astrológico, similar a Tinder, que conecta personas basándose en compatibilidad astrológica calculada a partir de sus cartas natales.

**Valor diferencial**: Matching basado en astrología (posiciones planetarias, signos, casas) además de preferencias tradicionales.

### Stack Tecnológico

```
Frontend:
- Vue 3 (Composition API)
- TypeScript 5.2
- Vite 4.5
- Vue Router 4
- SASS/SCSS

Backend Communication:
- GraphQL (via graphql-request)
- Endpoint: http://localhost:8000/graphql
- Autenticación: JWT (Bearer token en header)

Librerías Especializadas:
- @astrodraw/astrochart v3.0.2 (visualización de cartas natales)

Servicios Externos:
- Cloudinary (almacenamiento de fotos) - PENDIENTE DE IMPLEMENTAR
```

### Estado Actual

**Implementación General: ~52%**

Ver `EPICS.md` para detalles completos de cada épica y su porcentaje de implementación.

---

## 🚨 Bloqueadores Críticos Actuales

### 1. Upload de Fotos es MOCK
**Ubicación**: `src/components/UploadPhotos.vue:64-68`

La función `uploadToCloudinary()` NO sube realmente a Cloudinary. Es un mock que retorna URLs de placeholder.

**NO modificar** sin implementar primero la integración real con Cloudinary.

### 2. Feed.vue tiene Inconsistencias
**Ubicación**: `src/components/Feed.vue`

Usa schema con `snake_case` (`user_info`, `sexual_orientation`) en lugar del `camelCase` estándar del resto del proyecto.

**Verificar** con el backend antes de modificar.

### 3. Chat no Implementado
**Ubicación**: `src/components/Chat.vue`

Solo es un placeholder. Requiere WebSockets o GraphQL Subscriptions.

### 4. Composable useAstroChart no Integrado
**Ubicación**: `src/composables/useAstroChart.ts`

Existe y funciona, pero NO se usa en ningún componente.

**Oportunidad**: Integrarlo en `Profile.vue` o `Swipe.vue`.

---

## 🎯 Reglas de Desarrollo

### Naming Conventions

#### 1. Variables y Propiedades
```typescript
// ✅ CORRECTO - camelCase
const birthDate = "2000-01-01";
const natalChart = { ... };
const userInfo = { ... };

// ❌ INCORRECTO - snake_case
const birth_date = "2000-01-01";
const user_info = { ... };
```

**Excepción**: `Feed.vue` usa snake_case pero está marcado como inconsistente.

#### 2. Componentes
```typescript
// ✅ CORRECTO - PascalCase
import CompleteProfile from './components/CompleteProfile.vue';
import UploadPhotos from './components/UploadPhotos.vue';
```

#### 3. GraphQL
```typescript
// ✅ CORRECTO - Mutations en UPPER_CASE
export const SIGN_UP_MUTATION = gql`...`;
export const LOGIN_MUTATION = gql`...`;

// ✅ CORRECTO - Queries en UPPER_CASE
export const FEED_QUERY = gql`...`;
export const GET_CURRENT_USER_QUERY = gql`...`;
```

### GraphQL Best Practices

#### 1. Usar el Cliente Correcto

```typescript
// ✅ CORRECTO - Usar la función 'request' helper
import { request } from '../graphql/client';
const data = await request(LOGIN_MUTATION, { email, password });

// ✅ TAMBIÉN CORRECTO - Usar graphqlClient directamente
import { graphqlClient } from '../graphql/client';
const data = await graphqlClient.request(LOGIN_MUTATION, { email, password });
```

**IMPORTANTE**: Ambos métodos comparten la misma instancia de GraphQLClient, por lo que el token JWT se aplica automáticamente.

#### 2. Autenticación

```typescript
// ✅ El token se configura automáticamente
import { setAuthToken } from '../graphql/auth';

// Después de login/signup
setAuthToken(token); // Configura el header Authorization en graphqlClient

// Para logout
setAuthToken(null); // Limpia el token
```

**NO** configurar manualmente headers de autorización. El sistema de auth lo hace automáticamente.

#### 3. Estructura de Queries

```typescript
// ✅ CORRECTO - Usar tipos definidos
import { FEED_QUERY, type User } from '../graphql/queries';

const { feed } = await request<{ feed: User[] }>(FEED_QUERY);

// ✅ CORRECTO - Usar interfaces para variables
interface SignUpInput {
  email: string;
  password: string;
  birthDate: string;
  // ...
}
```

### Manejo de Estado con Composables

#### useAuth()

```typescript
import { useAuth } from '../composables/useAuth';

const { user, loading, error, signUp, login, logout, fetchCurrentUser } = useAuth();

// ✅ user es reactivo y compartido globalmente
// ✅ Actualizar usuario después de cambios
await updateProfile(...);
await fetchCurrentUser(); // Refresca datos del usuario
```

#### useAstroChart() - PENDIENTE DE INTEGRAR

```typescript
import { useAstroChart } from '../composables/useAstroChart';

const { chartContainer, drawChart } = useAstroChart('chart-container-id');

// Usar en componente
onMounted(() => {
  if (user.value?.natalChart) {
    drawChart(user.value.natalChart);
  }
});
```

### Routing y Navegación

```typescript
// ✅ Flujo de Onboarding
Landing → Onboarding → UploadPhotos → CompleteProfile → Swipe

// ✅ Flujo de Login
Landing → Login → Swipe

// ✅ Después de autenticado
Swipe ↔ Matches ↔ Likers ↔ Profile ↔ Settings ↔ Chat
```

**IMPORTANTE**: El flujo actual puede saltarse pasos. Considerar guards de ruta para validar que el usuario completó su perfil.

---

## 📁 Estructura de Archivos

```
src/
├── components/           # 13 componentes Vue
│   ├── Landing.vue      # Página inicial
│   ├── Onboarding.vue   # Registro con datos astrológicos
│   ├── Login.vue        # Autenticación
│   ├── UploadPhotos.vue # Upload fotos (⚠️ MOCK)
│   ├── CompleteProfile.vue # Información adicional
│   ├── Swipe.vue        # Descubrimiento (interfaz Tinder)
│   ├── Feed.vue         # Feed alternativo (⚠️ inconsistente)
│   ├── Matches.vue      # Matches mutuos
│   ├── Likers.vue       # Usuarios que te dieron like
│   ├── Chat.vue         # Chat (⚠️ placeholder)
│   ├── Profile.vue      # Perfil propio
│   └── Settings.vue     # Configuración
│
├── composables/
│   ├── useAuth.ts       # Estado global de autenticación
│   └── useAstroChart.ts # Visualización carta natal (⚠️ no usado)
│
├── graphql/
│   ├── client.ts        # GraphQL client configurado
│   ├── auth.ts          # Funciones de autenticación JWT
│   ├── queries.ts       # Queries GraphQL + tipos TypeScript
│   ├── mutations.ts     # Mutations GraphQL
│   └── operations.ts    # Funciones helper (addPhotos)
│
├── types/               # Tipos TypeScript adicionales
├── styles/              # Estilos globales SASS
│   └── base.scss
│
├── router.ts            # Configuración de rutas
├── main.ts              # Entry point (llama initAuth())
└── App.vue              # Componente raíz
```

---

## 🔧 Tareas Comunes

### Agregar un Nuevo Campo al Perfil

1. **Actualizar interfaz TypeScript** (`src/graphql/queries.ts`):
```typescript
export interface UserInfo {
  // ... campos existentes
  newField?: string; // Agregar aquí
}
```

2. **Actualizar queries GraphQL**:
```graphql
# En GET_CURRENT_USER_QUERY y FEED_QUERY
userInfo {
  # ... campos existentes
  newField
}
```

3. **Actualizar mutation UPDATE_PROFILE**:
```typescript
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile(
    # ... parámetros existentes
    $newField: String
  ) {
    updateProfile(
      # ... argumentos existentes
      newField: $newField
    ) {
      # ... campos de respuesta
    }
  }
`;
```

4. **Actualizar componente UI** (`CompleteProfile.vue` o `Settings.vue`):
```vue
<div class="form-group">
  <label for="newField">New Field</label>
  <input v-model="form.newField" id="newField" type="text" />
</div>
```

### Agregar una Nueva Ruta

1. **Crear componente** en `src/components/NewComponent.vue`

2. **Agregar ruta** en `src/router.ts`:
```typescript
import NewComponent from "./components/NewComponent.vue";

const routes: Array<RouteRecordRaw> = [
  // ... rutas existentes
  { path: "/new-route", component: NewComponent },
];
```

3. **Agregar navegación** donde sea necesario:
```typescript
import { useRouter } from 'vue-router';

const router = useRouter();
router.push('/new-route');
```

### Hacer una Query GraphQL

```typescript
import { request } from '../graphql/client';
import { gql } from 'graphql-request';

// Definir query
const MY_QUERY = gql`
  query MyQuery($param: String!) {
    myQuery(param: $param) {
      id
      name
    }
  }
`;

// Ejecutar
const data = await request(MY_QUERY, { param: 'value' });
```

### Hacer una Mutation GraphQL

```typescript
import { request } from '../graphql/client';
import { MY_MUTATION } from '../graphql/mutations';

try {
  const result = await request(MY_MUTATION, {
    input: { /* ... */ }
  });

  // Manejar éxito
  console.log('Success:', result);
} catch (error: any) {
  // Manejar error
  const errorMessage = error.response?.errors?.[0]?.message || 'Error occurred';
  console.error(errorMessage);
}
```

---

## ⚠️ Problemas Conocidos y Workarounds

### 1. Fotos no se Suben Realmente

**Problema**: `uploadToCloudinary()` es un mock.

**Workaround Temporal**: Las URLs de placeholder funcionan para desarrollo de UI, pero:
- NO almacenar en producción
- Implementar Cloudinary antes de deploy

**Solución Real**: Ver épica 8 en `EPICS.md`.

### 2. Feed.vue usa Schema Diferente

**Problema**: Usa `snake_case` en lugar de `camelCase`.

**Workaround**: Usar `Swipe.vue` en lugar de `Feed.vue` para desarrollo.

**Solución Real**:
- Verificar schema del backend
- Unificar a `camelCase` o
- Crear transformadores de datos

### 3. Carta Natal no se Visualiza

**Problema**: `useAstroChart` no se usa.

**Solución Rápida**: Integrar en `Profile.vue`:
```vue
<template>
  <div>
    <h2>Mi Carta Natal</h2>
    <div ref="chartContainer" style="width: 400px; height: 400px;"></div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useAuth } from '../composables/useAuth';
import { useAstroChart } from '../composables/useAstroChart';

const { user } = useAuth();
const { chartContainer, drawChart } = useAstroChart('natal-chart');

onMounted(() => {
  if (user.value?.natalChart) {
    drawChart(user.value.natalChart);
  }
});
</script>
```

---

## 🧪 Testing (Pendiente de Implementar)

Actualmente NO hay tests configurados.

**TODO**:
- Configurar Vitest
- Tests unitarios para composables
- Tests de integración para componentes
- Tests E2E con Playwright/Cypress

---

## 🚀 Deployment (Pendiente)

El proyecto incluye `Dockerfile` para containerización:

```dockerfile
# Build estático con Nginx
FROM node:18 AS builder
# ... build steps

FROM nginx:alpine
# Expone puerto 80
```

**Variables de Entorno**:
```bash
VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

Actualizar antes de deploy a producción.

---

## 📚 Recursos Adicionales

### Documentación del Proyecto
- `EPICS.md` - Features principales y estado de implementación
- `Agents.md` - Roles y agentes del sistema (ver archivo)
- `Architecture.md` - Arquitectura técnica detallada (ver archivo)

### Documentación Externa
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
- [@astrodraw/astrochart](https://github.com/Kibo/AstroChart)
- [Cloudinary Upload](https://cloudinary.com/documentation/upload_images)

---

## 💡 Tips para Claude

### Cuando te Pidan Agregar Features

1. ✅ **Leer primero** el componente completo antes de modificar
2. ✅ **Verificar** si la funcionalidad ya existe (puede estar en otro archivo)
3. ✅ **Revisar** `EPICS.md` para ver el estado de implementación
4. ✅ **Considerar** si necesitas actualizar mutations/queries GraphQL
5. ✅ **Mantener consistencia** con naming conventions

### Cuando Encuentres Bugs

1. ✅ **Verificar** si está en la lista de "Problemas Conocidos" arriba
2. ✅ **Revisar** `EPICS.md` sección "Limitaciones" de cada épica
3. ✅ **Buscar** TODOs en el código: `grep -r "TODO" src/`
4. ✅ **No asumir** que algo está roto - puede ser mock intencional

### Cuando Refactorices

1. ⚠️ **Cuidado** con `UploadPhotos.vue` - el mock es intencional
2. ⚠️ **No cambiar** `Feed.vue` sin verificar backend
3. ✅ **Mantener** compatibilidad con GraphQL schema
4. ✅ **Actualizar** tipos TypeScript si cambias interfaces

---

## 🎨 Estándares de Código

### Vue Components

```vue
<template>
  <!-- HTML semántico -->
  <div class="component-name">
    <h1>{{ title }}</h1>
  </div>
</template>

<script setup lang="ts">
// ✅ Usar Composition API con <script setup>
// ✅ TypeScript siempre
import { ref, computed, onMounted } from 'vue';

// Props con tipos
interface Props {
  title: string;
}
const props = defineProps<Props>();

// Estado reactivo
const count = ref(0);

// Computed properties
const doubled = computed(() => count.value * 2);

// Lifecycle hooks
onMounted(() => {
  // Inicialización
});
</script>

<style scoped>
/* ✅ Usar scoped styles */
/* ✅ Naming con BEM si es complejo */
.component-name {
  /* ... */
}
</style>
```

### TypeScript

```typescript
// ✅ Usar interfaces para objetos
interface User {
  id: string;
  email: string;
}

// ✅ Usar types para uniones/tipos complejos
type Status = 'pending' | 'completed' | 'error';

// ✅ Evitar 'any' - usar tipos específicos
const data = await request<{ users: User[] }>(QUERY);

// ❌ Evitar
const data = await request<any>(QUERY);
```

---

## 🔐 Seguridad

### Autenticación

```typescript
// ✅ Token se almacena en localStorage
// ✅ Token se envía automáticamente en cada request
// ✅ Token se limpia en logout

// ⚠️ localStorage es vulnerable a XSS
// TODO: Considerar httpOnly cookies para producción
```

### Validación

```typescript
// ⚠️ IMPORTANTE: Validar en backend siempre
// Frontend validation es solo UX

// ✅ Validación básica en forms
<input type="email" required />
<input type="password" minlength="8" required />
```

---

## 📝 Checklist Antes de Commit

- [ ] Código compila sin errores TypeScript
- [ ] No hay console.logs innecesarios
- [ ] Componentes usan `<script setup lang="ts">`
- [ ] Imports organizados (Vue, third-party, local)
- [ ] Naming conventions seguidas (camelCase)
- [ ] GraphQL queries/mutations usan tipos
- [ ] Manejo de errores implementado
- [ ] Loading states manejados
- [ ] Componente es responsive (si aplica)

---

**Última actualización**: 2025-11-22
**Mantenido por**: TanukiDev09
**Proyecto**: Synastr Frontend v0.1.0

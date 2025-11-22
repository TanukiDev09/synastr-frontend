# Épicas y Features Principales - Synastr Frontend

Este documento describe las principales épicas del proyecto Synastr, una aplicación de dating con enfoque astrológico, junto con su estado de implementación actual.

---

## 📊 Resumen de Implementación

| Épica | Estado | Implementación | Notas |
|-------|--------|----------------|-------|
| 1. Autenticación y Onboarding | ⚠️ Parcial | **75%** | Falta geocodificación frontend |
| 2. Construcción de Perfil | ⚠️ Parcial | **50%** | ⚠️ Upload fotos es MOCK |
| 3. Sistema de Descubrimiento | ⚠️ Parcial | **70%** | Feed tiene inconsistencias |
| 4. Gestión de Matches | ⚠️ Parcial | **80%** | Funcional pero depende del feed |
| 5. Mensajería y Chat | ❌ No implementado | **10%** | Solo placeholder |
| 6. Perfil y Configuración | ⚠️ Parcial | **75%** | Falta visualización carta natal |
| 7. Integración Astrológica | ⚠️ Parcial | **55%** | Composable no integrado |
| 8. Gestión de Fotos | ❌ Mock | **25%** | ⚠️ Cloudinary es FALSO |

**Implementación General del Proyecto: ~52%**

> ⚠️ **NOTA CRÍTICA**: Varios componentes tienen UIs completas pero funcionalidades mock/placeholder. Ver detalles abajo.

---

## 1️⃣ Épica: Autenticación y Onboarding

**Implementación: 75%** ⚠️

### Descripción
Sistema completo de autenticación de usuarios que incluye registro, login y captura de datos astrológicos básicos para la generación de la carta natal.

### Features Implementadas

#### ✅ Landing Page
- **Componente**: `Landing.vue`
- **Ruta**: `/landing`
- **Funcionalidad**: Página principal con eslogan "Descubre tu compatibilidad astrológica" y botones de CTA para registro e inicio de sesión
- **Estado**: Completamente funcional

#### ✅ Registro de Usuario (Onboarding)
- **Componente**: `Onboarding.vue`
- **Ruta**: `/onboarding`
- **Funcionalidad**:
  - Formulario de registro con campos:
    - Email
    - Contraseña
    - Fecha de nacimiento
    - Hora de nacimiento
    - Lugar de nacimiento (con geocodificación automática)
    - Género
    - Orientación sexual
    - Qué busca (tipo de relación)
  - Cálculo automático de carta natal en backend
  - Almacenamiento de coordenadas (latitud, longitud, timezone)
- **Mutation GraphQL**: `SIGN_UP_MUTATION`
- **Estado**: Completamente funcional

#### ✅ Login
- **Componente**: `Login.vue`
- **Ruta**: `/login`
- **Funcionalidad**:
  - Autenticación con email y contraseña
  - JWT token almacenado en localStorage
  - Redirección automática a `/swipe` después del login
- **Mutation GraphQL**: `LOGIN_MUTATION`
- **Estado**: Completamente funcional

#### ✅ Sistema de Autenticación JWT
- **Archivo**: `src/graphql/auth.ts`
- **Funcionalidad**:
  - Gestión de tokens JWT en localStorage (clave: `synastr_token`)
  - Inyección automática de token en header `Authorization: Bearer`
  - Función `initAuth()` para recuperar usuario actual al iniciar sesión
  - Composable `useAuth()` para acceder al usuario autenticado
- **Estado**: Completamente funcional

### ⚠️ Limitaciones Encontradas
- **Geocodificación**: El campo `birthPlace` es solo texto libre. No hay conversión a coordenadas (lat/lng/timezone) en el frontend - esto depende del backend (25%)
- **Validación de lugar**: No hay autocompletado ni verificación de que el lugar existe

### Pendiente
- Recuperación de contraseña (5%)
- Geocodificación frontend con API (ej: Google Maps) (20%)

### Archivos Relacionados
- `src/components/Landing.vue`
- `src/components/Onboarding.vue`
- `src/components/Login.vue`
- `src/graphql/auth.ts`
- `src/composables/useAuth.ts`
- `src/graphql/mutations.ts:6-63` (SIGN_UP_MUTATION)
- `src/graphql/mutations.ts:68-125` (LOGIN_MUTATION)

---

## 2️⃣ Épica: Construcción de Perfil

**Implementación: 50%** ⚠️ **BLOQUEADOR CRÍTICO**

### Descripción
Sistema de completado de perfil que permite a los usuarios añadir fotos temáticas por signo zodiacal e información adicional detallada sobre su estilo de vida, preferencias y características personales.

### Features Implementadas

#### ❌ Subida de Fotos por Signo Zodiacal **[MOCK - NO FUNCIONAL]**
- **Componente**: `UploadPhotos.vue`
- **Ruta**: `/upload-photos`
- **Funcionalidad UI** (✅ Implementada):
  - Grid interactivo de 13 espacios para fotos
  - 1 foto de perfil principal (obligatoria)
  - 12 fotos temáticas opcionales (una por cada signo del zodíaco)
  - Prompts personalizados por signo zodiacal:
    - **Aries**: "Comparte una foto tuya en plena acción"
    - **Taurus**: "Muestra un momento de placer sensorial"
    - **Gemini**: "Comparte una foto con amigos o conversando"
    - Etc. (12 prompts únicos)
  - Preview de fotos antes de subir (✅)

- **❌ PROBLEMA CRÍTICO - Integración FALSA**:
  ```typescript
  // src/components/UploadPhotos.vue:64-68
  async function uploadToCloudinary(file: File): Promise<string> {
    console.log(`Subiendo ${file.name} a Cloudinary...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `https://placehold.co/600x400/png?text=Uploaded+${file.name}`;
  }
  ```
  - **NO sube realmente a Cloudinary**
  - Solo espera 1 segundo y retorna URL de placeholder
  - Las fotos NO se almacenan en ningún servidor
  - Las URLs generadas son placeholders de placehold.co

- **Mutations GraphQL**: Definidas pero NO utilizadas correctamente
  - `UPLOAD_PHOTO_MUTATION` (existe en mutations.ts pero no se usa)
  - `DELETE_PHOTO_MUTATION` (existe pero probablemente no funciona)

- **Estado**:
  - ✅ UI: 90%
  - ❌ Funcionalidad backend: 10%
  - **TOTAL: ~20%**

#### ✅ Completar Información Adicional
- **Componente**: `CompleteProfile.vue`
- **Ruta**: `/complete-profile`
- **Funcionalidad**: Formulario extenso con 13+ campos opcionales organizados en categorías:

  **Físico**:
  - Altura (cm)
  - Peso (kg)

  **Educación y Carrera**:
  - Escuela/Universidad
  - Nivel educativo

  **Preferencias de Vida**:
  - Hijos (tiene/quiere/no quiere)
  - Alcohol (frecuencia)
  - Tabaco (frecuencia)

  **Estilo de Vida**:
  - Fitness (frecuencia de ejercicio)
  - Dieta (tipo de alimentación)
  - Patrones de sueño

  **Creencias y Valores**:
  - Política (espectro político)
  - Espiritualidad

  **Comunicación y Social**:
  - Estilo de comunicación
  - Mascotas (preferencia)
  - Idiomas (multiselect)
  - Intereses (multiselect)

- **Mutation GraphQL**: `UPDATE_PROFILE_MUTATION`
- **Estado**: Completamente funcional

### Pendiente (CRÍTICO - 50%)
- **Implementar upload REAL a Cloudinary** (30%)
  - Configurar Cloudinary SDK
  - Obtener credenciales de API
  - Implementar upload real con progreso
- **Usar UPLOAD_PHOTO_MUTATION correctamente** (10%)
- **Implementar DELETE_PHOTO_MUTATION** (10%)
- Validación de tamaño de archivos (3%)
- Compresión automática de imágenes (2%)

### Archivos Relacionados
- `src/components/UploadPhotos.vue`
- `src/components/CompleteProfile.vue`
- `src/graphql/mutations.ts:232-248` (UPLOAD_PHOTO_MUTATION)
- `src/graphql/mutations.ts:244-248` (DELETE_PHOTO_MUTATION)
- `src/graphql/mutations.ts:130-197` (UPDATE_PROFILE_MUTATION)

---

## 3️⃣ Épica: Sistema de Descubrimiento

**Implementación: 70%** ⚠️

### Descripción
Interfaz tipo Tinder para descubrir y evaluar perfiles de otros usuarios, con visualización de información astrológica y sistema de likes/dislikes.

### Features Implementadas

#### ✅ Feed de Perfiles (Swipe Interface)
- **Componente**: `Swipe.vue`
- **Ruta**: `/swipe`
- **Funcionalidad**:
  - Muestra perfiles de usuarios uno por uno
  - Visualización de:
    - Foto de perfil
    - Email (actualmente usado como nombre)
    - Fecha de nacimiento
    - Información astrológica (Sun, Moon, Rising signs)
    - Género y orientación
    - Qué busca
  - Botones de acción:
    - **Like** (verde) - Envía like al usuario
    - **Skip** (rojo) - Pasa al siguiente perfil sin interactuar
  - Carga automática de siguiente perfil después de acción
  - Mensaje cuando no hay más perfiles disponibles
- **Query GraphQL**: `FEED_QUERY`
- **Mutation GraphQL**: `LIKE_USER_MUTATION`
- **Estado**: Completamente funcional

#### ⚠️ Feed Extendido con Información Adicional **[INCONSISTENCIAS]**
- **Componente**: `Feed.vue`
- **Ruta**: `/feed`
- **Funcionalidad**: Versión alternativa de Swipe que incluye información adicional del perfil
  - Muestra fotos, email, género
  - Información adicional: mascotas, idiomas, intereses, drinking

- **⚠️ PROBLEMAS ENCONTRADOS**:
  - Usa query personalizada `getFeed` (no el `FEED_QUERY` estándar de queries.ts)
  - **Inconsistencia de schema**: Usa `snake_case` en lugar de `camelCase`:
    - `sexual_orientation` en vez de `sexualOrientation`
    - `user_info` en vez de `userInfo`
  - Esto sugiere que puede NO estar sincronizado con el backend actual
  - No tiene funcionalidad de like/skip (solo muestra datos)

- **Query GraphQL**: Query personalizada inline (no usa `FEED_QUERY` de queries.ts)
- **Estado**:
  - ✅ UI: 80%
  - ⚠️ Integración backend: 40%
  - **TOTAL: ~60%**

#### ✅ Sistema de Likes
- **Funcionalidad**:
  - Like a usuarios (crea relación en backend)
  - Unlike (retira like previamente dado)
  - Detección automática de matches (like mutuo)
- **Mutations GraphQL**:
  - `LIKE_USER_MUTATION`
  - `UNLIKE_USER_MUTATION`
- **Estado**: Completamente funcional

### Pendiente
- Filtros de búsqueda (edad, distancia, preferencias) (15%)
- Algoritmo de compatibilidad astrológica para ordenar feed (10%)
- Gestos de swipe táctiles para móviles (5%)

### Archivos Relacionados
- `src/components/Swipe.vue`
- `src/components/Feed.vue`
- `src/graphql/queries.ts:105-154` (FEED_QUERY)
- `src/graphql/mutations.ts:202-212` (LIKE_USER_MUTATION)
- `src/graphql/mutations.ts:217-227` (UNLIKE_USER_MUTATION)

---

## 4️⃣ Épica: Gestión de Matches

**Implementación: 80%** ⚠️

### Descripción
Sistema para visualizar y gestionar usuarios con los que se ha hecho match (like mutuo) y usuarios que han dado like pero aún no han sido correspondidos.

### Features Implementadas

#### ✅ Visualización de Matches
- **Componente**: `Matches.vue`
- **Ruta**: `/matches`
- **Funcionalidad**:
  - Galería de usuarios con los que hay match mutuo
  - Muestra para cada match:
    - Foto de perfil circular
    - Email
    - Fecha de nacimiento
    - Género
    - Qué busca
    - Orientación sexual
  - Grid responsive de tarjetas de perfil
  - Click en tarjeta para ver más detalles o iniciar chat
- **Query GraphQL**: `GET_MATCHES_QUERY`
- **Estado**: Completamente funcional

#### ✅ Visualización de Likers
- **Componente**: `Likers.vue`
- **Ruta**: `/likers`
- **Funcionalidad**:
  - Galería de usuarios que te han dado like pero tú no les has dado like aún
  - Misma visualización que Matches
  - Información básica del perfil
  - Permite navegar para dar like de vuelta (crear match)
- **Query GraphQL**: `GET_LIKERS_QUERY`
- **Estado**: Completamente funcional

### Pendiente
- Búsqueda/filtrado dentro de matches (5%)
- Notificaciones de nuevos matches (5%)

### Archivos Relacionados
- `src/components/Matches.vue`
- `src/components/Likers.vue`
- `src/graphql/queries.ts:156-173` (GET_MATCHES_QUERY)
- `src/graphql/queries.ts:175-192` (GET_LIKERS_QUERY)

---

## 5️⃣ Épica: Mensajería y Chat

**Implementación: 10%** ⚠️

### Descripción
Sistema de mensajería en tiempo real para que los usuarios puedan comunicarse con sus matches.

### Features Implementadas

#### ⚠️ Componente Chat (Placeholder)
- **Componente**: `Chat.vue`
- **Ruta**: `/chat/:id`
- **Funcionalidad Actual**:
  - Componente básico con mensaje placeholder
  - Acepta parámetro de ruta `id` (usuario con quien chatear)
  - Mensaje: "Esta sección se implementará con WebSockets y mensajería"
- **Estado**: Solo estructura básica

### Pendiente (90%)
- **Implementación de WebSockets o GraphQL Subscriptions** (30%)
  - Conexión en tiempo real
  - Subscriptions para nuevos mensajes

- **Sistema de Mensajes** (40%)
  - Envío de mensajes
  - Recepción de mensajes
  - Historial de conversación
  - Persistencia en base de datos

- **UI de Chat** (20%)
  - Lista de conversaciones activas
  - Interfaz de chat (burbujas de mensajes)
  - Indicadores de escritura
  - Estados de lectura/entrega
  - Timestamps

- **Features Adicionales** (10%)
  - Notificaciones de nuevos mensajes
  - Búsqueda en conversaciones
  - Envío de imágenes/multimedia
  - Emojis y reacciones

### Archivos Relacionados
- `src/components/Chat.vue` (placeholder)

---

## 6️⃣ Épica: Perfil y Configuración

**Implementación: 75%** ⚠️

### Descripción
Sistema para visualizar y editar el perfil propio, así como actualizar preferencias del usuario.

### Features Implementadas

#### ✅ Visualización de Perfil Propio
- **Componente**: `Profile.vue`
- **Ruta**: `/profile`
- **Funcionalidad**:
  - Muestra todas las fotos del usuario en galería
  - Información personal completa:
    - Datos básicos (email, fecha de nacimiento, lugar)
    - Género y orientación
    - Información astrológica
    - Información adicional (userInfo)
  - Layout responsive
- **Query GraphQL**: `GET_CURRENT_USER_QUERY`
- **Estado**: Completamente funcional

#### ✅ Edición de Preferencias
- **Componente**: `Settings.vue`
- **Ruta**: `/settings`
- **Funcionalidad**:
  - Formulario para editar:
    - Género
    - Qué busca
    - Orientación sexual
    - Mascotas
    - Idiomas (multiselect)
    - Intereses (multiselect)
  - Guardado automático de cambios
  - Feedback visual de éxito/error
- **Mutation GraphQL**: `UPDATE_PROFILE_MUTATION`
- **Composable**: `useAuth()` para actualizar usuario actual
- **Estado**: Completamente funcional

### Pendiente
- Edición de fotos desde perfil (10%)
- Cambio de contraseña (5%)
- Configuración de privacidad (5%)

### Archivos Relacionados
- `src/components/Profile.vue`
- `src/components/Settings.vue`
- `src/graphql/queries.ts:54-103` (GET_CURRENT_USER_QUERY)
- `src/graphql/mutations.ts:130-197` (UPDATE_PROFILE_MUTATION)
- `src/composables/useAuth.ts`

---

## 7️⃣ Épica: Integración Astrológica

**Implementación: 55%** ⚠️

### Descripción
Sistema completo de astrología que incluye cálculo de cartas natales, almacenamiento de posiciones planetarias, visualización de gráficos astrológicos y algoritmos de compatibilidad.

### Features Implementadas

#### ✅ Cálculo de Carta Natal
- **Ubicación**: Backend (no visible en este repositorio)
- **Funcionalidad**:
  - Cálculo automático durante registro
  - Usa fecha, hora y lugar de nacimiento
  - Calcula coordenadas (latitud, longitud, timezone)
  - Genera posiciones de:
    - Planetas (Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto)
    - Ascendente (Rising)
    - Casas astrológicas (12 casas)
  - Almacena grados, signos y casa de cada planeta
- **Estado**: Completamente funcional

#### ⚠️ Visualización de Carta Natal **[NO INTEGRADO]**
- **Composable**: `useAstroChart.ts`
- **Librería**: `@astrodraw/astrochart` v3.0.2
- **Funcionalidad del Composable**:
  - Dibuja carta natal circular
  - Muestra posiciones de planetas
  - Muestra casas astrológicas
  - Configuración de colores personalizable
  - Evita solapamiento de planetas con offset

- **⚠️ PROBLEMA: Composable NO se usa en ningún componente**:
  - `Profile.vue` NO muestra la carta natal gráfica
  - `Swipe.vue` y `Feed.vue` solo muestran texto (Sun/Moon/Rising)
  - El composable está implementado pero NO integrado en la UI

- **Estado**:
  - ✅ Composable: 95%
  - ❌ Integración en componentes: 0%
  - **TOTAL: ~50%**

#### ✅ Almacenamiento de Datos Astrológicos
- **Estructura de Datos**:
  ```typescript
  natalChart: {
    positions: [
      { name, sign, signIcon, degrees, house }
    ],
    houses: [
      { name, sign, signIcon, degrees, house }
    ]
  }
  ```
- **Query**: Incluido en `SIGN_UP_MUTATION`, `LOGIN_MUTATION`, `GET_CURRENT_USER_QUERY`
- **Estado**: Completamente funcional

#### ✅ Visualización en Perfiles
- **Componentes**: `Swipe.vue`, `Feed.vue`
- **Funcionalidad**:
  - Muestra Sun, Moon y Rising sign en cada perfil
  - Formato legible (ej: "Sun: Aries")
- **Estado**: Completamente funcional

### Pendiente (20%)
- **Algoritmo de Compatibilidad Astrológica** (15%)
  - Cálculo de compatibilidad entre cartas natales
  - Scoring basado en aspectos planetarios
  - Ordenamiento del feed por compatibilidad

- **Visualización de Compatibilidad** (5%)
  - Mostrar porcentaje de compatibilidad en perfiles
  - Explicación de aspectos astrológicos compatibles
  - Gráfico de sinastría (comparación de cartas)

### Archivos Relacionados
- `src/composables/useAstroChart.ts`
- `src/graphql/queries.ts:22-28` (AstrologicalPosition interface)
- `src/graphql/queries.ts:48-51` (natalChart in User interface)
- Package: `@astrodraw/astrochart@3.0.2`

---

## 8️⃣ Épica: Gestión de Fotos

**Implementación: 25%** ❌ **BLOQUEADOR CRÍTICO**

### Descripción
Sistema completo para subir, almacenar, organizar y eliminar fotos de perfil con asociación a signos zodiacales.

### Features Implementadas

#### ❌ Subida de Fotos **[MOCK - NO FUNCIONAL]**
- **Mutation GraphQL**: `UPLOAD_PHOTO_MUTATION` (definida pero NO usada)
- **Funcionalidad**:
  - ❌ Upload a Cloudinary: **FALSO** (solo placeholder)
  - ✅ Asociación de foto con signo zodiacal: UI funciona
  - ✅ Validación de formato de imagen: Básica
  - ✅ Preview antes de subir: Funcional
  - ❌ Feedback de progreso: Fake (solo setTimeout)
- **Estado**:
  - ✅ UI y preview: 90%
  - ❌ Upload real: 0%
  - **TOTAL: ~20%**

#### ❌ Eliminación de Fotos **[PROBABLEMENTE NO FUNCIONAL]**
- **Mutation GraphQL**: `DELETE_PHOTO_MUTATION` (definida pero probablemente no usada)
- **Funcionalidad**:
  - ❌ Elimina foto por URL: No probado (depende de upload real)
  - ⚠️ Actualiza UI automáticamente: Desconocido
  - ❌ Confirmación antes de eliminar: No implementada
- **Estado**: ~30%

#### ✅ Organización por Signos Zodiacales
- **Funcionalidad**:
  - 13 slots: 1 perfil + 12 signos
  - Prompts personalizados por signo
  - Cada foto almacena su signo asociado
  - Visualización organizada en grid
- **Estado**: Completamente funcional

#### ✅ Almacenamiento
- **Backend**: Cloudinary
- **Database**: URLs almacenadas en GraphQL backend
- **Estructura**:
  ```typescript
  photos: [
    { url: string, sign: string }
  ]
  ```
- **Estado**: Completamente funcional

### Pendiente (CRÍTICO - 75%)
- **Implementar upload REAL a Cloudinary** (40%)
  - Configurar Cloudinary SDK o usar upload preset
  - Obtener credenciales de API (cloud name, upload preset)
  - Reemplazar función mock por upload real
  - Manejar respuesta con URL real de Cloudinary
- **Usar UPLOAD_PHOTO_MUTATION correctamente** (15%)
  - Integrar mutation con upload real
  - Enviar URL de Cloudinary al backend
- **Implementar DELETE_PHOTO_MUTATION** (15%)
  - Conectar con backend para eliminar fotos
  - Actualizar UI después de eliminar
- Edición/recorte de imágenes (3%)
- Reordenamiento de fotos (2%)

### Archivos Relacionados
- `src/components/UploadPhotos.vue`
- `src/graphql/mutations.ts:232-248` (UPLOAD_PHOTO_MUTATION y DELETE_PHOTO_MUTATION)

---

## 📈 Roadmap de Prioridades

### 🔥 CRÍTICO - BLOQUEADORES (Sin esto la app NO funciona)
1. **Implementar upload REAL de fotos a Cloudinary** (Épica 2 y 8) - **URGENTE**
   - Actualmente es un MOCK que no sube nada
   - Sin esto los usuarios NO pueden tener fotos reales
   - Estimado: 2-3 días de trabajo
   - Archivos: `src/components/UploadPhotos.vue:64-68`

2. **Implementar sistema de Chat** (Épica 5)
   - WebSockets o GraphQL Subscriptions
   - Mensajería básica en tiempo real
   - UI de conversaciones
   - Estimado: 5-7 días de trabajo

3. **Arreglar inconsistencias de Feed.vue** (Épica 3)
   - Sincronizar schema (camelCase vs snake_case)
   - Usar queries estandarizadas
   - Agregar funcionalidad de like/skip
   - Estimado: 1-2 días de trabajo

### Alta Prioridad (Mejora significativa)
4. **Integrar visualización de carta natal** (Épica 7)
   - Usar `useAstroChart` composable en Profile.vue
   - Mostrar gráfico visual de carta natal
   - Estimado: 1 día de trabajo

5. **Algoritmo de Compatibilidad Astrológica** (Épica 7)
   - Cálculo de compatibilidad entre cartas natales
   - Ordenamiento inteligente del feed
   - Estimado: 3-5 días de trabajo

### Media Prioridad (Nice to have)
6. **Geocodificación frontend** (Épica 1)
   - Autocompletado de birthPlace
   - Conversión a coordenadas

7. **Filtros de Búsqueda** (Épica 3)
   - Filtrar por edad, distancia, preferencias

8. **Notificaciones** (Épicas 4 y 5)
   - Nuevos matches
   - Nuevos mensajes

### Baja Prioridad
9. **Recuperación de contraseña** (Épica 1)
10. **Configuración de privacidad** (Épica 6)
11. **Edición de imágenes** (Épica 8)

---

## 🏗️ Arquitectura Técnica por Épica

| Épica | Componentes | GraphQL | Composables | Dependencias |
|-------|-------------|---------|-------------|--------------|
| 1. Autenticación | Landing, Onboarding, Login | SIGN_UP, LOGIN | useAuth | - |
| 2. Construcción Perfil | UploadPhotos, CompleteProfile | UPLOAD_PHOTO, DELETE_PHOTO, UPDATE_PROFILE | - | Cloudinary |
| 3. Descubrimiento | Swipe, Feed | FEED_QUERY, LIKE_USER, UNLIKE_USER | - | - |
| 4. Matches | Matches, Likers | GET_MATCHES, GET_LIKERS | - | - |
| 5. Chat | Chat | ❌ No implementado | - | ❌ WebSockets pendiente |
| 6. Perfil | Profile, Settings | GET_CURRENT_USER, UPDATE_PROFILE | useAuth | - |
| 7. Astrología | - | natalChart (en queries) | useAstroChart | @astrodraw/astrochart |
| 8. Fotos | UploadPhotos | UPLOAD_PHOTO, DELETE_PHOTO | - | Cloudinary |

---

## 📝 Notas Finales

### Estado General
- **Implementación Real**: **~52%** (anteriormente estimado en 78%)
- **Razón de la discrepancia**: Varios componentes tienen UIs completas pero funcionalidades mock/placeholder

### 🚨 Bloqueadores Críticos Identificados

1. **Upload de Fotos es FALSO** (Épicas 2 y 8)
   - La función `uploadToCloudinary()` es un mock que solo retorna placeholders
   - **Impacto**: Los usuarios NO pueden subir fotos reales
   - **Ubicación**: `src/components/UploadPhotos.vue:64-68`
   - **Prioridad**: 🔥 CRÍTICO

2. **Chat no implementado** (Épica 5)
   - Solo existe placeholder
   - **Impacto**: Los matches no pueden comunicarse
   - **Prioridad**: 🔥 CRÍTICO para MVP

3. **Feed.vue tiene inconsistencias** (Épica 3)
   - Schema desincronizado (snake_case vs camelCase)
   - **Impacto**: Puede no funcionar con el backend real
   - **Prioridad**: 🔥 CRÍTICO

4. **Carta Natal no se visualiza** (Épica 7)
   - Composable `useAstroChart` existe pero NO se usa
   - **Impacto**: Pierde el valor diferencial del producto
   - **Prioridad**: ⚠️ Alta

### ✅ Fortalezas
- Sistema de autenticación JWT robusto y funcional
- UIs bien diseñadas y responsive
- Estructura de GraphQL bien organizada
- Composable de carta natal bien implementado (solo falta integrarlo)
- Flujo de onboarding claro

### ⚠️ Debilidades
- Funcionalidades críticas son mocks (fotos)
- Falta integración de componentes existentes (carta natal)
- Inconsistencias de schema entre componentes
- Falta de funcionalidades core (chat)

### 🎯 Recomendación
**Priorizar en orden**:
1. Implementar upload REAL de fotos (2-3 días)
2. Arreglar Feed.vue (1-2 días)
3. Integrar visualización de carta natal (1 día)
4. Implementar chat (5-7 días)

**Con estas correcciones, el proyecto podría alcanzar ~75-80% de implementación funcional.**

---

**Última actualización**: 2025-11-22 (Revisión crítica y actualización de porcentajes reales)
**Versión del proyecto**: 0.1.0
**Rama**: `claude/identify-project-objectives-01CQz6uhrJ9jMMSgBdPUsBJK`

---

## 🔍 Metodología de Evaluación

Esta evaluación se basó en:
1. ✅ Lectura completa del código fuente de cada componente
2. ✅ Verificación de integración con GraphQL mutations/queries
3. ✅ Identificación de mocks, placeholders y TODOs
4. ✅ Análisis de funcionalidad real vs UI solamente
5. ✅ Búsqueda de inconsistencias de schema y naming

**Archivos clave revisados**: 13 componentes Vue, 5 archivos GraphQL, 2 composables, router, auth, client

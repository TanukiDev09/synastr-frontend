# Épicas y Features Principales - Synastr Frontend

Este documento describe las principales épicas del proyecto Synastr, una aplicación de dating con enfoque astrológico, junto con su estado de implementación actual.

---

## 📊 Resumen de Implementación

| Épica | Estado | Implementación |
|-------|--------|----------------|
| 1. Autenticación y Onboarding | ✅ Completo | 95% |
| 2. Construcción de Perfil | ✅ Completo | 90% |
| 3. Sistema de Descubrimiento | ✅ Completo | 85% |
| 4. Gestión de Matches | ✅ Completo | 90% |
| 5. Mensajería y Chat | ⚠️ En desarrollo | 10% |
| 6. Perfil y Configuración | ✅ Completo | 85% |
| 7. Integración Astrológica | ⚠️ Parcial | 80% |
| 8. Gestión de Fotos | ✅ Completo | 95% |

**Implementación General del Proyecto: ~78%**

---

## 1️⃣ Épica: Autenticación y Onboarding

**Implementación: 95%** ✅

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

### Pendiente
- Recuperación de contraseña (5%)

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

**Implementación: 90%** ✅

### Descripción
Sistema de completado de perfil que permite a los usuarios añadir fotos temáticas por signo zodiacal e información adicional detallada sobre su estilo de vida, preferencias y características personales.

### Features Implementadas

#### ✅ Subida de Fotos por Signo Zodiacal
- **Componente**: `UploadPhotos.vue`
- **Ruta**: `/upload-photos`
- **Funcionalidad**:
  - Grid interactivo de 13 espacios para fotos:
    - 1 foto de perfil principal (obligatoria)
    - 12 fotos temáticas opcionales (una por cada signo del zodíaco)
  - Prompts personalizados por signo zodiacal para inspirar fotos:
    - **Aries**: "Comparte una foto tuya en plena acción"
    - **Taurus**: "Muestra un momento de placer sensorial"
    - **Gemini**: "Comparte una foto con amigos o conversando"
    - Etc. (12 prompts únicos)
  - Preview de fotos antes de subir
  - Eliminación de fotos individuales
  - Integración con Cloudinary para almacenamiento
- **Mutations GraphQL**:
  - `UPLOAD_PHOTO_MUTATION`
  - `DELETE_PHOTO_MUTATION`
- **Estado**: Completamente funcional

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

### Pendiente
- Validación de tamaño de archivos (5%)
- Compresión automática de imágenes (5%)

### Archivos Relacionados
- `src/components/UploadPhotos.vue`
- `src/components/CompleteProfile.vue`
- `src/graphql/mutations.ts:232-248` (UPLOAD_PHOTO_MUTATION)
- `src/graphql/mutations.ts:244-248` (DELETE_PHOTO_MUTATION)
- `src/graphql/mutations.ts:130-197` (UPDATE_PROFILE_MUTATION)

---

## 3️⃣ Épica: Sistema de Descubrimiento

**Implementación: 85%** ✅

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

#### ✅ Feed Extendido con Información Adicional
- **Componente**: `Feed.vue`
- **Ruta**: `/feed`
- **Funcionalidad**: Versión alternativa de Swipe que incluye información adicional del perfil:
  - Todos los campos de Swipe.vue
  - Información de `userInfo`:
    - Mascotas
    - Estilo de comunicación
    - Idiomas
    - Intereses
  - Misma funcionalidad de like/skip
- **Query GraphQL**: `FEED_QUERY`
- **Estado**: Completamente funcional

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

**Implementación: 90%** ✅

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

**Implementación: 85%** ✅

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

**Implementación: 80%** ⚠️

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

#### ✅ Visualización de Carta Natal
- **Composable**: `useAstroChart.ts`
- **Librería**: `@astrodraw/astrochart` v3.0.2
- **Funcionalidad**:
  - Dibuja carta natal circular
  - Muestra posiciones de planetas
  - Muestra casas astrológicas
  - Configuración de colores personalizable
  - Evita solapamiento de planetas con offset
- **Estado**: Completamente funcional

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

**Implementación: 95%** ✅

### Descripción
Sistema completo para subir, almacenar, organizar y eliminar fotos de perfil con asociación a signos zodiacales.

### Features Implementadas

#### ✅ Subida de Fotos
- **Mutation GraphQL**: `UPLOAD_PHOTO_MUTATION`
- **Funcionalidad**:
  - Upload a Cloudinary
  - Asociación de foto con signo zodiacal
  - Validación de formato de imagen
  - Preview antes de subir
  - Feedback de progreso
- **Estado**: Completamente funcional

#### ✅ Eliminación de Fotos
- **Mutation GraphQL**: `DELETE_PHOTO_MUTATION`
- **Funcionalidad**:
  - Elimina foto por URL
  - Actualiza UI automáticamente
  - Confirmación antes de eliminar
- **Estado**: Completamente funcional

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

### Pendiente
- Edición/recorte de imágenes (3%)
- Reordenamiento de fotos (2%)

### Archivos Relacionados
- `src/components/UploadPhotos.vue`
- `src/graphql/mutations.ts:232-248` (UPLOAD_PHOTO_MUTATION y DELETE_PHOTO_MUTATION)

---

## 📈 Roadmap de Prioridades

### Alta Prioridad (Crítico para MVP)
1. **Implementar sistema de Chat** (Épica 5)
   - WebSockets o GraphQL Subscriptions
   - Mensajería básica en tiempo real
   - UI de conversaciones

### Media Prioridad (Mejora la experiencia)
2. **Algoritmo de Compatibilidad Astrológica** (Épica 7)
   - Cálculo de compatibilidad
   - Ordenamiento inteligente del feed

3. **Filtros de Búsqueda** (Épica 3)
   - Filtrar por edad, distancia, preferencias

4. **Notificaciones** (Épicas 4 y 5)
   - Nuevos matches
   - Nuevos mensajes

### Baja Prioridad (Nice to have)
5. **Recuperación de contraseña** (Épica 1)
6. **Configuración de privacidad** (Épica 6)
7. **Edición de imágenes** (Épica 8)

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

- **Estado General**: El proyecto está en un **78% de implementación**, con la mayoría de las funcionalidades core completas.
- **Bloqueador Principal**: La **épica de Chat** (5) es el componente crítico faltante para el MVP.
- **Fortaleza**: Excelente integración astrológica y sistema de perfiles completo.
- **Oportunidad**: Implementar el algoritmo de compatibilidad astrológica diferenciará significativamente el producto de la competencia.

---

**Última actualización**: 2025-11-22
**Versión del proyecto**: 0.1.0
**Rama**: `claude/identify-project-objectives-01CQz6uhrJ9jMMSgBdPUsBJK`

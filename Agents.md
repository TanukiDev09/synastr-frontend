# Agents.md - Roles y Agentes del Sistema

Este documento describe los diferentes agentes (usuarios, sistemas, servicios) que interactúan con Synastr Frontend, sus roles, responsabilidades y flujos de interacción.

---

## 👥 Agentes Principales

### 1. Usuario No Autenticado (Visitante)

**Descripción**: Persona que visita la aplicación por primera vez o no ha iniciado sesión.

**Acceso**:
- ✅ Landing page (`/landing`)
- ✅ Onboarding / Registro (`/onboarding`)
- ✅ Login (`/login`)
- ❌ Todas las demás rutas (requieren autenticación)

**Capacidades**:
- Ver información de marketing en Landing
- Crear una nueva cuenta con datos astrológicos
- Iniciar sesión con credenciales existentes

**Flujo Principal**:
```
Landing → [Registro] → Onboarding → (se convierte en Usuario Registrado)
Landing → [Login] → (se convierte en Usuario Autenticado)
```

**Datos Requeridos para Registro**:
- Email (único)
- Contraseña
- Fecha de nacimiento
- Hora de nacimiento
- Lugar de nacimiento (texto libre)
- Género
- Qué busca (tipo de relación)

**Resultado del Registro**:
- Usuario creado en backend
- Carta natal calculada automáticamente
- JWT token generado
- Almacenado en `localStorage` como `synastr_token`

---

### 2. Usuario Registrado (Perfil Incompleto)

**Descripción**: Usuario que completó el registro pero aún no ha terminado de configurar su perfil (fotos y datos adicionales).

**Acceso**:
- ✅ Upload Photos (`/upload-photos`)
- ✅ Complete Profile (`/complete-profile`)
- ✅ Logout
- ⚠️ Puede acceder a otras rutas, pero idealmente debería completar perfil primero

**Capacidades**:
- Subir fotos (1 de perfil + 12 opcionales por signo zodiacal)
- Completar información adicional (altura, educación, estilo de vida, etc.)
- Cerrar sesión

**Flujo Principal**:
```
Onboarding → UploadPhotos → CompleteProfile → (se convierte en Usuario Activo)
```

**Datos Opcionales a Completar**:

**Físico**:
- Altura (cm)
- Peso (kg)

**Educación**:
- Escuela/Universidad
- Nivel educativo

**Estilo de Vida**:
- Hijos (quiere/tiene/no quiere)
- Mascotas
- Alcohol (frecuencia)
- Tabaco (frecuencia)
- Fitness (frecuencia)
- Dieta (tipo)
- Patrones de sueño

**Social y Creencias**:
- Estilo de comunicación
- Política
- Espiritualidad
- Idiomas (array)
- Intereses (array)

**Estado del Sistema**:
- Token JWT válido en `localStorage`
- Usuario tiene `natalChart` calculado
- Usuario puede NO tener fotos aún (⚠️ bloqueador funcional por mock)
- Usuario puede NO tener `userInfo` completo

---

### 3. Usuario Activo

**Descripción**: Usuario con perfil completo que puede usar todas las funcionalidades de la app.

**Acceso**:
- ✅ Swipe/Descubrimiento (`/swipe`, `/feed`)
- ✅ Matches (`/matches`)
- ✅ Likers (`/likers`)
- ✅ Perfil (`/profile`)
- ✅ Configuración (`/settings`)
- ⚠️ Chat (`/chat/:id`) - pendiente de implementar
- ✅ Logout

**Capacidades**:

#### Descubrimiento
- Ver feed de usuarios compatibles
- Ver fotos, información básica y datos astrológicos de otros usuarios
- Dar like a perfiles
- Skip (pasar) perfiles sin dar like
- ⚠️ Filtrar feed por preferencias (no implementado)

#### Matching
- Ver lista de matches mutuos (usuarios que se gustaron mutuamente)
- Ver lista de usuarios que le dieron like
- Ver información detallada de matches

#### Comunicación
- ⚠️ Chatear con matches (NO implementado - solo placeholder)

#### Gestión de Perfil
- Ver su propio perfil completo
- Ver sus fotos organizadas por signo zodiacal
- Ver su carta natal (solo datos, no gráfico visual)
- Editar preferencias (género, qué busca, mascotas, idiomas, intereses)
- ⚠️ Editar fotos (implementación limitada)

**Flujo de Uso Típico**:
```
Login → Swipe (dar likes) → Ver Matches → [Chat con match] → Repeat
        ↓
        Ver Likers → Dar like de vuelta → Match creado → [Chat]
        ↓
        Settings → Actualizar preferencias
        ↓
        Profile → Ver mi carta natal
```

**Permisos**:
- ✅ Ver perfiles de usuarios del género que busca
- ✅ Dar like ilimitado (no hay límite implementado)
- ✅ Ver solo matches donde hay like mutuo
- ❌ NO puede ver perfil completo de usuarios sin match (solo en feed)
- ❌ NO puede chatear sin match

**Estado del Sistema**:
- Token JWT válido
- Usuario tiene al menos 1 foto de perfil
- Usuario tiene `userInfo` (aunque sea parcial)
- Usuario tiene `natalChart` calculado

---

### 4. Backend GraphQL API

**Descripción**: Servidor GraphQL que maneja la lógica de negocio, almacenamiento de datos y cálculos astrológicos.

**Endpoint**: `http://localhost:8000/graphql` (desarrollo)

**Responsabilidades**:

#### Autenticación
- Validar credenciales de login
- Generar JWT tokens
- Verificar tokens en cada request
- Gestionar sesiones

#### Gestión de Usuarios
- Crear nuevos usuarios
- Almacenar datos de perfil
- Actualizar información (`updateProfile` mutation)
- Gestionar fotos (URLs de Cloudinary)

#### Cálculos Astrológicos
- Calcular carta natal a partir de fecha/hora/lugar
- Calcular posiciones planetarias
- Calcular casas astrológicas
- Almacenar signos y grados
- ⚠️ Calcular compatibilidad astrológica (no implementado)

#### Sistema de Matching
- Gestionar likes (`likeUser` mutation)
- Detectar matches mutuos
- Generar feed de usuarios compatibles
- Filtrar usuarios ya vistos
- ⚠️ Ordenar feed por compatibilidad (no implementado)

#### Mensajería
- ⚠️ Gestionar mensajes de chat (no implementado)
- ⚠️ WebSockets/Subscriptions (no implementado)

**Comunicación con Frontend**:
```
Frontend → HTTP POST /graphql → Backend
          ↓
          Query o Mutation GraphQL
          ↓
          Validación de Token JWT
          ↓
          Ejecución de lógica
          ↓
          Respuesta JSON
```

**Tipos de Operaciones**:

**Queries**:
- `getCurrentUser` - Obtener usuario autenticado
- `feed` - Obtener lista de perfiles para swipe
- `matches` - Obtener matches del usuario
- `likers` - Obtener usuarios que te dieron like

**Mutations**:
- `signUp` - Registrar nuevo usuario
- `login` - Autenticar usuario
- `updateProfile` - Actualizar información del usuario
- `likeUser` - Dar like a un usuario
- `unlikeUser` - Retirar like
- `uploadPhoto` - Subir foto (retorna URL)
- `deletePhoto` - Eliminar foto por URL

---

### 5. Cloudinary (Servicio de Fotos)

**Descripción**: Servicio externo para almacenamiento y procesamiento de imágenes.

**Estado**: ⚠️ **NO IMPLEMENTADO** - Actualmente es un mock

**Responsabilidades Esperadas**:
- Recibir upload de imágenes desde frontend
- Almacenar imágenes
- Generar URLs públicas
- Optimizar/comprimir imágenes
- Transformaciones de imagen (resize, crop)

**Flujo Esperado**:
```
Frontend → Upload File → Cloudinary API
          ↓
          Imagen almacenada
          ↓
          URL pública generada
          ↓
Frontend → Envía URL → Backend GraphQL
          ↓
          Backend almacena URL en DB
```

**Integración Actual** (Mock):
```typescript
// ❌ ACTUAL: Mock que NO funciona
async function uploadToCloudinary(file: File): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://placehold.co/600x400/png?text=Uploaded+${file.name}`;
}

// ✅ DEBERÍA SER: Integración real
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  const data = await response.json();
  return data.secure_url; // URL real de Cloudinary
}
```

---

### 6. Librería @astrodraw/astrochart

**Descripción**: Librería JavaScript para visualización de cartas natales astrológicas.

**Versión**: 3.0.2

**Responsabilidades**:
- Renderizar gráfico circular de carta natal
- Dibujar posiciones de planetas
- Dibujar casas astrológicas
- Calcular posicionamiento visual

**Uso** (a través de composable):
```typescript
import { useAstroChart } from '../composables/useAstroChart';

const { chartContainer, drawChart } = useAstroChart('container-id');

drawChart(natalChart); // Dibuja en el DOM
```

**Estado**: ⚠️ Implementado pero NO integrado en componentes

**Datos que Consume**:
```typescript
interface NatalChart {
  positions: [
    { name: 'Sun', sign: 'Aries', degrees: 15.5, house: 1 },
    // ... otros planetas
  ],
  houses: [
    { name: 'House 1', sign: 'Aries', degrees: 0, house: 1 },
    // ... otras casas
  ]
}
```

**Output**: Gráfico SVG renderizado en elemento del DOM.

---

## 🔄 Flujos de Interacción Completos

### Flujo 1: Registro y Onboarding

```mermaid
Usuario Visitante → Landing Page
       ↓
       Click "Registrarse"
       ↓
Onboarding Form
       ↓
[Frontend] Valida formulario
       ↓
[Frontend] Envía SIGN_UP_MUTATION
       ↓
[Backend] Valida datos
       ↓
[Backend] Crea usuario en DB
       ↓
[Backend] Calcula carta natal (fecha/hora/lugar)
       ↓
[Backend] Genera JWT token
       ↓
[Backend] Retorna { token, user { natalChart } }
       ↓
[Frontend] Almacena token en localStorage
       ↓
[Frontend] Configura header Authorization
       ↓
[Frontend] Navega a /upload-photos
       ↓
Usuario sube fotos (⚠️ mock)
       ↓
[Frontend] Navega a /complete-profile
       ↓
Usuario completa información adicional
       ↓
[Frontend] Envía UPDATE_PROFILE_MUTATION
       ↓
[Backend] Actualiza userInfo
       ↓
[Frontend] Navega a /swipe
       ↓
Usuario Activo ✅
```

### Flujo 2: Login

```mermaid
Usuario Visitante → Landing Page
       ↓
       Click "Iniciar Sesión"
       ↓
Login Form
       ↓
[Frontend] Envía LOGIN_MUTATION
       ↓
[Backend] Valida email/password
       ↓
[Backend] Genera JWT token
       ↓
[Backend] Retorna { token, user }
       ↓
[Frontend] Almacena token en localStorage
       ↓
[Frontend] Configura header Authorization
       ↓
[Frontend] Navega a /swipe
       ↓
Usuario Autenticado ✅
```

### Flujo 3: Descubrimiento y Matching

```mermaid
Usuario Activo → Swipe Page
       ↓
[Frontend] Envía FEED_QUERY
       ↓
[Backend] Filtra usuarios:
         - Género que el usuario busca
         - No ha dado like aún
         - No es el mismo usuario
         ⚠️ TODO: Ordenar por compatibilidad
       ↓
[Backend] Retorna lista de usuarios
       ↓
[Frontend] Muestra primer perfil
       ↓
Usuario decide: [Like] o [Skip]
       ↓
       ├─→ [Skip]
       │   └→ Mostrar siguiente perfil
       │
       └─→ [Like]
           ↓
           [Frontend] Envía LIKE_USER_MUTATION
           ↓
           [Backend] Crea relación de like
           ↓
           [Backend] Verifica si hay match mutuo
           ↓
           ├─→ [No hay match]
           │   └→ Solo se guarda el like
           │
           └─→ [HAY MATCH! 🎉]
               ↓
               [Backend] Crea match mutuo
               ↓
               [Frontend] Mostrar notificación (⚠️ no implementado)
               ↓
               Usuario puede ir a /matches y chatear (⚠️ chat no implementado)
```

### Flujo 4: Ver y Gestionar Matches

```mermaid
Usuario Activo → Navegación
       ↓
       ├─→ Ver Matches (/matches)
       │   ↓
       │   [Frontend] Envía GET_MATCHES_QUERY
       │   ↓
       │   [Backend] Retorna usuarios con like mutuo
       │   ↓
       │   [Frontend] Muestra grid de matches
       │   ↓
       │   Usuario click en match
       │   ↓
       │   [Frontend] Navega a /chat/:matchId
       │   ↓
       │   ⚠️ Chat placeholder (no funcional)
       │
       └─→ Ver Likers (/likers)
           ↓
           [Frontend] Envía GET_LIKERS_QUERY
           ↓
           [Backend] Retorna usuarios que dieron like al usuario
           ↓
           [Frontend] Muestra grid de likers
           ↓
           Usuario puede navegar a feed para dar like de vuelta
```

### Flujo 5: Actualizar Perfil

```mermaid
Usuario Activo → Settings Page
       ↓
[Frontend] Carga datos actuales con useAuth()
       ↓
Usuario modifica campos (género, mascotas, idiomas, etc.)
       ↓
Usuario click "Save Changes"
       ↓
[Frontend] Envía UPDATE_PROFILE_MUTATION
       ↓
[Backend] Valida y actualiza userInfo
       ↓
[Backend] Retorna usuario actualizado
       ↓
[Frontend] Actualiza estado global (fetchCurrentUser)
       ↓
[Frontend] Muestra mensaje de éxito
```

---

## 🔐 Autorización y Permisos

### Matriz de Permisos por Agente

| Acción | Visitante | Registrado | Activo | Backend | Cloudinary |
|--------|-----------|------------|--------|---------|------------|
| Ver Landing | ✅ | ✅ | ✅ | - | - |
| Registrarse | ✅ | ❌ | ❌ | - | - |
| Login | ✅ | ✅ | ✅ | - | - |
| Subir fotos | ❌ | ✅ | ✅ | Almacena URL | Almacena imagen |
| Completar perfil | ❌ | ✅ | ✅ | Actualiza DB | - |
| Ver feed | ❌ | ⚠️ Puede | ✅ | Genera feed | - |
| Dar like | ❌ | ⚠️ Puede | ✅ | Crea relación | - |
| Ver matches | ❌ | ⚠️ Puede | ✅ | Filtra matches | - |
| Chatear | ❌ | ❌ | ⚠️ No impl. | ⚠️ No impl. | - |
| Editar perfil | ❌ | ✅ | ✅ | Actualiza DB | - |
| Ver carta natal | ❌ | ✅ | ✅ | Calcula | - |

**Notas**:
- ⚠️ "Puede" significa que técnicamente puede acceder, pero idealmente no debería (falta route guard)
- ⚠️ "No impl." significa funcionalidad no implementada

### Validación de Token JWT

**Cada request autenticado incluye**:
```http
POST /graphql HTTP/1.1
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "query": "query { getCurrentUser { ... } }"
}
```

**Backend valida**:
1. Token presente en header
2. Token no expirado
3. Token firma válida
4. Usuario existe en DB

**Si validación falla**:
- Backend retorna error 401 Unauthorized
- Frontend ejecuta `logout()` automáticamente
- Usuario redirigido a `/login`

---

## 📊 Datos que Maneja Cada Agente

### Usuario (Cliente)

**Almacena en localStorage**:
```javascript
{
  "synastr_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": "uuid-del-usuario" // Solo usado en algunos componentes
}
```

**Almacena en memoria (Estado Reactivo)**:
```typescript
// Composable useAuth()
{
  user: {
    id: string,
    email: string,
    birthDate: string,
    birthTime: string,
    birthPlace: string,
    gender?: string,
    lookingFor?: string,
    photos: [{ url: string, sign: string }],
    natalChart?: { positions: [...], houses: [...] },
    userInfo?: { altura, peso, escuela, ... }
  },
  loading: boolean,
  error: string | null
}
```

### Backend (Servidor)

**Almacena en Base de Datos**:
```
Users Table:
- id (UUID)
- email (unique)
- password_hash
- birth_date
- birth_time
- birth_place
- latitude
- longitude
- timezone
- gender
- looking_for
- sexual_orientation (array)
- created_at
- updated_at

NatalCharts Table:
- id
- user_id (FK)
- positions (JSON)
- houses (JSON)

UserInfo Table:
- id
- user_id (FK)
- height, weight, school, education, ...
- (todos los campos opcionales)

Photos Table:
- id
- user_id (FK)
- url (Cloudinary URL)
- sign (zodiac sign)
- created_at

Likes Table:
- id
- user_id (FK) - quien da like
- target_user_id (FK) - quien recibe like
- created_at

Matches Table (o vista):
- user1_id (FK)
- user2_id (FK)
- created_at
```

### Cloudinary (Servicio)

**Almacena**:
- Archivos de imagen (JPG, PNG, etc.)
- Metadatos de imagen (tamaño, dimensiones, formato)
- Transformaciones aplicadas

**Retorna**:
```javascript
{
  "secure_url": "https://res.cloudinary.com/demo/image/upload/v123/photo.jpg",
  "public_id": "photo_id",
  "format": "jpg",
  "width": 1920,
  "height": 1080,
  "bytes": 524288
}
```

---

## 🚀 Escalabilidad y Agentes Futuros

### Agentes Planificados (No Implementados)

#### 1. Sistema de Notificaciones
**Responsabilidad**: Enviar notificaciones push/email a usuarios

**Eventos a Notificar**:
- Nuevo match
- Nuevo mensaje en chat
- Alguien te dio like
- Recordatorio de perfil incompleto

**Tecnologías Sugeridas**:
- Firebase Cloud Messaging (push notifications)
- SendGrid/Mailgun (email)
- WebSockets (notificaciones en tiempo real)

#### 2. Sistema de Recomendaciones (IA)
**Responsabilidad**: Mejorar matching con ML

**Tareas**:
- Analizar historial de likes del usuario
- Calcular compatibilidad más allá de astrología
- Ordenar feed por probabilidad de match

**Datos a Usar**:
- Patrones de likes históricos
- Características de matches exitosos
- Intereses comunes
- Compatibilidad astrológica calculada

#### 3. Moderación de Contenido
**Responsabilidad**: Validar fotos y mensajes

**Tareas**:
- Detectar contenido inapropiado en fotos
- Filtrar mensajes spam
- Reportes de usuarios
- Bloqueo de usuarios problemáticos

**Tecnologías Sugeridas**:
- Cloudinary AI moderation
- OpenAI Moderation API

#### 4. Analytics y Métricas
**Responsabilidad**: Tracking de uso de la app

**Métricas a Rastrear**:
- DAU/MAU (usuarios activos)
- Tasa de conversión (registro → perfil completo)
- Tasa de matching
- Engagement en chat
- Retención de usuarios

**Tecnologías Sugeridas**:
- Google Analytics
- Mixpanel
- Custom backend analytics

---

## 🔄 Ciclo de Vida del Usuario

```
1. VISITANTE
   ↓ (Registro)
2. REGISTRADO (token + carta natal, sin perfil completo)
   ↓ (Sube fotos + completa info)
3. ACTIVO (puede hacer swipe y matching)
   ↓ (Uso regular)
4. USUARIO CON MATCHES (tiene matches mutuos)
   ↓ (Chatea, interactúa)
5. USUARIO COMPROMETIDO (encontró pareja)
   ↓ (Opcionalmente)
6. USUARIO INACTIVO / ELIMINADO
```

**Métricas de Éxito**:
- Tiempo promedio desde VISITANTE → ACTIVO
- Porcentaje de usuarios ACTIVOS
- Tasa de matching
- Tasa de conversación (match → mensaje)
- Retención a 7/30 días

---

## 🛠️ Herramientas de Desarrollo para Agentes

### Testing de Roles

**Crear usuario de prueba**:
```graphql
mutation {
  signUp(signupInput: {
    email: "test@synastr.com"
    password: "Test123456"
    birthDate: "1995-06-15"
    birthTime: "14:30"
    birthPlace: "Bogotá, Colombia"
    gender: "Female"
    lookingFor: "Male"
  }) {
    token
    user { id email }
  }
}
```

**Simular diferentes estados**:
```javascript
// Usuario registrado (sin perfil completo)
localStorage.setItem('synastr_token', 'token-here');
// No navegar a /upload-photos ni /complete-profile

// Usuario activo
localStorage.setItem('synastr_token', 'token-here');
// Completar upload y profile

// Usuario sin autenticar
localStorage.removeItem('synastr_token');
```

---

**Última actualización**: 2025-11-22
**Mantenido por**: TanukiDev09
**Proyecto**: Synastr Frontend v0.1.0

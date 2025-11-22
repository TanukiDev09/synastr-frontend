# Synastr Frontend

> **Astrology-Powered Dating Application** | Vue 3 + TypeScript + GraphQL

**Synastr** es una aplicación web de dating que combina el matching tradicional tipo Tinder con compatibilidad astrológica basada en cartas natales. Conecta personas usando posiciones planetarias, signos zodiacales y preferencias personales.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
# → http://localhost:5173
```

---

## 📊 Project Status

| Metric | Value |
|--------|-------|
| **Implementation** | 52% functional |
| **Version** | 0.1.0 (MVP) |
| **Components** | 13 Vue components |
| **Tech Stack** | Vue 3, TypeScript 5.2, Vite 4.5 |
| **Backend** | GraphQL (http://localhost:8000/graphql) |

### Critical Blockers
- ❌ Photo upload is MOCK (not real Cloudinary)
- ❌ Chat not implemented (placeholder only)
- ⚠️ Feed.vue has schema inconsistencies

---

## 📚 Documentation Hub

### For AI Assistants
| Document | Purpose | Best For |
|----------|---------|----------|
| **[PROJECT.md](./PROJECT.md)** | 🤖 **AI-optimized quick reference** | Token-efficient lookups, fast context |
| [Claude.md](./Claude.md) | AI development guide | Understanding rules, patterns, blockers |

### For Humans
| Document | Purpose | Best For |
|----------|---------|----------|
| [EPICS.md](./EPICS.md) | Feature implementation status | Product managers, stakeholders |
| [Architecture.md](./Architecture.md) | Technical architecture | Senior developers, architects |
| [Agents.md](./Agents.md) | System roles and flows | Business analysts, UX designers |

### Navigation Guide
- 🔍 **Need quick info?** → Start with [PROJECT.md](./PROJECT.md) §TABLE_OF_CONTENTS
- 🐛 **Debugging?** → [PROJECT.md](./PROJECT.md) §4 (Critical Issues)
- 📝 **Adding features?** → [Claude.md](./Claude.md) + [PROJECT.md](./PROJECT.md) §8 (Quick Tasks)
- 🏗️ **Understanding architecture?** → [Architecture.md](./Architecture.md)
- 👥 **Understanding user flows?** → [Agents.md](./Agents.md)

---

## 🛠️ Tech Stack

### Frontend
```
Vue 3 (Composition API)  - UI framework
TypeScript 5.2           - Type safety
Vite 4.5                 - Build tool + HMR
Vue Router 4             - SPA routing
SASS                     - CSS preprocessing
```

### Communication
```
graphql-request 6.x      - GraphQL client (not Apollo)
JWT Authentication       - Token in localStorage
```

### Specialized Libraries
```
@astrodraw/astrochart    - Natal chart visualization
```

### Backend (External Service)
```
GraphQL API              - http://localhost:8000/graphql
PostgreSQL               - Database (managed by backend)
```

### Services (Pending)
```
Cloudinary               - Image storage (⚠️ currently MOCK)
```

---

## 📁 Project Structure

```
synastr-frontend/
├── src/
│   ├── main.ts                   # Entry point
│   ├── App.vue                   # Root component
│   ├── router.ts                 # Route definitions
│   │
│   ├── components/               # 13 UI components
│   │   ├── Landing.vue          # Marketing page
│   │   ├── Onboarding.vue       # Registration + natal data
│   │   ├── Login.vue            # Authentication
│   │   ├── UploadPhotos.vue     # Photo upload (⚠️ MOCK)
│   │   ├── CompleteProfile.vue  # Extended profile form
│   │   ├── Swipe.vue            # Main discovery UI
│   │   ├── Feed.vue             # Alternative discovery
│   │   ├── Matches.vue          # Mutual likes
│   │   ├── Likers.vue           # Incoming likes
│   │   ├── Chat.vue             # Messaging (⚠️ placeholder)
│   │   ├── Profile.vue          # Own profile view
│   │   └── Settings.vue         # Preferences editor
│   │
│   ├── composables/
│   │   ├── useAuth.ts           # Global user state
│   │   └── useAstroChart.ts     # Chart visualization
│   │
│   ├── graphql/
│   │   ├── client.ts            # GraphQL client config
│   │   ├── auth.ts              # JWT token management
│   │   ├── queries.ts           # GraphQL queries
│   │   ├── mutations.ts         # GraphQL mutations
│   │   └── operations.ts        # Helper functions
│   │
│   ├── types/                   # TypeScript definitions
│   └── styles/
│       └── base.scss            # Global styles
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile                   # Production container
├── .env.example                 # Environment template
│
└── Documentation/
    ├── PROJECT.md               # 🤖 AI-optimized reference
    ├── EPICS.md                 # Feature status
    ├── Architecture.md          # Technical design
    ├── Agents.md                # System roles
    └── Claude.md                # AI dev guide
```

---

## 🔧 Development

### Prerequisites
- **Node.js** >= 18
- **npm** or **pnpm**

### Setup
```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your GraphQL endpoint

# 3. Start dev server
npm run dev
```

### Available Commands
```bash
npm run dev          # Dev server with HMR (port 5173)
npm run build        # Production build → dist/
npm run preview      # Preview production build
npm run type-check   # TypeScript validation
```

### Environment Variables
```bash
# .env
VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
```

---

## 🐳 Docker

### Build and Run
```bash
# Build image
docker build -t synastr-frontend .

# Run container
docker run -p 80:80 synastr-frontend
# → http://localhost
```

### Docker Details
- **Base Image**: `node:18` (builder) + `nginx:alpine` (runtime)
- **Build**: Multi-stage (optimized size)
- **Server**: Nginx serving static files
- **Port**: 80 (exposed)

---

## 🎯 Key Features

### ✅ Implemented (Working)
- User registration with astrological data (birth date/time/place)
- JWT authentication (login/logout)
- Natal chart calculation (backend)
- Swipe interface (like/skip users)
- View mutual matches
- View incoming likes (likers)
- Profile management
- Settings editor (preferences)

### ⚠️ Partially Implemented
- Photo upload (UI works, but upload is MOCK)
- Feed discovery (schema mismatch with backend)
- Natal chart visualization (code exists, not integrated)

### ❌ Not Implemented
- Real Cloudinary photo upload
- Chat/messaging system
- WebSockets/Subscriptions
- Compatibility algorithm
- Filters (age, distance, preferences)
- Route guards (authentication)
- Notifications

---

## 🚨 Known Issues

### Critical Blockers

**1. Photo Upload is FAKE**
```
File: src/components/UploadPhotos.vue:64-68
Issue: Returns placeholder URL instead of uploading to Cloudinary
Impact: Users cannot upload real photos
Fix: See PROJECT.md §8.TASK_CLOUDINARY
```

**2. Chat Not Implemented**
```
File: src/components/Chat.vue
Issue: Only placeholder text, no messaging functionality
Impact: Matches cannot communicate
Fix: Implement WebSockets or GraphQL Subscriptions
```

**3. Feed Schema Mismatch**
```
File: src/components/Feed.vue
Issue: Uses snake_case instead of camelCase
Impact: May not work with production backend
Fix: See PROJECT.md §8.TASK_FIX_FEED_SCHEMA
```

See [PROJECT.md](./PROJECT.md) §4 for complete issue details and fixes.

---

## 📖 User Flows

### New User Registration
```
Landing → Onboarding (register + natal data)
       → UploadPhotos (profile + zodiac photos)
       → CompleteProfile (extended info)
       → Swipe (start matching)
```

### Returning User
```
Landing → Login → Swipe (continue matching)
```

### Active User Navigation
```
Swipe ↔ Matches ↔ Likers ↔ Profile ↔ Settings
  ↓
Chat (with individual matches)
```

---

## 🔐 Authentication

### How It Works
1. User logs in → Backend generates JWT token
2. Frontend stores token in `localStorage` (key: `synastr_token`)
3. `auth.ts` configures GraphQL client with `Authorization: Bearer <token>` header
4. All GraphQL requests include token automatically
5. Backend validates token on each request

### Token Management
```typescript
import { setAuthToken } from './graphql/auth';

// After login
setAuthToken(token); // Stores and configures header

// Logout
setAuthToken(null); // Clears token and header
```

### Session Persistence
- Token persists in `localStorage`
- `initAuth()` called on app startup (in `main.ts`)
- User stays logged in after page reload

---

## 🧪 Testing

⚠️ **Not yet implemented**

Planned:
- Unit tests with Vitest
- Component tests with Testing Library
- E2E tests with Playwright/Cypress

---

## 🚀 Deployment

### Vercel (Configured)

**Deploy Strategy**: Only `main` branch deploys to production

```bash
# Configuration files
vercel.json          # Main Vercel config
vercel-ignore.sh     # Build decision script
.vercelignore        # Excluded files

# Behavior
✅ Merges to main    → Auto-deploy to production
❌ Feature branches  → Ignored (no deploy)
❌ PR branches       → Ignored (no deploy)
```

**Why**: Reduces unnecessary deploys and build minutes on Vercel.

See [PROJECT.md §11.5](./PROJECT.md) for configuration details.

### Production Build (Local)
```bash
npm run build
# Output: dist/
```

### Docker Deployment
```bash
docker build -t synastr-frontend .
docker run -p 80:80 synastr-frontend
```

### Deployment Checklist
- [x] Configure Vercel to deploy only from `main`
- [ ] Update `VITE_GRAPHQL_ENDPOINT` in `.env`
- [ ] Implement real Cloudinary upload
- [ ] Add route guards for authentication
- [ ] Enable HTTPS
- [ ] Configure CORS on backend
- [ ] Set up monitoring (Sentry/LogRocket)

---

## 🤝 Contributing

### Before Making Changes
1. Read [PROJECT.md](./PROJECT.md) for quick context
2. Check [EPICS.md](./EPICS.md) for feature status
3. Review [Claude.md](./Claude.md) for development rules
4. Follow naming conventions (see PROJECT.md §12)

### Development Workflow
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes following patterns in PROJECT.md §7

# 3. Test changes
npm run dev

# 4. Type check
npm run type-check

# 5. Commit with clear message
git commit -m "feat: add user profile editing"

# 6. Push and create PR
git push origin feature/my-feature
```

---

## 📞 Support & Resources

### Documentation
- **Quick Reference**: [PROJECT.md](./PROJECT.md) (AI-optimized)
- **Development Guide**: [Claude.md](./Claude.md)
- **Architecture**: [Architecture.md](./Architecture.md)
- **User Flows**: [Agents.md](./Agents.md)
- **Features**: [EPICS.md](./EPICS.md)

### External Links
- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [GraphQL Request](https://github.com/jasonkuhrt/graphql-request)
- [@astrodraw/astrochart](https://github.com/Kibo/AstroChart)

### Getting Help
1. Check [PROJECT.md](./PROJECT.md) §13 (Troubleshooting)
2. Search in [Claude.md](./Claude.md) "Problems Known"
3. Review [EPICS.md](./EPICS.md) for implementation status
4. Check GitHub issues (if available)

---

## 📝 License

[Add license information here]

---

## 👥 Team

**Maintainer**: TanukiDev09
**Version**: 0.1.0
**Last Updated**: 2025-11-22

---

**Project Status**: 🟡 MVP Development (52% complete)

**Priority Actions**:
1. Fix Cloudinary upload (CRITICAL)
2. Implement Chat/WebSockets
3. Fix Feed.vue schema
4. Add route guards
5. Integrate natal chart visualization

# PROJECT.md - AI-Optimized Quick Reference

> **Token-Efficient Documentation** | Last Update: 2025-11-22 | Version: 0.1.0 | Implementation: 52%

---

## QUICK START (50 tokens)

**Synastr** = Dating app + Astrology matching | **Tech**: Vue3+TS+GraphQL | **Status**: MVP 52% | **Blockers**: Photo upload=MOCK, Chat=placeholder, Feed=schema-mismatch | **Priority**: Fix Cloudinary integration

---

## TABLE OF CONTENTS (Jump to Section)

```
§1    PROJECT_IDENTITY    - What/Why/Who [100 tokens]
§2    TECH_STACK          - Dependencies/Versions [150 tokens]
§3    FILE_MAP            - Where is X? [200 tokens]
§4    CRITICAL_ISSUES     - Blockers with line numbers [300 tokens]
§5    IMPLEMENTATION      - What works/doesn't [250 tokens]
§6    API_REFERENCE       - GraphQL ops [400 tokens]
§7    PATTERNS            - Code templates [500 tokens]
§8    QUICK_TASKS         - Common operations [300 tokens]
§9    STATE_MANAGEMENT    - Data flow [200 tokens]
§10   ROUTING             - Navigation [150 tokens]
§11   DEVELOPMENT_COMMANDS - npm/docker [100 tokens]
§11.5 VERCEL_DEPLOYMENT  - Deploy config [200 tokens] 🆕
§12   NAMING_CONVENTIONS  - Code style [100 tokens]
§13   TROUBLESHOOTING     - Common issues [200 tokens]
§14   EXTERNAL_REFERENCES - Other docs [50 tokens]
§15   PRIORITY_ACTIONS    - What to fix first [100 tokens]
§16   METADATA            - Project info [50 tokens]
```

---

## §1 PROJECT_IDENTITY

**Product**: Tinder-like dating app using astrology (natal charts) for compatibility matching

**Value Prop**: Match users based on planetary positions + traditional preferences

**Core Features**:
- Swipe interface with astrological data
- Natal chart calculation from birth date/time/place
- Match system (mutual likes)
- Photo management per zodiac sign
- Profile with 50+ data fields

**Users**: Singles seeking astrological compatibility

**Business Model**: TBD (freemium expected)

---

## §2 TECH_STACK

### Frontend
```
vue@3.x              - UI framework (Composition API)
typescript@5.2       - Type safety
vite@4.5             - Build tool + dev server
vue-router@4         - SPA routing
sass@1.x             - CSS preprocessor
graphql-request@6.x  - GraphQL client (NOT Apollo)
@astrodraw/astrochart@3.0.2 - Natal chart visualization
```

### Backend (External)
```
GraphQL API          - http://localhost:8000/graphql
PostgreSQL           - Database (assumed)
JWT                  - Authentication
```

### Services
```
Cloudinary           - Image storage (⚠️ NOT IMPLEMENTED - currently MOCK)
```

### Dev Tools
```
Node.js@18+          - Runtime
npm                  - Package manager
Docker               - Containerization (Nginx)
```

---

## §3 FILE_MAP

### Critical Files (Priority 1)
```
src/graphql/client.ts        - GraphQL client singleton + auth headers
src/graphql/auth.ts          - JWT token management
src/composables/useAuth.ts   - Global user state (SHARED)
src/router.ts                - Route definitions
src/main.ts                  - Entry point (calls initAuth)
```

### Components (13 total)
```
PUBLIC (no auth):
  src/components/Landing.vue      - Marketing page
  src/components/Onboarding.vue   - Registration + natal data
  src/components/Login.vue        - Authentication

AUTHENTICATED:
  src/components/UploadPhotos.vue     - Photo upload (⚠️ MOCK at line 64-68)
  src/components/CompleteProfile.vue  - Extra user info form
  src/components/Swipe.vue            - Main discovery UI
  src/components/Feed.vue             - Alt discovery (⚠️ schema mismatch)
  src/components/Matches.vue          - Mutual likes list
  src/components/Likers.vue           - One-way likes received
  src/components/Chat.vue             - Messaging (⚠️ PLACEHOLDER ONLY)
  src/components/Profile.vue          - View own profile
  src/components/Settings.vue         - Edit preferences
```

### GraphQL Operations
```
src/graphql/queries.ts       - GET_CURRENT_USER, FEED_QUERY, GET_MATCHES, GET_LIKERS
src/graphql/mutations.ts     - SIGN_UP, LOGIN, UPDATE_PROFILE, LIKE_USER, UPLOAD_PHOTO
src/graphql/operations.ts    - Helper: addPhotos()
```

### Composables
```
src/composables/useAuth.ts        - User state (GLOBAL SINGLETON)
src/composables/useAstroChart.ts  - Chart visualization (⚠️ NOT INTEGRATED)
```

### Config
```
vite.config.ts               - Build configuration
tsconfig.json                - TypeScript settings
.env.example                 - Environment variables template
Dockerfile                   - Production container
```

---

## §4 CRITICAL_ISSUES

### BLOCKER #1: Photo Upload is FAKE
```
File: src/components/UploadPhotos.vue
Lines: 64-68
Severity: CRITICAL
Impact: Users cannot upload real photos

CODE:
async function uploadToCloudinary(file: File): Promise<string> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return `https://placehold.co/600x400/png?text=Uploaded+${file.name}`;
}

PROBLEM: Returns placeholder URL, no actual upload to Cloudinary
FIX: Implement real Cloudinary SDK integration (see §8.TASK_CLOUDINARY)
```

### BLOCKER #2: Feed Schema Mismatch
```
File: src/components/Feed.vue
Lines: 13-14, 16, 47
Severity: HIGH
Impact: May not work with production backend

PROBLEM: Uses snake_case (sexual_orientation, user_info) vs project standard camelCase
STANDARD: sexualOrientation, userInfo (see src/graphql/queries.ts)
FIX: Refactor Feed.vue to use FEED_QUERY from queries.ts
```

### BLOCKER #3: Chat Not Implemented
```
File: src/components/Chat.vue
Lines: 1-25 (entire file)
Severity: HIGH (MVP feature)
Impact: Matches cannot communicate

PROBLEM: Only placeholder text, no WebSocket/Subscription
FIX: Implement GraphQL Subscriptions or WebSocket integration
```

### ISSUE #4: Astro Chart Not Used
```
File: src/composables/useAstroChart.ts
Status: Implemented but NOT integrated
Impact: Missing visual differentiation

PROBLEM: No component calls drawChart()
FIX: Integrate in Profile.vue (see §8.TASK_INTEGRATE_CHART)
```

### ISSUE #5: No Route Guards
```
File: src/router.ts
Lines: All routes
Severity: MEDIUM
Impact: Unauthorized access possible

PROBLEM: Missing beforeEach guard for auth validation
FIX: Add router.beforeEach (see §10.ROUTING)
```

---

## §5 IMPLEMENTATION_STATUS

### Per Epic (see EPICS.md for details)
```
Epic 1: Auth/Onboarding       75%  ⚠️  (missing geocoding)
Epic 2: Profile Building      50%  ❌  (photo upload MOCK)
Epic 3: Discovery             70%  ⚠️  (Feed schema issues)
Epic 4: Matches               80%  ⚠️  (depends on feed)
Epic 5: Chat                  10%  ❌  (placeholder only)
Epic 6: Profile/Settings      75%  ⚠️  (no chart visual)
Epic 7: Astrology             55%  ⚠️  (composable not used)
Epic 8: Photo Management      25%  ❌  (Cloudinary FAKE)

OVERALL: 52% functional
```

### What WORKS ✅
```
✅ User registration with email/password
✅ JWT authentication (token in localStorage)
✅ Login/logout
✅ Natal chart calculation (backend)
✅ GraphQL queries/mutations
✅ Swipe UI (like/skip)
✅ View matches (mutual likes)
✅ View likers (one-way)
✅ Update profile info (userInfo fields)
✅ Settings page (edit preferences)
✅ Composable for chart drawing (code exists)
```

### What DOESN'T Work ❌
```
❌ Photo upload (mock only)
❌ Photo delete (untested)
❌ Chat/messaging
❌ Chart visualization (not integrated)
❌ Feed.vue (schema mismatch)
❌ Geocoding (birthPlace → lat/lng)
❌ Compatibility algorithm
❌ Filters (age, distance)
❌ Notifications
❌ Route guards (can access any page)
```

---

## §6 API_REFERENCE

### GraphQL Endpoint
```
URL: http://localhost:8000/graphql
Auth: Bearer token in Authorization header
Method: POST
Content-Type: application/json
```

### Queries
```graphql
# Get authenticated user
getCurrentUser {
  id email birthDate birthTime birthPlace gender lookingFor
  photos { url sign }
  natalChart { positions { name sign degrees house } }
  userInfo { height weight school education ... }
}

# Get swipe feed
feed {
  id email gender photos { url sign }
  natalChart { positions { name sign } }
}

# Get mutual likes
matches { id email photos { url sign } gender lookingFor }

# Get users who liked you
likers { id email photos { url sign } gender lookingFor }
```

### Mutations
```graphql
# Register new user
signUp(signupInput: {
  email: String!
  password: String!
  birthDate: String!
  birthTime: String!
  birthPlace: String!
  gender: String!
  lookingFor: String!
}) { token user { id ... } }

# Authenticate
login(email: String!, password: String!) {
  token user { id email ... }
}

# Update profile
updateProfile(
  height: Int, weight: Int, school: String, education: String,
  children: String, pets: String, drinking: String, smoking: String,
  fitness: String, dietary: String, sleeping: String,
  politics: String, spirituality: String,
  languages: [String!], interests: [String!],
  gender: String, lookingFor: String
) { id userInfo { ... } }

# Like user
likeUser(targetUserId: String!) { id }

# Unlike user
unlikeUser(targetUserId: String!) { id }

# Upload photo (⚠️ not used - see BLOCKER #1)
uploadPhoto(file: Upload!) { url sign }

# Delete photo (⚠️ untested)
deletePhoto(url: String!) # Returns boolean
```

### TypeScript Types
```typescript
interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender?: string;
  lookingFor?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  sexualOrientation?: string[];
  photos: { url: string; sign: string }[];
  natalChart?: {
    positions: { name: string; sign: string; degrees: number; house: number }[];
    houses: { name: string; sign: string; degrees: number; house: number }[];
  };
  userInfo?: {
    height?: number; weight?: number; school?: string; education?: string;
    children?: string; communicationStyle?: string; pets?: string;
    drinking?: string; smoking?: string; fitness?: string; dietary?: string;
    sleeping?: string; politics?: string; spirituality?: string;
    languages?: string[]; interests?: string[];
  };
}
```

---

## §7 PATTERNS

### P1: GraphQL Request
```typescript
import { request } from '../graphql/client';
import { MY_QUERY } from '../graphql/queries';

// With types
const data = await request<{ users: User[] }>(MY_QUERY, { variables });

// Error handling
try {
  const result = await request(MUTATION, vars);
} catch (err: any) {
  const msg = err.response?.errors?.[0]?.message || 'Error';
}
```

### P2: Component with Data Fetch
```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { request } from '../graphql/client';
import { MY_QUERY } from '../graphql/queries';

const data = ref([]);
const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  try {
    const result = await request(MY_QUERY);
    data.value = result.items;
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
  <div v-else v-for="item in data" :key="item.id">{{ item.name }}</div>
</template>
```

### P3: Form Submission
```vue
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '../graphql/client';
import { MY_MUTATION } from '../graphql/mutations';

const router = useRouter();
const form = ref({ field: '' });
const loading = ref(false);
const error = ref<string | null>(null);

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;
  try {
    await request(MY_MUTATION, form.value);
    router.push('/success');
  } catch (err: any) {
    error.value = err.response?.errors?.[0]?.message;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <input v-model="form.field" required />
    <button :disabled="loading">{{ loading ? 'Saving...' : 'Submit' }}</button>
    <p v-if="error">{{ error }}</p>
  </form>
</template>
```

### P4: Use Global Auth State
```typescript
import { useAuth } from '../composables/useAuth';

// In component
const { user, loading, error, login, logout, fetchCurrentUser } = useAuth();

// user.value is SHARED across all components
// After updates, call fetchCurrentUser() to refresh
```

### P5: Navigation
```typescript
import { useRouter } from 'vue-router';

const router = useRouter();
router.push('/path');              // Navigate
router.push(`/chat/${userId}`);    // With params
router.replace('/login');          // Replace history
router.back();                     // Go back
```

---

## §8 QUICK_TASKS

### TASK_ADD_FIELD_TO_PROFILE
```typescript
// 1. Update interface (src/graphql/queries.ts)
export interface UserInfo {
  newField?: string; // ADD HERE
}

// 2. Update GET_CURRENT_USER_QUERY
userInfo {
  newField // ADD HERE
}

// 3. Update UPDATE_PROFILE_MUTATION (src/graphql/mutations.ts)
mutation UpdateProfile($newField: String) {
  updateProfile(newField: $newField) { ... }
}

// 4. Update UI (CompleteProfile.vue or Settings.vue)
<input v-model="form.newField" />

// 5. Include in submit
await request(UPDATE_PROFILE_MUTATION, { newField: form.value.newField });
```

### TASK_ADD_ROUTE
```typescript
// 1. Create component (src/components/NewPage.vue)
<template><div>New Page</div></template>
<script setup lang="ts">/* logic */</script>

// 2. Add route (src/router.ts)
import NewPage from "./components/NewPage.vue";
{ path: "/new", component: NewPage }

// 3. Navigate
router.push('/new');
```

### TASK_CLOUDINARY (Fix BLOCKER #1)
```typescript
// src/components/UploadPhotos.vue

// REPLACE MOCK (lines 64-68) WITH:
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_PRESET);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!response.ok) throw new Error('Upload failed');

  const data = await response.json();
  return data.secure_url; // Real Cloudinary URL
}

// .env file:
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_PRESET=your_upload_preset
```

### TASK_INTEGRATE_CHART (Fix ISSUE #4)
```vue
<!-- src/components/Profile.vue -->
<template>
  <div>
    <h2>My Natal Chart</h2>
    <div ref="chartContainer" style="width:400px;height:400px;"></div>
  </div>
</template>

<script setup lang="ts">
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

### TASK_FIX_FEED_SCHEMA (Fix BLOCKER #2)
```typescript
// src/components/Feed.vue

// REMOVE custom query (lines 56-72)
// REPLACE WITH:
import { FEED_QUERY, type User } from '../graphql/queries';
import { request } from '../graphql/client';

onMounted(async () => {
  loading.value = true;
  try {
    const { feed } = await request<{ feed: User[] }>(FEED_QUERY);
    users.value = feed;
  } catch (err) {
    error.value = 'Failed to load';
  } finally {
    loading.value = false;
  }
});

// Update template to use camelCase:
<p v-if="user.sexualOrientation?.length">  <!-- NOT sexual_orientation -->
<p v-if="user.userInfo?.pets">              <!-- NOT user_info -->
```

---

## §9 STATE_MANAGEMENT

### Global State (Composables)
```
useAuth() state (SHARED SINGLETON):
  - user: ref<User | null>
  - loading: ref<boolean>
  - error: ref<string | null>

Used by: Onboarding, Login, Profile, Settings
Location: src/composables/useAuth.ts
Storage: In-memory (reactive refs outside function)
```

### Local State (Per-Component)
```
Components manage own fetch state:
  - Swipe.vue → profiles: ref<User[]>
  - Matches.vue → matches: ref<User[]>
  - Likers.vue → likers: ref<User[]>
  - Feed.vue → users: ref<User[]>

NOT shared between components (each re-fetches)
```

### Persistence
```
localStorage:
  - synastr_token (JWT)
  - userId (optional, some components)

GraphQL headers:
  - Authorization: Bearer <token> (set by auth.ts)
```

### Data Flow
```
User Action → Handler → GraphQL Request → Backend → Response
  → Update ref → Vue Reactivity → Re-render (automatic)
```

---

## §10 ROUTING

### Routes List
```
PUBLIC:
  / → /landing (redirect)
  /landing → Landing.vue
  /onboarding → Onboarding.vue
  /login → Login.vue

AUTHENTICATED (⚠️ NO GUARDS):
  /upload-photos → UploadPhotos.vue
  /complete-profile → CompleteProfile.vue (lazy loaded)
  /swipe → Swipe.vue
  /feed → Feed.vue
  /matches → Matches.vue
  /likers → Likers.vue
  /chat/:id → Chat.vue (with param)
  /profile → Profile.vue
  /settings → Settings.vue
```

### Missing: Route Guards (ISSUE #5)
```typescript
// ADD TO src/router.ts:

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('synastr_token');
  const publicPages = ['/landing', '/login', '/onboarding'];
  const authRequired = !publicPages.includes(to.path);

  if (authRequired && !token) {
    return next('/login');
  }

  next();
});
```

### User Flows
```
New User:
  Landing → Onboarding → UploadPhotos → CompleteProfile → Swipe

Returning User:
  Landing → Login → Swipe

Active User:
  Swipe ↔ Matches ↔ Likers ↔ Profile ↔ Settings
```

---

## §11 DEVELOPMENT_COMMANDS

```bash
# Install dependencies
npm install

# Development server (http://localhost:5173)
npm run dev

# Type check
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview

# Docker build
docker build -t synastr-frontend .

# Docker run
docker run -p 80:80 synastr-frontend
```

---

## §11.5 VERCEL_DEPLOYMENT

### Configuration
```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true  // ✅ ONLY main branch deploys
    }
  },
  "ignoreCommand": "bash vercel-ignore.sh"
}
```

### Deployment Strategy
```
✅ DEPLOYS:    main branch only (after PR merge)
❌ IGNORES:    All feature branches, PR branches
⏭️  SKIPPED:   Development branches (claude/*, feature/*, etc.)
```

### How It Works
```
1. Push to feature branch → Vercel checks vercel.json
2. vercel-ignore.sh runs → Checks $VERCEL_GIT_COMMIT_REF
3. If branch != "main" → exit 1 (skip build)
4. If branch == "main" → exit 0 (deploy)
```

### Files
```
vercel.json          - Main config (deployment rules)
vercel-ignore.sh     - Build decision script (executable)
.vercelignore        - Files to exclude from upload
```

### Testing Locally
```bash
# Simulate Vercel check
VERCEL_GIT_COMMIT_REF="feature/test" bash vercel-ignore.sh
# → Should exit 1 (skip)

VERCEL_GIT_COMMIT_REF="main" bash vercel-ignore.sh
# → Should exit 0 (deploy)
```

### Override (Emergency Only)
```bash
# To force deploy from non-main branch (use sparingly):
# 1. Temporarily edit vercel-ignore.sh
# 2. Change condition to allow your branch
# 3. Push
# 4. REVERT immediately after
```

---

## §12 NAMING_CONVENTIONS

```
Variables/Properties:  camelCase     (birthDate, userInfo, natalChart)
Components:            PascalCase    (UploadPhotos, CompleteProfile)
Files (components):    PascalCase.vue (Swipe.vue, Login.vue)
Files (other):         camelCase.ts  (useAuth.ts, client.ts)
GraphQL ops:           UPPER_SNAKE   (SIGN_UP_MUTATION, FEED_QUERY)
CSS classes:           kebab-case    (user-card, photo-grid)
```

---

## §13 TROUBLESHOOTING

### Q: Token not working?
```
✓ Check localStorage: localStorage.getItem('synastr_token')
✓ Check header: graphqlClient.requestConfig.headers
✓ Re-login to get fresh token
✓ Call initAuth() on app start (already in main.ts)
```

### Q: GraphQL errors?
```
✓ Check error.response?.errors?.[0]?.message
✓ Verify backend is running (http://localhost:8000/graphql)
✓ Check network tab for request/response
✓ Verify mutation/query syntax matches backend schema
```

### Q: Component not updating?
```
✓ Ensure using ref() or reactive()
✓ Check .value access (ref requires .value in <script>)
✓ Verify data is reactive
✓ Call fetchCurrentUser() after updates (for global user)
```

### Q: Routes not working?
```
✓ Check router.ts has route defined
✓ Verify component import path
✓ Use router.push() not window.location
✓ Check browser console for errors
```

---

## §14 EXTERNAL_REFERENCES

```
Full Details       → EPICS.md (implementation % per epic)
User Flows         → Agents.md (roles, permissions, interactions)
Architecture       → Architecture.md (patterns, decisions, diagrams)
AI Dev Guide       → Claude.md (rules, examples, workarounds)
Code Repository    → /home/user/synastr-frontend/
GraphQL Schema     → Ask backend team (not in this repo)
```

---

## §15 PRIORITY_ACTIONS

```
P0 (CRITICAL):
  1. Implement real Cloudinary upload (§4.BLOCKER_#1, §8.TASK_CLOUDINARY)
  2. Fix Feed.vue schema mismatch (§4.BLOCKER_#2, §8.TASK_FIX_FEED_SCHEMA)

P1 (HIGH):
  3. Implement Chat/WebSockets (§4.BLOCKER_#3)
  4. Add route guards (§4.ISSUE_#5, §10.ROUTING)
  5. Integrate natal chart visual (§4.ISSUE_#4, §8.TASK_INTEGRATE_CHART)

P2 (MEDIUM):
  6. Geocoding for birthPlace
  7. Compatibility algorithm
  8. Filters (age, distance)

P3 (LOW):
  9. Password recovery
  10. Email notifications
```

---

## §16 METADATA

```yaml
project: synastr-frontend
type: web-application
framework: vue3
language: typescript
implementation: 52%
blockers: 3
issues: 2
last_updated: 2025-11-22
branch: claude/identify-project-objectives-01CQz6uhrJ9jMMSgBdPUsBJK
maintainer: TanukiDev09
```

---

**END OF DOCUMENT** | Total Sections: 16 | Optimized for: Token efficiency, Quick lookup, Pattern matching

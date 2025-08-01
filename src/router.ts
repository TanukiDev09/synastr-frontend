// src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Onboarding from './components/Onboarding.vue';
import Login from './components/Login.vue';
import UploadPhotos from './components/UploadPhotos.vue'; // ✅ Importa el nuevo componente
import Swipe from './components/Swipe.vue';
import Likers from './components/Likers.vue';
import Matches from './components/Matches.vue';
import Feed from './components/Feed.vue';
import Chat from './components/Chat.vue';
import Profile from './components/Profile.vue';
import Settings from './components/Settings.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/onboarding' },
  { path: '/onboarding', component: Onboarding },
  { path: '/login', component: Login },
  { path: '/upload-photos', component: UploadPhotos }, // ✅ Añade la nueva ruta
  { path: '/swipe', component: Swipe },
  { path: '/likers', component: Likers },
  { path: '/matches', component: Matches },
  { path: '/feed', component: Feed },
  { path: '/chat/:id', component: Chat, props: true },
  { path: '/profile', component: Profile },
  { path: '/settings', component: Settings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
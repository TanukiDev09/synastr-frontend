import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Onboarding from './components/Onboarding.vue';
import Feed from './components/Feed.vue';
import Chat from './components/Chat.vue';
import Profile from './components/Profile.vue';
import Settings from './components/Settings.vue';

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/onboarding' },
  { path: '/onboarding', component: Onboarding },
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
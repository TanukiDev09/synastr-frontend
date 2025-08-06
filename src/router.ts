// src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 1. IMPORTA el nuevo componente
import Landing from "./components/Landing.vue";
import Onboarding from "./components/Onboarding.vue";
import Login from "./components/Login.vue";
import UploadPhotos from "./components/UploadPhotos.vue";
import Swipe from "./components/Swipe.vue";
import Likers from "./components/Likers.vue";
import Matches from "./components/Matches.vue";
import Feed from "./components/Feed.vue";
import Chat from "./components/Chat.vue";
import Profile from "./components/Profile.vue";
import Settings from "./components/Settings.vue";

const routes: Array<RouteRecordRaw> = [
  // 3. CAMBIA la redirección principal
  { path: "/", redirect: "/landing" },

  // 2. AÑADE la nueva ruta para la landing page
  { path: "/landing", component: Landing },

  // El resto de las rutas se mantienen igual
  { path: "/onboarding", component: Onboarding },
  { path: "/login", component: Login },
  { path: "/upload-photos", component: UploadPhotos },
  { path: "/swipe", component: Swipe },
  { path: "/likers", component: Likers },
  { path: "/matches", component: Matches },
  { path: "/feed", component: Feed },
  { path: "/chat/:id", component: Chat, props: true },
  { path: "/profile", component: Profile },
  { path: "/settings", component: Settings },
  {
    path: "/complete-profile",
    name: "CompleteProfile",
    component: () => import("./components/CompleteProfile.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

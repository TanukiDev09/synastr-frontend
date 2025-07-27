<template>
  <div class="likers">
    <h2>Personas que te han dado like</h2>
    <div v-if="loading">Cargando...</div>
    <ul v-else-if="likers.length">
      <li v-for="u in likers" :key="u.id" class="liker-item">
        <strong>{{ u.email }}</strong> — nacido en {{ u.birthPlace }}
      </li>
    </ul>
    <p v-else>No tienes likes todavía.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getLikers } from '../graphql/queries';

// Esta interfaz se podría mover a un archivo central de tipos
interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  photos: { url: string; sign?: string }[];
}

const likers = ref<User[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    loading.value = false;
    return;
  }
  try {
    // ✅ 3. AHORA 'data' TIENE EL TIPO CORRECTO: LikersResponse
    // Ya no es 'unknown' y podemos acceder a 'data.likers' de forma segura.
    const data = await getLikers(userId);
    likers.value = data.likers;
  } catch (err) {
    console.error('Failed to load likers', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.likers {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.likers h2 {
  margin-bottom: 1rem;
  text-align: center;
}
.liker-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.liker-item:last-child {
  border-bottom: none;
}
</style>
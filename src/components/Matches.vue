<template>
  <div class="matches">
    <h2>Tus matches</h2>
    <div v-if="loading">Cargando...</div>
    <ul v-else-if="matches.length">
      <li v-for="m in matches" :key="m.id" class="match-item">
        <!-- Enlaza al chat usando el ID de la coincidencia; se usará en el módulo de chat -->
        <router-link :to="`/chat/${m.id}`">
          <strong>{{ m.user.email }}</strong> — nacido en {{ m.user.birthPlace }}
        </router-link>
      </li>
    </ul>
    <p v-else>Aún no tienes matches.</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getMatches } from '../graphql/queries';

// Define las interfaces de datos que se utilizan en esta vista. Estas podrían
// colocarse en un archivo de tipos compartido si crecen en número.
interface Photo {
  url: string;
  sign?: string;
}
interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  photos: Photo[];
}
interface Match {
  id: string;
  user: User;
}

const matches = ref<Match[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  const userId = localStorage.getItem('userId');
  if (!userId) {
    loading.value = false;
    return;
  }
  try {
    const data = await getMatches(userId);
    matches.value = data.matches;
  } catch (err) {
    console.error('Failed to load matches', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.matches {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.matches h2 {
  margin-bottom: 1rem;
  text-align: center;
}
.match-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}
.match-item:last-child {
  border-bottom: none;
}
.match-item a {
  text-decoration: none;
  color: inherit;
}
</style>
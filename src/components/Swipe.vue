<template>
  <div class="swipe">
    <!-- Encabezado con enlaces a likes y matches -->
    <div class="swipe__header">
      <router-link to="/likers" class="header-button">Ver mis Likes</router-link>
      <router-link to="/matches" class="header-button">Mis matches</router-link>
    </div>

    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div v-if="currentUser">
        <img
          v-if="currentUser.photos.length"
          :src="currentUser.photos[0].url"
          alt="foto de perfil"
          class="swipe__photo"
        />
        <div class="swipe__info">
          <p>{{ currentUser.email }}</p>
          <p>Nacido en {{ currentUser.birthPlace }}</p>
          <!-- Mostrar la compatibilidad general para el usuario actual -->
          <p v-if="compatMap[currentUser.id] !== undefined">
            Compatibilidad: {{ compatMap[currentUser.id]!.toFixed(0) }}%
          </p>
        </div>
        <div class="swipe__actions">
          <button @click="dislike">❌</button>
          <button @click="like">❤️</button>
        </div>
      </div>
      <div v-else>
        <p>No hay más usuarios por ahora.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { getFeed, getCompatibility } from '../graphql/queries';
import { likeUser } from '../graphql/mutations';

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

// Store the feed and current index
const users = ref<User[]>([]);
const index = ref<number>(0);
const loading = ref<boolean>(true);

// Map of userId to overall compatibility percentage (0–100)
const compatMap = ref<Record<string, number>>({});

const currentUser = computed(() => users.value[index.value]);

onMounted(async () => {
  try {
    const data = await getFeed();
    const currentUserId = localStorage.getItem('userId');
    // Remove the authenticated user from the feed
    users.value = (data.feed as User[]).filter((u) => u.id !== currentUserId);
    // Precompute compatibility for each user in the feed
    if (currentUserId) {
      for (const u of users.value) {
        try {
          const res = await getCompatibility(currentUserId, u.id, false);
          // Compute the average of category scores as overall
          const breakdowns = res.compatibility;
          const avg =
            breakdowns.reduce((sum, b) => sum + b.score, 0) /
            (breakdowns.length || 1);
          compatMap.value[u.id] = avg;
        } catch (err) {
          console.error('Failed to fetch compatibility:', err);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

async function like() {
  const target = currentUser.value;
  const currentUserId = localStorage.getItem('userId');
  if (target && currentUserId) {
    try {
      const result = await likeUser({
        userId: currentUserId,
        targetUserId: target.id,
      });
      const matched = (result as any).likeUser?.matched;
      if (matched) {
        alert('You have a new match!');
      }
    } catch (err) {
      console.error('Failed to register like:', err);
    }
  }
  index.value++;
}

function dislike() {
  index.value++;
}
</script>

<style scoped>
.swipe {
  max-width: 480px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* Encabezado con botones de navegación */
.swipe__header {
  margin-bottom: 1rem;
  text-align: right;
}
.header-button {
  padding: 0.5rem 1rem;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  margin-left: 0.5rem;
}

.swipe__photo {
  width: 100%;
  height: 320px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.swipe__actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}
.swipe__actions button {
  font-size: 2rem;
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
}
</style>
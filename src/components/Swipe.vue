<template>
  <div class="swipe">
    <h1>Explora perfiles</h1>

    <div v-if="loading" class="loading">Cargando perfiles...</div>
    <div v-else-if="profiles.length">
      <div v-for="(profile, index) in profiles" :key="profile.id" v-show="index === currentIndex" class="profile-card">
        <img v-if="profile.photos && profile.photos.length" :src="profile.photos[0].url" alt="Foto de perfil" class="profile-photo" />
        <h2>{{ profile.email }}</h2>
        <p><strong>Fecha de nacimiento:</strong> {{ profile.birthDate }}</p>
        <p><strong>Hora de nacimiento:</strong> {{ profile.birthTime }}</p>
        <p><strong>Lugar de nacimiento:</strong> {{ profile.birthPlace }}</p>

        <div class="actions">
          <button @click="passProfile">👎 Pasar</button>
          <button @click="likeProfile(profile.id)">❤️ Me gusta</button>
        </div>
      </div>
    </div>
    <div v-else class="no-profiles">
      <p>No hay más perfiles disponibles.</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getFeed } from '../graphql/queries';
import { likeUser } from '../graphql/mutations';
import type { User } from '../graphql/queries';

export default defineComponent({
  name: 'Swipe',
  setup() {
    const profiles = ref<User[]>([]);
    const currentIndex = ref(0);
    const loading = ref(true);

    const fetchProfiles = async () => {
      try {
        const response = await getFeed();
        profiles.value = response.feed;
      } catch (error) {
        console.error('Error al cargar perfiles:', error);
      } finally {
        loading.value = false;
      }
    };

    const likeProfile = async (userId: string) => {
      try {
        await likeUser({ userId });
        nextProfile();
      } catch (error) {
        console.error('Error al dar like:', error);
      }
    };

    const passProfile = () => {
      nextProfile();
    };

    const nextProfile = () => {
      if (currentIndex.value < profiles.value.length - 1) {
        currentIndex.value++;
      } else {
        profiles.value = [];
      }
    };

    onMounted(() => {
      fetchProfiles();
    });

    return {
      profiles,
      currentIndex,
      loading,
      likeProfile,
      passProfile
    };
  }
});
</script>

<style scoped>
.swipe {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.profile-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 2rem;
  background: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.profile-photo {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.actions button {
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border: none;
  border-radius: 4px;
}

.actions button:first-child {
  background: #f5f5f5;
}

.actions button:last-child {
  background: #ff4d6d;
  color: white;
}

.loading,
.no-profiles {
  margin-top: 2rem;
}
</style>

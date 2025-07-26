<template>
  <div class="feed">
    <h2>Personas sugeridas</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else>
      <div
        v-for="user in users"
        :key="user.id"
        class="feed__card"
      >
        <img
          v-if="user.photos.length"
          :src="user.photos[0].url"
          alt="foto de perfil"
          class="feed__photo"
        />
        <div class="feed__info">
          <p>{{ user.email }}</p>
          <p>Nacido en {{ user.birthPlace }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getFeed } from '../graphql/queries';

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

const users = ref<User[]>([]);
const loading = ref<boolean>(true);

onMounted(async () => {
  try {
    const data = await getFeed();
    users.value = data.feed as User[];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.feed {
  max-width: 720px;
  margin: 2rem auto;
  padding: 1rem;
}

.feed__card {
  display: flex;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.feed__photo {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 50%;
  margin-right: 1rem;
}

.feed__info p {
  margin: 0;
}
</style>
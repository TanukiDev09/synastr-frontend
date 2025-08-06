<template>
  <div class="swipe-container">
    <div v-if="profiles.length > 0" class="profile-card-wrapper">
      <div class="profile-card">
        <img v-if="currentProfile.photos.length" :src="currentProfile.photos[0]" alt="Profile Photo" />
        <div class="profile-info">
          <h2>{{ currentProfile.email }}</h2>
          <p><strong>Birth Date:</strong> {{ currentProfile.birthDate }}</p>
          <p><strong>Birth Time:</strong> {{ currentProfile.birthTime }}</p>
          <p><strong>Birth Place:</strong> {{ currentProfile.birthPlace }}</p>
          <p><strong>Gender:</strong> {{ currentProfile.gender || "Not specified" }}</p>
          <p><strong>Looking For:</strong> {{ currentProfile.lookingFor || "Not specified" }}</p>

          <div v-if="currentProfile.user_info" class="extra-info">
            <p v-if="currentProfile.user_info.pets"><strong>Pets:</strong> {{ currentProfile.user_info.pets }}</p>
            <p v-if="currentProfile.user_info.communication_style"><strong>Communication Style:</strong> {{ currentProfile.user_info.communication_style }}</p>
            <p v-if="currentProfile.user_info.languages?.length">
              <strong>Languages:</strong> {{ currentProfile.user_info.languages.join(", ") }}
            </p>
            <p v-if="currentProfile.user_info.interests?.length">
              <strong>Interests:</strong> {{ currentProfile.user_info.interests.join(", ") }}
            </p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button @click="like(currentProfile.id)">Like</button>
        <button @click="skip()">Skip</button>
      </div>
    </div>
    <p v-else-if="!loading">No more profiles to show.</p>
    <p v-if="loading">Loading profiles...</p>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
// CORRECCIÓN: Importa la función 'request' en lugar del cliente.
import { request } from "../graphql/client";
// CORRECCIÓN: Importa la constante de la mutación.
import { LIKE_USER_MUTATION } from "../graphql/mutations";
import { FEED_QUERY, type User } from "../graphql/queries";

const profiles = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Devuelve el primer perfil de la lista para mostrarlo.
const currentProfile = computed(() => profiles.value[0]);

const fetchProfiles = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Usa la función 'request' para ejecutar la query.
    const data = await request<{ feed: User[] }>(FEED_QUERY);
    profiles.value = data.feed;
  } catch (err) {
    console.error("Error fetching profiles:", err);
    error.value = "Failed to load profiles.";
  } finally {
    loading.value = false;
  }
};

const like = async (userId: string) => {
  try {
    // CORRECCIÓN: Usa 'request' para enviar la mutación con sus variables.
    await request(LIKE_USER_MUTATION, { targetUserId: userId });
    // Elimina el perfil de la lista después del 'like'.
    profiles.value.shift();
  } catch (err) {
    console.error("Error liking user:", err);
    error.value = "An error occurred while liking the profile.";
  }
};

const skip = () => {
  // Simplemente elimina el perfil actual de la lista.
  if (profiles.value.length > 0) {
    profiles.value.shift();
  }
};

onMounted(fetchProfiles);
</script>

<style scoped>
.swipe-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  padding: 20px;
}
.profile-card-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.profile-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.profile-card img {
  max-width: 100%;
  border-radius: 4px;
}
.profile-info {
  margin-top: 10px;
  text-align: left;
}
.extra-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}
.actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 400px;
}
button {
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: #f0f0f0;
}
button:first-of-type {
  background-color: #4caf50;
  color: white;
}
button:last-of-type {
  background-color: #f44336;
  color: white;
}
.error-message {
  color: red;
}
</style>
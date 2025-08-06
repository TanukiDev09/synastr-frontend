<template>
  <div class="swipe-container">
    <div v-if="loading" class="feedback-message">
      <p>Loading profiles...</p>
    </div>

    <div v-else-if="currentProfile" class="profile-card-wrapper">
      <div class="profile-card">
        <img v-if="currentProfile.photos.length" :src="currentProfile.photos[0].url" alt="Profile Photo" />
        <div class="profile-info">
          <h2>{{ currentProfile.email }}</h2>
          <div v-if="currentProfile.natalChart" class="natal-info">
            <p><strong>Sun:</strong> {{ getSignFor('Sun', currentProfile) }}</p>
            <p><strong>Moon:</strong> {{ getSignFor('Moon', currentProfile) }}</p>
            <p><strong>Rising:</strong> {{ getSignFor('Ascendant', currentProfile) }}</p>
          </div>
          <p><strong>Birth Date:</strong> {{ currentProfile.birthDate }}</p>
          <p><strong>Gender:</strong> {{ currentProfile.gender || "Not specified" }}</p>
          <p><strong>Looking For:</strong> {{ currentProfile.lookingFor || "Not specified" }}</p>
        </div>
      </div>
      <div class="actions">
        <button @click="like(currentProfile.id)">Like</button>
        <button @click="skip">Skip</button>
      </div>
    </div>
    
    <div v-else class="feedback-message">
      <p>No more profiles to show.</p>
    </div>

    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { request } from "../graphql/client";
import { LIKE_USER_MUTATION } from "../graphql/mutations";
import { FEED_QUERY, type User } from "../graphql/queries";

const profiles = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const currentProfile = computed(() => profiles.value.length > 0 ? profiles.value[0] : null);

const fetchProfiles = async () => {
  loading.value = true;
  error.value = null;
  try {
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
    await request(LIKE_USER_MUTATION, { targetUserId: userId });
    profiles.value.shift(); 
  } catch (err) {
    console.error("Error liking user:", err);
    error.value = "An error occurred while liking the profile.";
  }
};

const skip = () => {
  if (profiles.value.length > 0) {
    profiles.value.shift();
  }
};

// CORRECCIÓN: Función auxiliar para encontrar el signo de un planeta.
const getSignFor = (planetName: string, profile: User): string => {
  if (!profile.natalChart?.positions) {
    return 'N/A';
  }
  const position = profile.natalChart.positions.find(p => p.name === planetName);
  return position ? position.sign : 'N/A';
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
  background-color: #f7f7f7;
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
  border-radius: 12px;
  max-width: 400px;
  width: 100%;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.profile-card img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
}
.profile-info {
  margin-top: 10px;
  text-align: left;
}
.natal-info {
  background-color: #f0f8ff;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 10px;
}
.actions {
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 400px;
}
button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
}
button:hover {
  transform: scale(1.05);
}
button:first-of-type {
  background-color: #4caf50;
  color: white;
}
button:last-of-type {
  background-color: #f44336;
  color: white;
}
.feedback-message {
  color: #555;
  font-size: 1.2rem;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>
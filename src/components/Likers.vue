<template>
  <div class="likers-container">
    <h1>People Who Liked You</h1>
    <div v-if="likers.length" class="liker-card" v-for="liker in likers" :key="liker.id">
      <img v-if="liker.photos.length" :src="liker.photos[0]" alt="Profile Photo" />
      <div class="liker-info">
        <h2>{{ liker.email }}</h2>
        <p><strong>Gender:</strong> {{ liker.gender || "Not specified" }}</p>
        <p><strong>Looking For:</strong> {{ liker.lookingFor || "Not specified" }}</p>

        <!-- Datos extra de user_info -->
        <div v-if="liker.user_info" class="extra-info">
          <p v-if="liker.user_info.pets"><strong>Pets:</strong> {{ liker.user_info.pets }}</p>
          <p v-if="liker.user_info.languages?.length">
            <strong>Languages:</strong> {{ liker.user_info.languages.join(", ") }}
          </p>
          <p v-if="liker.user_info.interests?.length">
            <strong>Interests:</strong> {{ liker.user_info.interests.join(", ") }}
          </p>
        </div>
      </div>
    </div>
    <p v-else>No likes yet.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphqlClient } from "../graphql/client";
import { GET_LIKERS_QUERY, User } from "../graphql/queries";

const likers = ref<User[]>([]);

const fetchLikers = async () => {
  try {
    const { likers: likerList } = await graphqlClient.request<{ likers: User[] }>(GET_LIKERS_QUERY);
    likers.value = likerList;
  } catch (error) {
    console.error("Error fetching likers:", error);
  }
};

onMounted(fetchLikers);
</script>

<style scoped>
.likers-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.liker-card {
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}
.liker-card img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.liker-info h2 {
  margin: 0;
  font-size: 1.1em;
}
.extra-info {
  margin-top: 8px;
  font-size: 0.95em;
}
</style>

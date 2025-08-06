<template>
  <div class="matches-container">
    <h1>Your Matches</h1>
    <div v-if="matches.length" class="match-card" v-for="match in matches" :key="match.id">
      <img v-if="match.photos.length" :src="match.photos[0]" alt="Profile Photo" />
      <div class="match-info">
        <h2>{{ match.email }}</h2>
        <p><strong>Gender:</strong> {{ match.gender || "Not specified" }}</p>
        <p><strong>Looking For:</strong> {{ match.lookingFor || "Not specified" }}</p>

        <!-- Datos extra de user_info -->
        <div v-if="match.user_info" class="extra-info">
          <p v-if="match.user_info.pets"><strong>Pets:</strong> {{ match.user_info.pets }}</p>
          <p v-if="match.user_info.languages?.length">
            <strong>Languages:</strong> {{ match.user_info.languages.join(", ") }}
          </p>
          <p v-if="match.user_info.interests?.length">
            <strong>Interests:</strong> {{ match.user_info.interests.join(", ") }}
          </p>
        </div>
      </div>
    </div>
    <p v-else>No matches yet.</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphqlClient } from "../graphql/client";
import { GET_MATCHES_QUERY, User } from "../graphql/queries";

const matches = ref<User[]>([]);

const fetchMatches = async () => {
  try {
    const { matches: matchList } = await graphqlClient.request<{ matches: User[] }>(GET_MATCHES_QUERY);
    matches.value = matchList;
  } catch (error) {
    console.error("Error fetching matches:", error);
  }
};

onMounted(fetchMatches);
</script>

<style scoped>
.matches-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.match-card {
  display: flex;
  align-items: center;
  gap: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 15px;
}
.match-card img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}
.match-info h2 {
  margin: 0;
  font-size: 1.1em;
}
.extra-info {
  margin-top: 8px;
  font-size: 0.95em;
}
</style>

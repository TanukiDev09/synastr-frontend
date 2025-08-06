<template>
  <div class="feed-container">
    <h1>User Feed</h1>
    <div v-if="loading">Loading users...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="users.length === 0">No users to display.</div>

    <div v-else class="user-list">
      <div class="user-card" v-for="user in users" :key="user.id">
        <img v-if="user.photos.length" :src="user.photos[0]" alt="User Photo" class="user-photo" />
        <h2>{{ user.email }}</h2>
        <p><strong>Gender:</strong> {{ user.gender || "Not specified" }}</p>
        <p v-if="user.sexual_orientation?.length">
          <strong>Orientation:</strong> {{ user.sexual_orientation.join(", ") }}
        </p>
        <p v-if="user.user_info?.languages?.length">
          <strong>Languages:</strong> {{ user.user_info.languages.join(", ") }}
        </p>
        <p v-if="user.user_info?.interests?.length">
          <strong>Interests:</strong> {{ user.user_info.interests.join(", ") }}
        </p>
        <p v-if="user.user_info?.pets"><strong>Pets:</strong> {{ user.user_info.pets }}</p>
        <p v-if="user.user_info?.drinking"><strong>Drinking:</strong> {{ user.user_info.drinking }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { graphqlClient } from "../graphql/client";
import { gql } from "graphql-request";

// Tipo de respuesta esperado de la query
interface UserInfo {
  languages?: string[];
  interests?: string[];
  pets?: string;
  drinking?: string;
}

interface FeedUser {
  id: string;
  email: string;
  gender?: string;
  sexual_orientation?: string[];
  photos: string[];
  user_info?: UserInfo;
}

interface GetFeedResponse {
  getFeed: FeedUser[];
}

// Query para obtener los usuarios del feed
const FETCH_USERS = gql`
  query GetFeed {
    getFeed {
      id
      email
      gender
      sexual_orientation
      photos
      user_info {
        languages
        interests
        pets
        drinking
      }
    }
  }
`;

const loading = ref(false);
const error = ref<string | null>(null);
const users = ref<FeedUser[]>([]);

onMounted(async () => {
  loading.value = true;
  try {
    const data = await graphqlClient.request<GetFeedResponse>(FETCH_USERS);
    users.value = data.getFeed;
  } catch (err) {
    console.error("Error fetching feed:", err);
    error.value = "Failed to load user feed.";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.feed-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.user-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.user-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}
.user-photo {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 12px;
}
.error-message {
  color: red;
}
</style>

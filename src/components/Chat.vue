<template>
  <div class="chat">
    <h2>Chat con {{ id }}</h2>
    <p>Esta sección se implementará con WebSockets y mensajería.</p>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps<{ id: string }>();

// Aquí iría la lógica del chat usando sockets o GraphQL subscriptions.
</script>

<style scoped>
.chat {
  max-width: 720px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
<template>
  <div class="profile">
    <h2>Mi perfil</h2>
    <p>Aquí se mostrará la información del usuario y opciones de edición.</p>
  </div>
</template>

<script lang="ts" setup>
// Aquí se podría hacer una consulta GraphQL para obtener los datos del usuario autenticado.
</script>

<style scoped>
.profile {
  max-width: 720px;
  margin: 2rem auto;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
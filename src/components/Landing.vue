<template>
  <div class="landing-container">
    <div class="landing-box">
      <h1 class="landing-title">Synastr</h1>
      <p class="landing-subtitle">Descubre tu compatibilidad astrológica.</p>
      
      <div class="landing-actions">
        <router-link to="/onboarding" class="btn btn-primary">
          Registrarse
        </router-link>
        <router-link to="/login" class="btn btn-secondary">
          Iniciar Sesión
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Este componente es puramente presentacional, no necesita lógica de script.
</script>

<style scoped>
.landing-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f4f4f4; /* Usando un color de tu base.scss */
}

.landing-box {
  max-width: 420px;
  width: 100%;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.landing-title {
  font-size: 3rem;
  font-weight: 700;
  color: #333;
}

.landing-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2.5rem;
}

.landing-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn {
  display: block;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-primary {
  background-color: #6c63ff; /* Color primario de tu base.scss */
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.4);
}

.btn-secondary {
  background-color: #e9e7ff;
  color: #6c63ff;
}

.btn-secondary:hover {
  background-color: #dcd9ff;
}
</style>
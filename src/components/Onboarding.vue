<template>
  <div class="onboarding">
    <h1>Bienvenido a Synastr</h1>

    <form v-if="!registrationComplete" class="onboarding__form" @submit.prevent="submitForm">
      <label>
        Correo electrónico
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        Contraseña
        <input v-model="form.password" type="password" required />
      </label>
      <label>
        Fecha de nacimiento
        <input v-model="form.birthDate" type="date" required />
      </label>
      <label>
        Hora de nacimiento
        <input v-model="form.birthTime" type="time" required />
      </label>
      <label>
        Lugar de nacimiento
        <input v-model="form.birthPlace" type="text" placeholder="Ciudad, País" required />
      </label>

      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Crear cuenta y ver mi carta' }}
      </button>
      <p v-if="authError" class="error-message">{{ authError }}</p>
    </form>

    <div v-else class="confirmation">
      <h2>¡Registro completo!</h2>
      <p>Esta es tu carta natal generada al instante:</p>
      
      <div ref="chartContainer" class="chart-container"></div>
      
      <button @click="goToNextStep">Continuar a subir fotos</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../composables/useAuth';
import { useAstroChart } from '../composables/useAstroChart';

const router = useRouter();
const registrationComplete = ref(false);

// Usamos nuestros composables
const { form, user, error: authError, isLoading, handleSignUp } = useAuth();
const { chartContainer, drawChart } = useAstroChart('chart-container');

const submitForm = async () => {
  const success = await handleSignUp();
  if (success && user.value?.natalChart) {
    registrationComplete.value = true;
    // Esperamos a que el DOM se actualice para que chartContainer esté disponible
    await nextTick();
    drawChart(user.value.natalChart);
  }
};

const goToNextStep = () => {
  // Usamos el router de Vue para una navegación más limpia en una SPA
  router.push('/upload-photos');
};
</script>

<style scoped>
/* Los estilos se mantienen igual, puedes copiarlos del archivo original */
.onboarding {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
}
.onboarding__form label {
  display: block;
  margin-bottom: 1rem;
}
.onboarding__form input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
}
button {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  cursor: pointer;
}
button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.confirmation {
  text-align: center;
}
.chart-container {
  width: 400px;
  height: 400px;
  background: #fff;
  margin: 1rem auto;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
</style>
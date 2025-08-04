<template>
  <div class="profile">
    <h1>Mi Perfil</h1>

    <div v-if="loading" class="loading">Cargando perfil...</div>
    <div v-else-if="user">
      <div class="user-info">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ user.birthDate }}</p>
        <p><strong>Hora de nacimiento:</strong> {{ user.birthTime }}</p>
        <p><strong>Lugar de nacimiento:</strong> {{ user.birthPlace }}</p>
      </div>

      <!-- Carta Natal -->
      <div class="natal-chart-section">
        <h2>Tu Carta Natal</h2>
        <div ref="chartContainer" class="chart-container"></div>
      </div>
    </div>
    <div v-else class="error">No se pudo cargar el perfil.</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { getCurrentUser } from '../graphql/queries';
import type { CurrentUserResponse, User } from '../graphql/queries';
import AstroChart from '@astrodraw/astrochart';

export default defineComponent({
  name: 'Profile',
  setup() {
    const user = ref<User | null>(null);
    const loading = ref(true);
    const chartContainer = ref<HTMLElement | null>(null);
    let astroChart: AstroChart | null = null;

    const fetchUser = async () => {
      try {
        const response: CurrentUserResponse = await getCurrentUser();
        user.value = response.currentUser;
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      } finally {
        loading.value = false;
      }
    };

    const drawChart = () => {
      if (!chartContainer.value || !user.value) return;

      chartContainer.value.innerHTML = '';
      const width = chartContainer.value.clientWidth || 400;
      const height = 400;

      astroChart = new AstroChart(
        chartContainer.value as HTMLElement,
        width,
        height,
        {
          birthDate: user.value.birthDate,
          birthTime: user.value.birthTime,
          birthPlace: user.value.birthPlace
        }
      );

      astroChart.draw();
    };

    onMounted(async () => {
      await fetchUser();
      if (user.value) drawChart();
    });

    return { user, loading, chartContainer };
  }
});
</script>

<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.user-info p {
  margin: 0.5rem 0;
}

.natal-chart-section {
  margin-top: 2rem;
  text-align: center;
}

.chart-container {
  width: 100%;
  height: 400px;
  border: 1px solid #ddd;
  margin-top: 1rem;
}

.loading,
.error {
  text-align: center;
  margin-top: 2rem;
}
</style>

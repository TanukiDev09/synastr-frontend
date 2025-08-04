<template>
  <div class="onboarding">
    <h1>Bienvenido a Synastr</h1>
    <form v-if="!registrationComplete" class="onboarding__form" @submit.prevent="handleSubmit">
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
      <button type="submit">Registrar y ver mi carta natal</button>
    </form>

    <div v-else class="confirmation">
      <h2>¡Registro completo!</h2>
      <p>Esta es tu carta natal generada automáticamente:</p>
      <div id="chart-container" ref="chartContainer" class="chart-container"></div>
      <button @click="finalizeRegistration">Continuar</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, nextTick } from 'vue';
import { signUp, login, LoginResponse } from '../graphql/mutations';
import Chart from '@astrodraw/astrochart';

export default defineComponent({
  name: 'Onboarding',
  setup() {
    const form = reactive({
      email: '',
      password: '',
      birthDate: '',
      birthTime: '',
      birthPlace: ''
    });

    const registrationComplete = ref(false);
    const chartContainer = ref<HTMLElement | null>(null);
    const user = ref<LoginResponse['login']['user'] | null>(null);

    // Tabla de offsets de signos en grados absolutos
    const signOffsets: Record<string, number> = {
      Aries: 0,
      Taurus: 30,
      Gemini: 60,
      Cancer: 90,
      Leo: 120,
      Virgo: 150,
      Libra: 180,
      Scorpio: 210,
      Sagittarius: 240,
      Capricorn: 270,
      Aquarius: 300,
      Pisces: 330
    };

    const handleSubmit = async () => {
      try {
        console.log('Registrando usuario:', form);
        await signUp({ ...form });

        const loginResponse: LoginResponse = await login({
          email: form.email,
          password: form.password
        });
        user.value = loginResponse.login.user;

        registrationComplete.value = true;
        await nextTick();

        if (user.value?.natalChart) {
          drawChart(user.value.natalChart);
        } else {
          console.warn('El usuario no tiene natalChart calculado aún.');
        }
      } catch (error: any) {
        console.error('Error en el registro:', error);
        if (error.response?.errors?.[0]?.message === 'User with this email already exists') {
          alert('Este correo ya está registrado. Intenta iniciar sesión o usa otro correo.');
        }
      }
    };

    const drawChart = (natalChart: any) => {
      console.log('Datos de natalChart recibidos del backend:', natalChart);

      // Convertir cúspides de casas a grados absolutos
      const cusps: number[] = natalChart.houses
        .filter((_: { degrees: number }, index: number) => index < 12)
        .map((h: { degrees: number; sign: string }) => signOffsets[h.sign] + h.degrees);

      console.log('Cúspides absolutas para AstroChart:', cusps);

      // Convertir planetas a grados absolutos con ligera separación para evitar colisiones
      const planets: Record<string, number[]> = {};
      natalChart.positions.forEach((p: { name: string; degrees: number; sign: string }, index: number) => {
        const absoluteDegree = signOffsets[p.sign] + p.degrees;
        planets[p.name] = [absoluteDegree + index * 0.2]; // offset para separación visual mínima
      });

      console.log('Planetas absolutos para AstroChart:', planets);

      if (chartContainer.value) {
        chartContainer.value.innerHTML = '';
      }

      // Configuración visual optimizada
      const settings = {
        SYMBOL_SCALE: 0.7,
        COLOR_BACKGROUND: '#ffffff',
        POINTS_COLOR: '#333333',
        POINTS_TEXT_SIZE: 6,
        POINTS_STROKE: 1.5,
        HOUSES_LINE_COLOR: '#666666',
        SIGNS_COLOR: '#111111',
        INNER_CIRCLE_RADIUS: 110,
        OUTER_CIRCLE_RADIUS: 190,
        HOUSES_LINE_WIDTH: 1.2
      };

      // Crear gráfico y renderizar casas y planetas
      const chart: any = new Chart('chart-container', 400, 400, settings);
      chart.radix({ planets, cusps });

      console.log('Carta natal dibujada con posiciones absolutas.');
    };

    const finalizeRegistration = () => {
      console.log('Finalizando registro y redirigiendo al feed.');
      window.location.href = '/feed';
    };

    return { form, handleSubmit, registrationComplete, chartContainer, finalizeRegistration, user };
  }
});
</script>

<style scoped>
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
}

.confirmation {
  text-align: center;
}

.chart-container {
  width: 400px;
  height: 400px;
  display: block;
  background: #fff;
  margin: 1rem auto;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>

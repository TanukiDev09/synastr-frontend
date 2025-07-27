<template>
      <div class="onboarding">
        <h1>Bienvenido a Synastr</h1>
        <form class="onboarding__form" @submit.prevent="handleSubmit">
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
            <input v-model="form.birthPlace" type="text" required />
          </label>
          <button type="submit">Crear cuenta</button>
        </form>
        <p v-if="error" class="onboarding__error">{{ error }}</p>
        <!-- Link to the login page for existing users -->
        <p class="onboarding__login-link">
          ¿Ya tienes una cuenta?
          <router-link to="/login">Inicia sesión aquí</router-link>
        </p>
      </div>
    </template>

    <script lang="ts" setup>
    import { reactive, ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { signUp } from '../graphql/queries';
    import { setAuthToken } from '../graphql/auth';

    const router = useRouter();

    interface SignUpForm {
      email: string;
      password: string;
      birthDate: string;
      birthTime: string;
      birthPlace: string;
    }

    const form = reactive<SignUpForm>({
      email: '',
      password: '',
      birthDate: '',
      birthTime: '',
      birthPlace: '',
    });

    const error = ref<string | null>(null);

    async function handleSubmit() {
      try {
        error.value = null;
        const data = await signUp({
          email: form.email,
          password: form.password,
          birthDate: form.birthDate,
          birthTime: form.birthTime,
          birthPlace: form.birthPlace,
        });
        // Persist the returned token and navigate to the swipe interface
        const token = (data as any).signUp?.token;
        if (token) {
          setAuthToken(token);
        }
        router.push('/swipe');
      } catch (err) {
        error.value = 'Error al registrarse. Por favor, intenta de nuevo.';
        console.error(err);
      }
    }
    </script>

    <style scoped>
    .onboarding {
      max-width: 480px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .onboarding h1 {
      margin-bottom: 1rem;
      text-align: center;
    }
    .onboarding__form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .onboarding__form label {
      display: flex;
      flex-direction: column;
      font-weight: 500;
    }
    .onboarding__form input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .onboarding__form button {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #6c63ff;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .onboarding__error {
      color: #e74c3c;
      margin-top: 1rem;
      text-align: center;
    }

    .onboarding__login-link {
      margin-top: 1rem;
      text-align: center;
    }
    </style>
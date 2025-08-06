<template>
  <div class="login">
    <h1>Iniciar sesión</h1>
    <form class="login__form" @submit.prevent="handleSubmit">
      <label>
        Correo electrónico
        <input v-model="form.email" type="email" required />
      </label>
      <label>
        Contraseña
        <input v-model="form.password" type="password" required />
      </label>
      <button type="submit">Entrar</button>
    </form>
    <p v-if="error" class="login__error">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LOGIN_MUTATION } from '../graphql/mutations';
import { setAuthToken } from '../graphql/auth';
// CORRECCIÓN: Importa la función 'request' desde tu archivo de cliente.
import { request } from '../graphql/client';

interface LoginForm {
  email: string;
  password: string;
}

const form = reactive<LoginForm>({
  email: '',
  password: '',
});
const error = ref<string | null>(null);
const router = useRouter();

async function handleSubmit() {
  try {
    error.value = null;

    // CORRECCIÓN: Usa la función 'request' para ejecutar la mutación.
    // Pasas la mutación (LOGIN_MUTATION) y las variables (el email y password del formulario).
    const data = await request<any>(LOGIN_MUTATION, {
      email: form.email,
      password: form.password,
    });

    // El resto de tu lógica para manejar la respuesta es correcta.
    const loginPayload = data.login;
    const token = loginPayload?.token;
    const userId = loginPayload?.user?.id;
    
    if (token) {
      setAuthToken(token);
    }
    if (userId) {
      localStorage.setItem('userId', userId as string);
    }
    if (!token) {
      throw new Error('Token no encontrado en la respuesta');
    }
    
    router.push('/swipe');
  } catch (err) {
    error.value = 'Credenciales inválidas. Por favor, intenta de nuevo.';
    console.error(err);
  }
}
</script>

<style scoped>
.login {
  max-width: 480px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.login h1 {
  margin-bottom: 1rem;
  text-align: center;
}
.login__form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.login__form label {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}
.login__form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login__form button {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #6c63ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.login__error {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}
</style>
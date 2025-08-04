// src/composables/useAuth.ts
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { signUp, login, LoginInput, SignUpInput, LoginResponse } from '../graphql/mutations';
import { setAuthToken } from '../graphql/auth';

export function useAuth() {
  const router = useRouter();
  const user = ref<LoginResponse['login']['user'] | null>(null);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  const form = reactive<SignUpInput>({
    email: '',
    password: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
  });

  const handleSignUp = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      // 1. Registrar al usuario
      await signUp({ ...form });

      // 2. Iniciar sesión para obtener el token y los datos del usuario
      const loginResponse = await login({
        email: form.email,
        password: form.password,
      });
      
      const loginPayload = loginResponse.login;
      const token = loginPayload?.token;
      const userId = loginPayload?.user?.id;

      if (token && userId) {
        setAuthToken(token);
        localStorage.setItem('userId', userId);
        user.value = loginPayload.user;
        return true; // Éxito
      } else {
        throw new Error('No se recibió el token o el ID de usuario.');
      }
    } catch (err: any) {
      console.error('Error en el registro:', err);
      if (err.response?.errors?.[0]?.message.includes('already exists')) {
        error.value = 'Este correo ya está registrado. Por favor, inicia sesión.';
      } else {
        error.value = 'Ocurrió un error durante el registro.';
      }
      return false; // Fallo
    } finally {
      isLoading.value = false;
    }
  };

  return {
    form,
    user,
    error,
    isLoading,
    handleSignUp,
  };
}
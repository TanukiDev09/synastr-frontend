<template>
  <div class="onboarding-container">
    <h1>Create Your Account</h1>
    <form @submit.prevent="handleSignUp" class="onboarding-form">
      <!-- Email -->
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" required />
      </div>

      <!-- Password -->
      <div class="form-group">
        <label>Password</label>
        <input v-model="form.password" type="password" required />
      </div>

      <!-- Birth Date -->
      <div class="form-group">
        <label>Birth Date</label>
        <input v-model="form.birthDate" type="date" required />
      </div>

      <!-- Birth Time -->
      <div class="form-group">
        <label>Birth Time</label>
        <input v-model="form.birthTime" type="time" required />
      </div>

      <!-- Birth Place -->
      <div class="form-group">
        <label>Birth Place</label>
        <input v-model="form.birthPlace" type="text" placeholder="e.g. Bogotá, Colombia" required />
      </div>

      <!-- Gender -->
      <div class="form-group">
        <label>Gender</label>
        <select v-model="form.gender" required>
          <option value="" disabled>Select your gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="NonBinary">Non-binary</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <!-- Looking For -->
      <div class="form-group">
        <label>Looking For</label>
        <select v-model="form.lookingFor" required>
          <option value="" disabled>What are you looking for?</option>
          <option value="Serious">Serious relationship</option>
          <option value="Casual">Casual relationship</option>
          <option value="Friendship">Friendship</option>
        </select>
      </div>

      <!-- Error -->
      <p v-if="error" class="error-message">{{ error }}</p>

      <!-- Submit -->
      <button type="submit" :disabled="loading">
        {{ loading ? "Creating account..." : "Sign Up" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "../composables/useAuth";

const router = useRouter();
const { signUp, loading, error } = useAuth();

const form = ref({
  email: "",
  password: "",
  birthDate: "",
  birthTime: "",
  birthPlace: "",
  gender: "",
  lookingFor: "",
});

const handleSignUp = async () => {
  await signUp({
    email: form.value.email,
    password: form.value.password,
    birthDate: form.value.birthDate,
    birthTime: form.value.birthTime,
    birthPlace: form.value.birthPlace,
    gender: form.value.gender,
    lookingFor: form.value.lookingFor,
  });

  if (!error.value) {
    router.push("/complete-profile");
  }
};
</script>

<style scoped>
.onboarding-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
}
.onboarding-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.error-message {
  color: red;
  font-size: 0.9rem;
}
button {
  padding: 10px;
}
</style>

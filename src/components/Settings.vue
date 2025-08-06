<template>
  <div class="settings-container">
    <h1>Settings</h1>
    <form @submit.prevent="handleSave" class="settings-form">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" disabled />
      </div>

      <div class="form-group">
        <label for="gender">Gender</label>
        <select id="gender" v-model="form.gender">
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="lookingFor">Looking For</label>
        <select id="lookingFor" v-model="form.lookingFor">
          <option value="">Select...</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="pets">Pets</label>
        <select id="pets" v-model="form.pets">
          <option value="">Select...</option>
          <option value="None">None</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div class="form-group">
        <label for="languages">Languages (comma separated)</label>
        <input id="languages" v-model="languagesInput" type="text" />
      </div>

      <div class="form-group">
        <label for="interests">Interests (comma separated)</label>
        <input id="interests" v-model="interestsInput" type="text" />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>
      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save Changes" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "../composables/useAuth"; 
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations";
import { request } from "../graphql/client";

const { user, fetchCurrentUser } = useAuth();
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  email: "",
  gender: "",
  lookingFor: "",
  pets: "",
});
const languagesInput = ref("");
const interestsInput = ref("");

onMounted(async () => {
  // Se asegura de que los datos del usuario estén cargados antes de rellenar el form.
  if (!user.value) {
    await fetchCurrentUser();
  }
  
  if (user.value) {
    form.value.email = user.value.email;
    form.value.gender = user.value.gender || "";
    form.value.lookingFor = user.value.lookingFor || "";
    // CORRECCIÓN: Se utiliza 'userInfo' (camelCase) en lugar de 'user_info'.
    form.value.pets = user.value.userInfo?.pets || "";
    languagesInput.value = user.value.userInfo?.languages?.join(", ") || "";
    interestsInput.value = user.value.userInfo?.interests?.join(", ") || "";
  }
});

const handleSave = async () => {
  loading.value = true;
  error.value = null;
  try {
    const input = {
      gender: form.value.gender || undefined,
      lookingFor: form.value.lookingFor || undefined, 
      pets: form.value.pets || undefined,
      languages: languagesInput.value.split(",").map((l) => l.trim()).filter(Boolean),
      interests: interestsInput.value.split(",").map((i) => i.trim()).filter(Boolean),
    };

    await request(UPDATE_PROFILE_MUTATION, input);

    // Vuelve a cargar los datos del usuario para reflejar los cambios.
    await fetchCurrentUser(); 
    alert("Settings saved successfully!");
  } catch (err) {
    console.error("Error updating settings:", err);
    error.value = "Failed to save changes.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.settings-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.settings-form {
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
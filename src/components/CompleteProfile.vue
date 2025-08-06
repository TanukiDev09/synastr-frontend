<template>
  <div class="complete-profile-container">
    <h1>Complete Your Profile</h1>
    <form @submit.prevent="handleSubmit" class="complete-profile-form">
      <div class="form-group">
        <label for="height">Height (cm)</label>
        <input v-model.number="form.height" id="height" type="number" min="50" max="250" />
      </div>

      <div class="form-group">
        <label for="weight">Weight (kg)</label>
        <input v-model.number="form.weight" id="weight" type="number" min="30" max="250" />
      </div>

      <div class="form-group">
        <label for="school">School</label>
        <input v-model="form.school" id="school" type="text" />
      </div>

      <div class="form-group">
        <label for="education">Education</label>
        <input v-model="form.education" id="education" type="text" />
      </div>

      <div class="form-group">
        <label for="children">Children</label>
        <select v-model="form.children" id="children">
          <option value="" disabled>Select...</option>
          <option value="I want children">I want children</option>
          <option value="I don't want children">I don't want children</option>
          <option value="Not sure">Not sure</option>
          <option value="I have children and want more">I have children and want more</option>
          <option value="I have children and don't want more">I have children and don't want more</option>
        </select>
      </div>

      <div class="form-group">
        <label for="communicationStyle">Communication Style</label>
        <select v-model="form.communicationStyle" id="communicationStyle">
          <option value="" disabled>Select...</option>
          <option value="I love texts">I love texts</option>
          <option value="Phone call">Phone call</option>
          <option value="Video call">Video call</option>
          <option value="In person">In person</option>
        </select>
      </div>

      <div class="form-group">
        <label for="pets">Pets</label>
        <select v-model="form.pets" id="pets">
          <option value="" disabled>Select...</option>
          <option value="Dog">Dog</option>
          <option value="Cat">Cat</option>
          <option value="Bird">Bird</option>
          <option value="Fish">Fish</option>
          <option value="Reptile">Reptile</option>
          <option value="Other">Other</option>
          <option value="No pets">No pets</option>
          <option value="No pets but want">No pets but want</option>
          <option value="Allergic to pets">Allergic to pets</option>
        </select>
      </div>

      <div class="form-group">
        <label for="drinking">Drinking</label>
        <select v-model="form.drinking" id="drinking">
          <option value="" disabled>Select...</option>
          <option value="Not my thing">Not my thing</option>
          <option value="Don't drink alcohol">Don't drink alcohol</option>
          <option value="Exploring sobriety">Exploring sobriety</option>
          <option value="Socially">Socially</option>
          <option value="Special occasions">Special occasions</option>
          <option value="Everyday">Everyday</option>
          <option value="Weekends only">Weekends only</option>
        </select>
      </div>

      <div class="form-group">
        <label for="smoking">Smoking</label>
        <select v-model="form.smoking" id="smoking">
          <option value="" disabled>Select...</option>
          <option value="No, I don't smoke">No, I don't smoke</option>
          <option value="Smoke with friends">Smoke with friends</option>
          <option value="Smoke everyday">Smoke everyday</option>
          <option value="Yes, I smoke">Yes, I smoke</option>
          <option value="Leaving smoking">Leaving smoking</option>
          <option value="I smoke when drinking">I smoke when drinking</option>
        </select>
      </div>

      <div class="form-group">
        <label for="fitness">Fitness</label>
        <select v-model="form.fitness" id="fitness">
          <option value="" disabled>Select...</option>
          <option value="Never">Never</option>
          <option value="Everyday">Everyday</option>
          <option value="Sometimes">Sometimes</option>
          <option value="Frequently">Frequently</option>
          <option value="Rarely">Rarely</option>
        </select>
      </div>

      <div class="form-group">
        <label for="dietary">Dietary Preference</label>
        <select v-model="form.dietary" id="dietary">
          <option value="" disabled>Select...</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Paleo">Paleo</option>
          <option value="Keto">Keto</option>
          <option value="Gluten Free">Gluten Free</option>
          <option value="Other">Other</option>
          <option value="Kosher">Kosher</option>
          <option value="Halal">Halal</option>
          <option value="Meat">Meat</option>
          <option value="Seafood">Seafood</option>
          <option value="Pescatarian">Pescatarian</option>
        </select>
      </div>

      <div class="form-group">
        <label for="sleeping">Sleeping Pattern</label>
        <select v-model="form.sleeping" id="sleeping">
          <option value="" disabled>Select...</option>
          <option value="Early bird">Early bird</option>
          <option value="Night owl">Night owl</option>
          <option value="No preference">No preference</option>
        </select>
      </div>

      <div class="form-group">
        <label for="politics">Politics</label>
        <select v-model="form.politics" id="politics">
          <option value="" disabled>Select...</option>
          <option value="Liberal">Liberal</option>
          <option value="Moderate">Moderate</option>
          <option value="Conservative">Conservative</option>
          <option value="No interested in politics">No interested in politics</option>
          <option value="Center">Center</option>
          <option value="Left">Left</option>
          <option value="Right">Right</option>
          <option value="Socialist">Socialist</option>
          <option value="Anarchist">Anarchist</option>
        </select>
      </div>

      <div class="form-group">
        <label for="spirituality">Spirituality</label>
        <select v-model="form.spirituality" id="spirituality">
          <option value="" disabled>Select...</option>
          <option value="Atheist">Atheist</option>
          <option value="Agnostic">Agnostic</option>
          <option value="Buddhist">Buddhist</option>
          <option value="Christian">Christian</option>
          <option value="Hindu">Hindu</option>
          <option value="Islam">Islam</option>
          <option value="Jewish">Jewish</option>
          <option value="Mormon">Mormon</option>
          <option value="Sikh">Sikh</option>
          <option value="Spiritual">Spiritual</option>
          <option value="Other">Other</option>
          <option value="Catholic">Catholic</option>
          <option value="Evangelical">Evangelical</option>
          <option value="Protestant">Protestant</option>
          <option value="Orthodox">Orthodox</option>
        </select>
      </div>

      <div class="form-group">
        <label for="languages">Languages (comma separated)</label>
        <input v-model="languagesInput" id="languages" type="text" placeholder="e.g., English, Spanish" />
      </div>

      <div class="form-group">
        <label for="interests">Interests (comma separated)</label>
        <input v-model="interestsInput" id="interests" type="text" placeholder="e.g., Music, Reading" />
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <button type="submit" :disabled="loading">
        {{ loading ? "Saving..." : "Save Profile" }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { request } from "../graphql/client";
import { UPDATE_PROFILE_MUTATION } from "../graphql/mutations";

const router = useRouter();
const loading = ref(false);
const error = ref<string | null>(null);

const form = ref({
  height: null as number | null,
  weight: null as number | null,
  school: "",
  education: "",
  children: "",
  communicationStyle: "",
  pets: "",
  drinking: "",
  smoking: "",
  fitness: "",
  dietary: "",
  sleeping: "",
  politics: "",
  spirituality: "",
});

const languagesInput = ref("");
const interestsInput = ref("");

const handleSubmit = async () => {
  loading.value = true;
  error.value = null;

  try {
    const input = {
      height: form.value.height || undefined,
      weight: form.value.weight || undefined,
      school: form.value.school || undefined,
      education: form.value.education || undefined,
      children: form.value.children || undefined,
      communicationStyle: form.value.communicationStyle || undefined,
      pets: form.value.pets || undefined,
      drinking: form.value.drinking || undefined,
      smoking: form.value.smoking || undefined,
      fitness: form.value.fitness || undefined,
      dietary: form.value.dietary || undefined,
      sleeping: form.value.sleeping || undefined,
      politics: form.value.politics || undefined,
      spirituality: form.value.spirituality || undefined,
      languages: languagesInput.value.split(",").map((l) => l.trim()).filter(Boolean),
      interests: interestsInput.value.split(",").map((i) => i.trim()).filter(Boolean),
    };

    await request(UPDATE_PROFILE_MUTATION, input);
    // CORRECCIÓN: Redirige a la pantalla de swipe para continuar.
    router.push("/swipe");
  } catch (err: any) {
    console.error("Error updating profile:", err);
    error.value = err.response?.errors?.[0]?.message || "Failed to save profile. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.complete-profile-container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.complete-profile-form {
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
}
button {
  padding: 10px;
}
</style>
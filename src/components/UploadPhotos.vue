<template>
  <div class="upload-container">
    <h1>Sube tus fotos</h1>
    <p>Una buena selección de fotos aumenta tus posibilidades de hacer match.</p>

    <div class="photo-grid">
      <div
        v-for="(slot, index) in photoSlots"
        :key="index"
        class="photo-slot"
        :class="{ 'photo-slot--profile': slot.isProfile }"
        @click="triggerFileInput(index)"
      >
        <div v-if="slot.previewUrl" class="photo-preview">
          <img :src="slot.previewUrl" alt="Previsualización de foto" />
          <div class="photo-overlay">{{ slot.prompt }}</div>
        </div>
        <div v-else class="photo-placeholder">
          <span>+</span>
          <p>{{ slot.prompt }}</p>
        </div>
      </div>
    </div>

    <input
      type="file"
      ref="fileInput"
      style="display: none"
      accept="image/*"
      @change="handleFileSelect"
    />

    <button @click="handleSubmit" :disabled="isUploading" class="submit-button">
      {{ isUploading ? 'Subiendo...' : 'Guardar y continuar' }}
    </button>
    <p v-if="error" class="error-message">{{ error }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Asumiremos que estas funciones existen y necesitan ser creadas
import { getPhotoSuggestions, addPhotos } from '../graphql/operations'; 

// --- Interfaces y Estado ---

interface PhotoSlot {
  prompt: string;
  sign: string | null;
  file: File | null;
  previewUrl: string | null;
  isProfile: boolean;
}

const router = useRouter();
const photoSlots = ref<PhotoSlot[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const activeSlotIndex = ref<number | null>(null);
const isUploading = ref(false);
const error = ref<string | null>(null);

// --- Lógica ---

// Función para simular la subida a un servicio como Cloudinary
// DEBES IMPLEMENTAR ESTA FUNCIÓN CON TU PROPIO SERVICIO
async function uploadToCloudinary(file: File): Promise<string> {
  // Aquí va la lógica para subir el archivo a Cloudinary
  // Por ejemplo, usando FormData y fetch
  console.log(`Subiendo ${file.name} a Cloudinary...`);
  // Simulación: devolvemos una URL de placeholder
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simular retardo de red
  return `https://placehold.co/600x400/png?text=Uploaded+${file.name}`;
}

onMounted(async () => {
  // Inicializamos los espacios para las fotos
  const slots: PhotoSlot[] = [
    { prompt: 'Foto de perfil', sign: null, file: null, previewUrl: null, isProfile: true },
  ];

  try {
    // Obtenemos las sugerencias desde nuestro backend
    const suggestions = await getPhotoSuggestions();
    suggestions.forEach(s => {
      slots.push({
        prompt: s.prompt,
        sign: s.sign,
        file: null,
        previewUrl: null,
        isProfile: false,
      });
    });
    photoSlots.value = slots;
  } catch (err) {
    error.value = "No se pudieron cargar las sugerencias de fotos.";
    console.error(err);
  }
});

function triggerFileInput(index: number) {
  activeSlotIndex.value = index;
  fileInput.value?.click();
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0] && activeSlotIndex.value !== null) {
    const file = target.files[0];
    const slot = photoSlots.value[activeSlotIndex.value];
    slot.file = file;
    slot.previewUrl = URL.createObjectURL(file);
  }
}

async function handleSubmit() {
  isUploading.value = true;
  error.value = null;
  const userId = localStorage.getItem('userId');

  if (!userId) {
    error.value = "No se encontró el ID de usuario. Por favor, inicia sesión de nuevo.";
    isUploading.value = false;
    return;
  }

  try {
    const photosToUpload = photoSlots.value.filter(slot => slot.file);
    const uploadedPhotos = [];

    for (const slot of photosToUpload) {
      const url = await uploadToCloudinary(slot.file!);
      uploadedPhotos.push({
        url: url,
        sign: slot.sign, // Se envía el signo asociado (o null para la de perfil)
      });
    }

    if (uploadedPhotos.length > 0) {
      await addPhotos({
        userId,
        photos: uploadedPhotos,
      });
    }
    
    router.push('/swipe'); // Navegar a la siguiente pantalla
  } catch (err) {
    error.value = "Ocurrió un error al subir las fotos.";
    console.error(err);
  } finally {
    isUploading.value = false;
  }
}
</script>

<style scoped>
.upload-container {
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  text-align: center;
}
.photo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.photo-slot {
  aspect-ratio: 1 / 1;
  border: 2px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease-in-out;
}
.photo-slot:hover {
  border-color: #6c63ff;
  background-color: #f9f9ff;
}
.photo-slot--profile {
  border-color: #6c63ff;
  border-style: solid;
  grid-column: span 2; /* Hacer que el perfil ocupe más espacio */
  grid-row: span 2;
}
.photo-placeholder {
  color: #aaa;
  text-align: center;
}
.photo-placeholder span {
  font-size: 3rem;
  font-weight: 200;
}
.photo-placeholder p {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 8px;
  font-size: 0.8rem;
  text-align: center;
}
.submit-button {
  margin-top: 2rem;
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
.submit-button:disabled {
  background-color: #ccc;
}
.error-message {
  color: #e74c3c;
  margin-top: 1rem;
}
</style>
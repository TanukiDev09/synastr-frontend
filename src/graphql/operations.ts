// src/graphql/operations.ts
import { request } from './client';

// --- Interfaces ---

interface PhotoInput {
  url: string;
  sign: string | null;
}

// Interfaz para las variables que la función 'addPhotos' recibe
interface AddPhotosVariables {
  userId: string;
  photos: PhotoInput[];
}

// Interfaz para la respuesta que esperamos del servidor
interface AddPhotosResponse {
  addPhotos: {
    id: string;
    photos: {
      url: string;
      sign: string | null;
    }[];
  };
}

// --- Mutation ---

const ADD_PHOTOS_MUTATION = /* GraphQL */ `
  # La variable que define el tipo de entrada se llama $inputData
  mutation AddPhotos($inputData: AddPhotosInput!) {
    # El nombre de la mutación es 'addPhotos' y su argumento es 'inputData'
    addPhotos(inputData: $inputData) {
      id
      email
      photos {
        url
        sign
      }
    }
  }
`;

/**
 * Función que llama a la mutación 'addPhotos' en el backend.
 */
export async function addPhotos(variables: AddPhotosVariables): Promise<AddPhotosResponse> {
  // El objeto que enviamos como 'inputData' debe contener 'userId' (camelCase),
  // no 'user_id'.
  const input = {
    userId: variables.userId,
    photos: variables.photos,
  };
  
  // La variable que se envía al backend se llama 'inputData'.
  return request<AddPhotosResponse>(ADD_PHOTOS_MUTATION, { inputData: input });
}
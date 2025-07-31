// src/graphql/operations.ts
import { request } from './client';

// --- Interfaces ---

interface PhotoSuggestion {
  sign: string;
  prompt: string;
}

interface PhotoInput {
  url: string;
  sign: string | null;
}

// --- Queries ---

const GET_PHOTO_SUGGESTIONS_QUERY = /* GraphQL */ `
  query GetPhotoSuggestions {
    photoSuggestions {
      sign
      prompt
    }
  }
`;

export async function getPhotoSuggestions(): Promise<PhotoSuggestion[]> {
  const response = await request<{ photoSuggestions: PhotoSuggestion[] }>(GET_PHOTO_SUGGESTIONS_QUERY);
  return response.photoSuggestions;
}


// --- Mutations ---

const ADD_PHOTOS_MUTATION = /* GraphQL */ `
  mutation AddPhotos($input: AddPhotosInput!) {
    addPhotos(input: $input) {
      id
      photos {
        url
        sign
      }
    }
  }
`;

export async function addPhotos(input: { userId: string; photos: PhotoInput[] }) {
  return request(ADD_PHOTOS_MUTATION, { input });
}
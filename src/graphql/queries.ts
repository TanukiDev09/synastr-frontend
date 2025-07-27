import { request } from './client';

// ✅ 1. SE DEFINEN LAS INTERFACES PARA LOS DATOS Y RESPUESTAS

interface Photo {
  url: string;
  sign?: string;
}

interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  photos: Photo[];
}

// Interfaz para la respuesta de la mutación signUp
interface SignUpResponse {
  signUp: {
    token: string;
    user: User;
  };
}

// Interfaz para la respuesta de la consulta feed
interface FeedResponse {
  feed: User[];
}

// Interfaz para la respuesta de la consulta likers
interface LikersResponse {
  likers: User[];
}


// Define the sign‑up mutation
const SIGN_UP_MUTATION = /* GraphQL */ `
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      token
      user {
        id
        email
        birthDate
        birthTime
        birthPlace
      }
    }
  }
`;

export async function signUp(input: {
  email: string;
  password: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  // ✅ 2. LA FUNCIÓN AHORA DEVUELVE UNA PROMESA CON EL TIPO CORRECTO
}): Promise<SignUpResponse> {
  return request(SIGN_UP_MUTATION, { input });
}

// Query to fetch the feed of users
const FEED_QUERY = /* GraphQL */ `
  query Feed {
    feed {
      id
      email
      birthDate
      birthTime
      birthPlace
      photos {
        url
        sign
      }
    }
  }
`;

export async function getFeed(): Promise<FeedResponse> {
  return request(FEED_QUERY);
}

// Query to fetch users who have liked the given user
const LIKERS_QUERY = /* GraphQL */ `
  query Likers($userId: ID!) {
    likers(userId: $userId) {
      id
      email
      birthDate
      birthTime
      birthPlace
      photos {
        url
        sign
      }
    }
  }
`;

export async function getLikers(userId: string): Promise<LikersResponse> {
  return request(LIKERS_QUERY, { userId });
}
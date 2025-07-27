import { request } from './client';

// ✅ Interfaces de tipos para las entidades GraphQL
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

// Respuesta de la mutación signUp
interface SignUpResponse {
  signUp: {
    token: string;
    user: User;
  };
}

// Respuesta de la consulta feed
interface FeedResponse {
  feed: User[];
}

// Respuesta de la consulta likers
interface LikersResponse {
  likers: User[];
}

// ✅ Nuevas interfaces para la consulta de matches
interface Match {
  id: string;
  user: User;
}

interface MatchesResponse {
  matches: Match[];
}

// ---------------------- Mutations ----------------------

// Mutación para registrar un nuevo usuario
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

/**
 * Realiza la mutación de registro de usuario.
 *
 * @param input Datos del formulario de registro
 */
export async function signUp(input: {
  email: string;
  password: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}): Promise<SignUpResponse> {
  return request(SIGN_UP_MUTATION, { input });
}

// ---------------------- Queries ----------------------

// Consulta para obtener el feed
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

/**
 * Obtiene todos los usuarios disponibles en el feed.
 */
export async function getFeed(): Promise<FeedResponse> {
  return request(FEED_QUERY);
}

// Consulta para obtener los usuarios que han dado like al usuario actual
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

/**
 * Devuelve la lista de usuarios que le han dado like al usuario indicado.
 *
 * @param userId Identificador del usuario actual
 */
export async function getLikers(userId: string): Promise<LikersResponse> {
  return request(LIKERS_QUERY, { userId });
}

// Consulta para obtener las coincidencias del usuario
const MATCHES_QUERY = /* GraphQL */ `
  query Matches($userId: ID!) {
    matches(userId: $userId) {
      id
      user {
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
  }
`;

/**
 * Devuelve las coincidencias (matches) del usuario actual.
 *
 * @param userId Identificador del usuario autenticado
 */
export async function getMatches(userId: string): Promise<MatchesResponse> {
  return request(MATCHES_QUERY, { userId });
}
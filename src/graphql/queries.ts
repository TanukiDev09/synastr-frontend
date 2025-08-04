// src/graphql/queries.ts
import { request } from "./client";

// -----------------------------------------------------------------------------
// Tipos usados en respuestas de queries
// -----------------------------------------------------------------------------
export interface Photo {
  url: string;
  sign?: string | null;
}

export interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  // Añadimos los campos que faltaban para que coincida con el backend
  latitude?: number;
  longitude?: number;
  timezone?: string;
  photos: Photo[];
  natalChart?: any; // Usamos 'any' por simplicidad, se puede detallar más si es necesario
}

export interface CurrentUserResponse {
  currentUser: User;
}

export interface FeedResponse {
  feed: User[];
}

export interface Match {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  photos: Photo[];
}

export interface MatchesResponse {
  matches: Match[];
}

// -----------------------------------------------------------------------------
// Query: Obtener usuario actual
// -----------------------------------------------------------------------------
export const GET_CURRENT_USER_QUERY = /* GraphQL */ `
  query GetCurrentUser {
    currentUser {
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

export async function getCurrentUser() {
  return request<CurrentUserResponse>(GET_CURRENT_USER_QUERY);
}

// -----------------------------------------------------------------------------
// Query: Compatibilidad astrológica
// -----------------------------------------------------------------------------
export const COMPATIBILITY_QUERY = /* GraphQL */ `
  query Compatibility($userId: ID!) {
    compatibility(userId: $userId) {
      score
      details {
        aspect
        description
      }
    }
  }
`;

export async function getCompatibility(userId: string) {
  return request(COMPATIBILITY_QUERY, { userId });
}

// -----------------------------------------------------------------------------
// Query: Feed de perfiles para swipe (Corregida)
// -----------------------------------------------------------------------------
export const FEED_QUERY = /* GraphQL */ `
  query Feed {
    feed {
      id
      email
      birthDate
      birthTime
      birthPlace
      latitude
      longitude
      timezone
      photos {
        url
        sign
      }
      natalChart {
        positions {
          name
          sign
        }
        houses {
          name
          sign
        }
      }
    }
  }
`;

export async function getFeed() {
  return request<FeedResponse>(FEED_QUERY);
}

// -----------------------------------------------------------------------------
// Query: Lista de matches del usuario actual
// -----------------------------------------------------------------------------
export const MATCHES_QUERY = /* GraphQL */ `
  query Matches {
    matches {
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

export async function getMatches() {
  return request<MatchesResponse>(MATCHES_QUERY);
}

// -----------------------------------------------------------------------------
// Query: Likers (usuarios que dieron "like")
// -----------------------------------------------------------------------------
export const LIKERS_QUERY = /* GraphQL */ `
  query Likers {
    likers {
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

export async function getLikers() {
  return request(LIKERS_QUERY);
}

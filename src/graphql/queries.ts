import { request } from './client';

// -----------------------------------------------------------------------------
// GraphQL queries and mutations for Synastr
//
// This module extends the existing queries with a compatibility query that
// calculates the astrological compatibility between two users. The rest of
// queries for sign‑up, feed, likers and matches are included here to
// simplify integration; they mirror the definitions used in previous update
// packages. If you already have these definitions in your project you can
// merge the new `COMPATIBILITY_QUERY` and `getCompatibility` functions.

// Types used in query responses
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
  photos: Photo[];
}

export interface SignUpResponse {
  signUp: {
    token: string;
    user: User;
  };
}

export interface FeedResponse {
  feed: User[];
}

export interface LikersResponse {
  likers: User[];
}

export interface Match {
  id: string;
  user: User;
}

export interface MatchesResponse {
  matches: Match[];
}

// Each breakdown contains a category, a numeric score and a short description.
export interface CompatibilityBreakdown {
  category: string;
  score: number;
  description: string;
}

export interface CompatibilityResponse {
  compatibility: CompatibilityBreakdown[];
}

// ---------------------- Mutations ----------------------

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
}): Promise<SignUpResponse> {
  return request(SIGN_UP_MUTATION, { input });
}

// ---------------------- Queries ----------------------

// Feed query to fetch all users for the swipe interface
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

// Query to fetch users who have liked the current user
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

// Query to fetch matches for the current user
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

export async function getMatches(userId: string): Promise<MatchesResponse> {
  return request(MATCHES_QUERY, { userId });
}

// ---------------------- Compatibility Query ----------------------

// Calculates the compatibility between two users. The backend returns a list
// of breakdowns with categories and scores. The `premium` flag can be
// supplied to request the premium calculation (includes element bonus).
const COMPATIBILITY_QUERY = /* GraphQL */ `
  query Compatibility($userId: ID!, $targetUserId: ID!, $premium: Boolean) {
    compatibility(userId: $userId, targetUserId: $targetUserId, premium: $premium) {
      category
      score
      description
    }
  }
`;

export async function getCompatibility(
  userId: string,
  targetUserId: string,
  premium = false
): Promise<CompatibilityResponse> {
  return request(COMPATIBILITY_QUERY, {
    userId,
    targetUserId,
    premium,
  });
}
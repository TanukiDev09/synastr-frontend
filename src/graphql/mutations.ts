// src/graphql/mutations.ts
import { request } from './client';

// --- Interfaces y Tipos Comunes ---

export interface Photo {
  url: string;
  sign?: string | null;
}

export interface NatalPosition {
  name: string;
  sign: string;
  signIcon: string;
  degrees: number;
  house: number;
}

export interface NatalChart {
  positions: NatalPosition[];
  houses: NatalPosition[];
}

export interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  photos: Photo[];
  natalChart?: NatalChart;
}

// --- Login Mutation (Corregida) ---

const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
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
            signIcon
            degrees
            house
          }
          houses {
            name
            sign
            signIcon
            degrees
            house
          }
        }
      }
    }
  }
`;

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  login: {
    token: string;
    user: User; // <-- Ahora la respuesta coincide con la interfaz User completa
  };
}

export async function login(input: LoginInput): Promise<LoginResponse> {
  return request<LoginResponse>(LOGIN_MUTATION, { loginInput: input });
}

// --- SignUp Mutation (Corregida) ---

const SIGN_UP_MUTATION = /* GraphQL */ `
  mutation SignUp($signupInput: SignUpInput!) {
    signUp(signupInput: $signupInput) {
      token
      user {
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
            signIcon
            degrees
            house
          }
          houses {
            name
            sign
            signIcon
            degrees
            house
          }
        }
      }
    }
  }
`;

export interface SignUpInput {
  email: string;
  password: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export interface SignUpResponse {
  signUp: {
    token: string;
    user: User; // <-- Ahora la respuesta coincide con la interfaz User completa
  };
}

export async function signUp(input: SignUpInput): Promise<SignUpResponse> {
  return request<SignUpResponse>(SIGN_UP_MUTATION, { signupInput: input });
}

// --- Like User Mutation (Corregida) ---

const LIKE_MUTATION = /* GraphQL */ `
  mutation Like($inputData: LikeInput!) {
    likeUser(inputData: $inputData) {
      matched
    }
  }
`;

export interface LikeInput {
  targetUserId: string;
}

export interface LikeResponse {
  likeUser: {
    matched: boolean;
  };
}

export async function likeUser(input: LikeInput): Promise<LikeResponse> {
  return request<LikeResponse>(LIKE_MUTATION, { inputData: input });
}
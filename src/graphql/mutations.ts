import { request } from './client';

// -----------------------------------------------------------------------------
// Tipos comunes
// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
// Login Mutation (corregida)
// -----------------------------------------------------------------------------
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
    user: User;
  };
}

export async function login(input: LoginInput) {
  return request<LoginResponse>(LOGIN_MUTATION, { loginInput: input });
}

// -----------------------------------------------------------------------------
// SignUp Mutation (ya corregida)
// -----------------------------------------------------------------------------
export const SIGN_UP_MUTATION = /* GraphQL */ `
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
    user: User;
  };
}

export async function signUp(input: SignUpInput) {
  return request<SignUpResponse>(SIGN_UP_MUTATION, { signupInput: input });
}

// -----------------------------------------------------------------------------
// Like Mutation
// -----------------------------------------------------------------------------
const LIKE_MUTATION = /* GraphQL */ `
  mutation Like($input: LikeInput!) {
    likeUser(input: $input) {
      matched
    }
  }
`;

export interface LikeInput {
  userId: string;
  targetUserId: string;
}

export interface LikeResponse {
  likeUser: {
    matched: boolean;
  };
}

export async function likeUser(input: LikeInput) {
  return request<LikeResponse>(LIKE_MUTATION, { input });
}

// -----------------------------------------------------------------------------
// Update Profile Mutation
// -----------------------------------------------------------------------------
const UPDATE_PROFILE_MUTATION = /* GraphQL */ `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
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
`;

export interface UpdateProfileInput {
  birthDate?: string;
  birthTime?: string;
  birthPlace?: string;
  photos?: { url: string; sign: string }[];
}

export async function updateProfile(input: UpdateProfileInput) {
  return request<{ updateProfile: User }>(UPDATE_PROFILE_MUTATION, { input });
}

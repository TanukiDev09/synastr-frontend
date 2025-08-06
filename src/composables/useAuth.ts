import { ref } from "vue";
import { gql } from "graphql-request";
import { request } from "../graphql/client";
import { setAuthToken } from "../graphql/auth";

// Interfaz de Usuario completa
interface User {
  id: string;
  email: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  gender?: string;
  lookingFor?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  sexualOrientation?: string[];
  photos: { url: string; sign: string }[];
  userInfo?: {
    height?: number;
    weight?: number;
    school?: string;
    education?: string;
    children?: string;
    communicationStyle?: string;
    pets?: string;
    drinking?: string;
    smoking?: string;
    fitness?: string;
    dietary?: string;
    sleeping?: string;
    politics?: string;
    spirituality?: string;
    languages?: string[];
    interests?: string[];
  };
  natalChart?: {
    positions: {
      name: string;
      sign: string;
      signIcon: string;
      degrees: number;
      house: number;
    }[];
    houses: {
      name: string;
      sign: string;
      signIcon: string;
      degrees: number;
      house: number;
    }[];
  };
}

// Variables reactivas
const user = ref<User | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Mutación de SignUp completa
const SIGN_UP_MUTATION = gql`
  mutation SignUp($signupInput: SignUpInput!) {
    signUp(signupInput: $signupInput) {
      token
      user {
        id
        email
        birthDate
        birthTime
        birthPlace
        gender
        lookingFor
        latitude
        longitude
        timezone
        sexualOrientation
        photos {
          url
          sign
        }
        userInfo {
          height
          weight
          school
          education
          children
          communicationStyle
          pets
          drinking
          smoking
          fitness
          dietary
          sleeping
          politics
          spirituality
          languages
          interests
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

// Mutación de Login completa
const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        birthDate
        birthTime
        birthPlace
        gender
        lookingFor
        latitude
        longitude
        timezone
        sexualOrientation
        photos {
          url
          sign
        }
        userInfo {
          height
          weight
          school
          education
          children
          communicationStyle
          pets
          drinking
          smoking
          fitness
          dietary
          sleeping
          politics
          spirituality
          languages
          interests
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

// Query para obtener el usuario actual completa
const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      birthDate
      birthTime
      birthPlace
      gender
      lookingFor
      latitude
      longitude
      timezone
      sexualOrientation
      photos {
        url
        sign
      }
      userInfo {
        height
        weight
        school
        education
        children
        communicationStyle
        pets
        drinking
        smoking
        fitness
        dietary
        sleeping
        politics
        spirituality
        languages
        interests
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

export function useAuth() {
  const signUp = async (signupInput: Record<string, any>) => {
    loading.value = true;
    error.value = null;
    try {
      const { signUp } = await request<{ signUp: { token: string; user: User } }>(
        SIGN_UP_MUTATION,
        { signupInput }
      );
      setAuthToken(signUp.token);
      user.value = signUp.user;
    } catch (err: any) {
      error.value = err.response?.errors?.[0]?.message || "Failed to sign up.";
    } finally {
      loading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    loading.value = true;
    error.value = null;
    try {
      const { login } = await request<{ login: { token: string; user: User } }>(
        LOGIN_MUTATION,
        { email, password }
      );
      setAuthToken(login.token);
      user.value = login.user;
    } catch (err: any) {
      error.value = err.response?.errors?.[0]?.message || "Failed to login.";
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrentUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await request<{ getCurrentUser: User }>(GET_CURRENT_USER_QUERY);
      user.value = data.getCurrentUser;
    } catch (err: any) {
      logout();
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    setAuthToken(null);
    user.value = null;
  };

  return {
    user,
    loading,
    error,
    signUp,
    login,
    fetchCurrentUser,
    logout,
  };
}
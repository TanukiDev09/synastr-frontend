import { request } from './client';

// Define la mutación de registro
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
}) {
  return request(SIGN_UP_MUTATION, { input });
}

// Consulta del feed de usuarios
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

export async function getFeed() {
  return request(FEED_QUERY);
}
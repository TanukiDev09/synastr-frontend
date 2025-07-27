import { request } from './client';

// Define the login mutation used to authenticate an existing user.
const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Authenticates a user using the GraphQL `login` mutation.
 *
 * @param input Object containing the user's email and password
 */
export async function login(input: LoginInput) {
  return request(LOGIN_MUTATION, { input });
}
import { request } from './client';

// -----------------------------------------------------------------------------
// Login mutation
//
// Authenticates an existing user and returns a token and basic user info.
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
        photos {
          url
          sign
        }
      }
    }
  }
`;

export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Executes the `login` mutation. Takes an object containing the user's
 * email and password and returns a promise with the GraphQL response.
 */
export async function login(input: LoginInput) {
  return request(LOGIN_MUTATION, { input });
}

// -----------------------------------------------------------------------------
// Like mutation
//
// Records a like and potentially creates a match. Returns whether a match was
// created.
const LIKE_USER_MUTATION = /* GraphQL */ `
  mutation LikeUser($input: LikeInput!) {
    likeUser(input: $input) {
      matched
    }
  }
`;

export interface LikeUserInput {
  userId: string;
  targetUserId: string;
}

export async function likeUser(input: LikeUserInput) {
  return request(LIKE_USER_MUTATION, { input });
}

// -----------------------------------------------------------------------------
// Add photos mutation
//
// Appends one or more photos (with optional zodiac signs) to the specified
// user's profile. Returns the updated user.
const ADD_PHOTOS_MUTATION = /* GraphQL */ `
  mutation AddPhotos($input: AddPhotosInput!) {
    addPhotos(input: $input) {
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

export interface PhotoInput {
  url: string;
  sign: string | null;
}

/**
 * Calls the `addPhotos` mutation on the GraphQL API. Accepts the user ID and
 * an array of photos to upload. Each photo includes a Data URL and an
 * optional zodiac sign. Returns the updated user.
 *
 * @param userId The ID of the user to update
 * @param photos A list of photo objects to append
 */
export async function addPhotos(userId: string, photos: PhotoInput[]) {
  const input = {
    userId,
    photos,
  };
  return request(ADD_PHOTOS_MUTATION, { input });
}
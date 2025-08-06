import { gql } from "graphql-request";

export interface UserInfo {
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
}

export interface AstrologicalPosition {
  name: string;
  sign: string;
  signIcon: string;
  degrees: number;
  house: number;
}

export interface User {
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
  userInfo?: UserInfo;
  photos: {
    url: string;
    sign: string;
  }[];
  sexualOrientation?: string[];
  // CORRECCIÓN: Se define la estructura correcta de la carta natal.
  natalChart?: {
    positions: AstrologicalPosition[];
    houses: AstrologicalPosition[];
  };
}

export const GET_CURRENT_USER_QUERY = gql`
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
      # CORRECCIÓN: Se piden los campos correctos de la carta natal.
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
    }
  }
`;

export const FEED_QUERY = gql`
  query Feed {
    feed {
      id
      email
      birthDate
      birthTime
      birthPlace
      gender
      lookingFor
      photos {
        url
        sign
      }
      sexualOrientation
      latitude
      longitude
      timezone
      # CORRECCIÓN: Se piden los campos correctos de la carta natal.
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
    }
  }
`;

export const GET_MATCHES_QUERY = gql`
  query Matches {
    matches {
      id
      email
      birthDate
      birthTime
      birthPlace
      gender
      lookingFor
      photos {
        url
        sign
      }
      sexualOrientation
    }
  }
`;

export const GET_LIKERS_QUERY = gql`
  query Likers {
    likers {
      id
      email
      birthDate
      birthTime
      birthPlace
      gender
      lookingFor
      photos {
        url
        sign
      }
      sexualOrientation
    }
  }
`;
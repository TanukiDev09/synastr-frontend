import { gql } from "graphql-request";

// =======================
// SIGN UP
// =======================
export const SIGN_UP_MUTATION = gql`
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

// =======================
// LOGIN
// =======================
export const LOGIN_MUTATION = gql`
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

// =======================
// UPDATE PROFILE
// =======================
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile(
    $height: Int
    $weight: Int
    $school: String
    $education: String
    $children: String
    $communicationStyle: String
    $pets: String
    $drinking: String
    $smoking: String
    $fitness: String
    $dietary: String
    $sleeping: String
    $politics: String
    $spirituality: String
    $languages: [String!]
    $interests: [String!]
    $gender: String
    $lookingFor: String
    $sexualOrientation: [String!]
  ) {
    updateProfile(
      height: $height
      weight: $weight
      school: $school
      education: $education
      children: $children
      communicationStyle: $communicationStyle
      pets: $pets
      drinking: $drinking
      smoking: $smoking
      fitness: $fitness
      dietary: $dietary
      sleeping: $sleeping
      politics: $politics
      spirituality: $spirituality
      languages: $languages
      interests: $interests
      gender: $gender
      lookingFor: $lookingFor
      sexualOrientation: $sexualOrientation
    ) {
      id
      gender
      lookingFor
      sexualOrientation
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

// =======================
// LIKE USER
// =======================
export const LIKE_USER_MUTATION = gql`
  mutation LikeUser($targetUserId: String!) {
    likeUser(targetUserId: $targetUserId) {
      id
      likedBy {
        id
        email
      }
    }
  }
`;

// =======================
// UNLIKE USER
// =======================
export const UNLIKE_USER_MUTATION = gql`
  mutation UnlikeUser($targetUserId: String!) {
    unlikeUser(targetUserId: $targetUserId) {
      id
      likedBy {
        id
        email
      }
    }
  }
`;

// =======================
// UPLOAD PHOTO
// =======================
export const UPLOAD_PHOTO_MUTATION = gql`
  mutation UploadPhoto($file: Upload!) {
    uploadPhoto(file: $file) {
      url
      sign
    }
  }
`;

// =======================
// DELETE PHOTO
// =======================
export const DELETE_PHOTO_MUTATION = gql`
  mutation DeletePhoto($url: String!) {
    deletePhoto(url: $url)
  }
`;

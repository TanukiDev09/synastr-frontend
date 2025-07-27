import { graphqlClient } from './client';

/**
 * Persists a JWT token and configures the GraphQL client.
 *
 * When a valid token is provided this function stores it in
 * `localStorage` under the key `synastr_token` and sets the
 * `Authorization` header of the shared `graphqlClient` instance. If
 * `null` or an empty string is passed the token is removed from
 * storage and existing authorization headers are cleared.
 *
 * @param token The JWT string to persist or `null` to clear the token
 */
export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('synastr_token', token);
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  } else {
    localStorage.removeItem('synastr_token');
    // Clear all headers to avoid sending stale authentication
    graphqlClient.setHeaders({});
  }
}

/**
 * Initializes authentication on application startup.
 *
 * Reads any previously stored JWT from `localStorage` and, if found,
 * configures the `graphqlClient` with an `Authorization` header. This
 * allows users to remain authenticated across page reloads.
 */
export function initAuth(): void {
  const token = localStorage.getItem('synastr_token');
  if (token) {
    graphqlClient.setHeader('Authorization', `Bearer ${token}`);
  }
}
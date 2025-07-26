import { GraphQLClient } from 'graphql-request';

// Crea una instancia de GraphQLClient apuntando al endpoint definido en variables de entorno.
const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://localhost:8000/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  credentials: 'include',
});

/**
 * Helper genérico para ejecutar consultas y mutaciones.
 * @param query Cadena de consulta GraphQL
 * @param variables Variables de la consulta
 */
export function request<T>(query: string, variables?: Record<string, any>): Promise<T> {
  return graphqlClient.request<T>(query, variables);
}
import { createYoga, createSchema } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { typeDefs } from '@/lib/graphql/schema';
import { resolvers } from '@/lib/graphql/resolvers';

const schema = createSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/api/graphql',
  fetchAPI: { Response },
});

// GET /api/graphql - Health check or introspection
// POST /api/graphql - GraphQL queries and mutations
export async function GET(request: NextRequest) {
  return yoga(request);
}

export async function POST(request: NextRequest) {
  return yoga(request);
}
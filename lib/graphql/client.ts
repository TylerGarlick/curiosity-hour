const GRAPHQL_ENDPOINT = '/api/graphql';

export async function graphqlRequest<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data;
}

// Types
export interface Player {
  id: string;
  name: string;
  response: string | null;
  answeredAt: number | null;
}

export interface Room {
  code: string;
  createdAt: number;
  questionId: string;
  questionText: string;
  players: Player[];
  revealed: boolean;
}

export interface CreateRoomResponse {
  createRoom: {
    code: string;
    playerId: string;
    room: Room;
  };
}

export interface JoinRoomResponse {
  joinRoom: {
    code: string;
    playerId: string;
    room: Room;
  };
}

export interface SubmitResponseResponse {
  submitResponse: {
    success: boolean;
    revealed: boolean;
    room: Room;
  };
}

export interface GetRoomResponse {
  room: Room | null;
}

// Mutations
export async function createRoom(playerName: string, questionId: string, questionText: string): Promise<CreateRoomResponse> {
  const query = `
    mutation CreateRoom($playerName: String!, $questionId: String!, $questionText: String!) {
      createRoom(playerName: $playerName, questionId: $questionId, questionText: $questionText) {
        code
        playerId
        room {
          code
          createdAt
          questionId
          questionText
          players {
            id
            name
            response
            answeredAt
          }
          revealed
        }
      }
    }
  `;

  return graphqlRequest<CreateRoomResponse>(query, { playerName, questionId, questionText });
}

export async function joinRoom(code: string, playerName: string): Promise<JoinRoomResponse> {
  const query = `
    mutation JoinRoom($code: String!, $playerName: String!) {
      joinRoom(code: $code, playerName: $playerName) {
        code
        playerId
        room {
          code
          createdAt
          questionId
          questionText
          players {
            id
            name
            response
            answeredAt
          }
          revealed
        }
      }
    }
  `;

  return graphqlRequest<JoinRoomResponse>(query, { code: code.toUpperCase(), playerName });
}

export async function submitResponse(code: string, playerId: string, response: string): Promise<SubmitResponseResponse> {
  const query = `
    mutation SubmitResponse($code: String!, $playerId: String!, $response: String!) {
      submitResponse(code: $code, playerId: $playerId, response: $response) {
        success
        revealed
        room {
          code
          questionId
          questionText
          players {
            id
            name
            response
            answeredAt
          }
          revealed
        }
      }
    }
  `;

  return graphqlRequest<SubmitResponseResponse>(query, { code: code.toUpperCase(), playerId, response });
}

export async function getRoom(code: string): Promise<GetRoomResponse> {
  const query = `
    query GetRoom($code: String!) {
      room(code: $code) {
        code
        createdAt
        questionId
        questionText
        players {
          id
          name
          response
          answeredAt
        }
        revealed
      }
    }
  `;

  return graphqlRequest<GetRoomResponse>(query, { code: code.toUpperCase() });
}
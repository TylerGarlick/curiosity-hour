import gql from 'graphql-tag';

export const typeDefs = gql`
  type Player {
    id: ID!
    name: String!
    response: String
    answeredAt: Float
  }

  type Room {
    code: ID!
    createdAt: Float!
    questionId: String!
    questionText: String!
    ownerId: String
    players: [Player!]!
    revealed: Boolean!
  }

  type User {
    id: ID!
    email: String!
    createdAt: Float!
    roomCodes: [String!]!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type CreateRoomResponse {
    code: String!
    playerId: String!
    room: Room!
  }

  type JoinRoomResponse {
    code: String!
    playerId: String!
    room: Room!
  }

  type SubmitResponseResponse {
    success: Boolean!
    revealed: Boolean!
    room: Room!
  }

  type Query {
    # Auth
    me: User
    
    # Rooms
    room(code: String!): Room
    myRooms: [Room!]!
  }

  type Mutation {
    # Auth
    signup(email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    logout: Boolean!

    # Rooms
    createRoom(
      playerName: String!
      questionId: String!
      questionText: String!
    ): CreateRoomResponse!

    joinRoom(
      code: String!
      playerName: String!
    ): JoinRoomResponse!

    submitResponse(
      code: String!
      playerId: String!
      response: String!
    ): SubmitResponseResponse!
  }
`;
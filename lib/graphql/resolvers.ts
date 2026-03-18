/**
 * GraphQL Resolvers
 * 
 * Uses hybrid storage:
 * - KV Store (Upstash Redis) for production with Redis configured
 * - In-memory store as fallback for development
 */

import { roomStore } from '@/lib/roomStore';
import { kvRoomStore } from '@/lib/kvRoomStore';
import type { Room } from '@/lib/room';
import { userStore } from '@/lib/userStore';
import { generatePlayerId } from '@/lib/room';

interface Context {
  req: Request;
}

function getUserIdFromHeader(req: Request): string | null {
  try {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const user = userStore.verifySession(token);
      return user ? user.id : null;
    }
  } catch {
    // Ignore errors
  }
  return null;
}

// Hybrid room storage - tries KV first, falls back to in-memory
async function getRoom(code: string): Promise<Room | undefined> {
  try {
    const room = await kvRoomStore.get(code);
    if (room) return room;
  } catch {
    // Fallback to in-memory
  }
  return roomStore.get(code);
}

async function saveRoom(code: string, room: Room): Promise<void> {
  try {
    await kvRoomStore.update(code, room);
  } catch {
    // Fallback to in-memory
    roomStore.update(code, room);
  }
}

async function createRoomInStore(code: string, room: Room): Promise<void> {
  try {
    await kvRoomStore.create(code, room);
  } catch {
    // Fallback to in-memory
    roomStore.create(code, room);
  }
}

export const resolvers = {
  Room: {
    players: (room: Room) => Object.values(room.players),
  },
  
  Query: {
    room: async (_: unknown, { code }: { code: string }) => {
      return getRoom(code.toUpperCase());
    },
    
    myRooms: async (_: unknown, __: unknown, context: Context) => {
      const userId = getUserIdFromHeader(context.req);
      if (!userId) return [];
      
      const roomCodes = userStore.getUserRooms(userId);
      const rooms: Room[] = [];
      
      for (const code of roomCodes) {
        const room = await getRoom(code);
        if (room) rooms.push(room);
      }
      
      return rooms;
    },
    
    me: (_: unknown, __: unknown, context: Context) => {
      const userId = getUserIdFromHeader(context.req);
      if (!userId) return null;
      
      const user = userStore.findById(userId);
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        roomCodes: user.roomCodes
      };
    }
  },

  Mutation: {
    signup: async (_: unknown, { email, password }: { email: string; password: string }, context: Context) => {
      try {
        const user = userStore.create(email, password);
        const token = userStore.createSession(user.id);
        
        return {
          token,
          user: {
            id: user.id,
            email: user.email,
            createdAt: user.createdAt,
            roomCodes: user.roomCodes
          }
        };
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Signup failed');
      }
    },

    login: async (_: unknown, { email, password }: { email: string; password: string }, context: Context) => {
      const user = userStore.findByEmail(email);
      if (!user || !userStore.verifyPassword(user, password)) {
        throw new Error('Invalid email or password');
      }
      
      const token = userStore.createSession(user.id);
      
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
          roomCodes: user.roomCodes
        }
      };
    },

    logout: async (_: unknown, __: unknown, context: Context) => {
      const authHeader = context.req.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        userStore.deleteSession(token);
      }
      return true;
    },

    createRoom: async (
      _: unknown,
      { playerName, questionId, questionText }: { playerName: string; questionId: string; questionText: string },
      context: Context
    ) => {
      const userId = getUserIdFromHeader(context.req);
      
      const { generateRoomCode } = await import('@/lib/room');
      const code = generateRoomCode();
      const playerId = generatePlayerId();
      
      const room: Room = {
        code,
        createdAt: Date.now(),
        questionId,
        questionText,
        ownerId: userId || null,
        players: {
          [playerId]: {
            id: playerId,
            name: playerName,
            response: null,
            answeredAt: null
          }
        },
        revealed: false
      };
      
      await createRoomInStore(code, room);
      
      if (userId) {
        userStore.addRoomToUser(userId, code);
      }
      
      return {
        code,
        playerId,
        room
      };
    },

    joinRoom: async (
      _: unknown,
      { code, playerName }: { code: string; playerName: string },
      context: Context
    ) => {
      const userId = getUserIdFromHeader(context.req);
      const upperCode = code.toUpperCase();
      
      const room = await getRoom(upperCode);
      if (!room) {
        throw new Error('Room not found');
      }
      
      if (Object.keys(room.players).length >= 2) {
        throw new Error('Room is full');
      }
      
      const playerId = generatePlayerId();
      room.players[playerId] = {
        id: playerId,
        name: playerName,
        response: null,
        answeredAt: null
      };
      
      await saveRoom(upperCode, room);
      
      if (userId) {
        userStore.addRoomToUser(userId, upperCode);
      }
      
      return {
        code: room.code,
        playerId,
        room
      };
    },

    submitResponse: async (
      _: unknown,
      { code, playerId, response }: { code: string; playerId: string; response: string },
      context: Context
    ) => {
      const upperCode = code.toUpperCase();
      const room = await getRoom(upperCode);
      
      if (!room) {
        throw new Error('Room not found');
      }
      
      const player = room.players[playerId];
      if (!player) {
        throw new Error('Player not found');
      }
      
      player.response = response;
      player.answeredAt = Date.now();
      
      const playerIds = Object.keys(room.players);
      const allAnswered = playerIds.every(id => room.players[id].response !== null);
      
      if (allAnswered) {
        room.revealed = true;
      }
      
      await saveRoom(upperCode, room);
      
      return {
        success: true,
        revealed: room.revealed,
        room
      };
    }
  }
};
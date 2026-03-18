/**
 * Persistent Room Storage using Upstash Redis (Vercel KV replacement)
 * 
 * Environment variables required:
 * - KV_REST_API_URL (Upstash Redis REST URL)
 * - KV_REST_API_TOKEN (Upstash Redis REST Token)
 * 
 * For local development without Redis, falls back to in-memory storage.
 */

import { Room } from "./room";

const ROOM_PREFIX = "room:";
const ROOMS_SET = "rooms";
const ROOM_TTL_SECONDS = 24 * 60 * 60; // 24 hours

// Check if Redis is configured
const isRedisConfigured = () => {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
};

// In-memory fallback for development
const memoryStore = new Map<string, Room>();

// Lazy-loaded Redis client
let redisClient: unknown = null;

async function getRedisClient() {
  if (!redisClient && isRedisConfigured()) {
    const { Redis } = await import("@upstash/redis");
    redisClient = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
  }
  return redisClient;
}

export const kvRoomStore = {
  /**
   * Create a new room
   */
  async create(code: string, room: Room): Promise<void> {
    const client = await getRedisClient() as { set: (key: string, value: Room, options?: { ex: number }) => Promise<void>; sadd: (key: string, value: string) => Promise<void> } | null;
    
    if (client) {
      await client.set(`${ROOM_PREFIX}${code}`, room, { ex: ROOM_TTL_SECONDS });
      await client.sadd(ROOMS_SET, code);
    } else {
      // Fallback to in-memory
      memoryStore.set(code, room);
    }
  },

  /**
   * Get a room by code
   */
  async get(code: string): Promise<Room | undefined> {
    const client = await getRedisClient() as { get: (key: string) => Promise<Room | null> } | null;
    
    if (client) {
      const room = await client.get(`${ROOM_PREFIX}${code}`);
      return room || undefined;
    }
    
    return memoryStore.get(code);
  },

  /**
   * Update an existing room
   */
  async update(code: string, room: Room): Promise<void> {
    const client = await getRedisClient() as { set: (key: string, value: Room, options?: { ex: number }) => Promise<void> } | null;
    
    if (client) {
      await client.set(`${ROOM_PREFIX}${code}`, room, { ex: ROOM_TTL_SECONDS });
    } else {
      memoryStore.set(code, room);
    }
  },

  /**
   * Delete a room
   */
  async delete(code: string): Promise<void> {
    const client = await getRedisClient() as { del: (key: string) => Promise<void>; srem: (key: string, value: string) => Promise<void> } | null;
    
    if (client) {
      await client.del(`${ROOM_PREFIX}${code}`);
      await client.srem(ROOMS_SET, code);
    } else {
      memoryStore.delete(code);
    }
  },

  /**
   * Get all room codes (for admin/debugging)
   */
  async getAllCodes(): Promise<string[]> {
    const client = await getRedisClient() as { smembers: (key: string) => Promise<string[]> } | null;
    
    if (client) {
      const codes = await client.smembers(ROOMS_SET);
      return codes || [];
    }
    
    return Array.from(memoryStore.keys());
  },

  /**
   * Check if Redis is available and configured
   */
  async isReady(): Promise<boolean> {
    if (!isRedisConfigured()) return false;
    
    try {
      const client = await getRedisClient() as { ping: () => Promise<string> } | null;
      if (!client) return false;
      
      await client.ping();
      return true;
    } catch {
      return false;
    }
  },
};

export default kvRoomStore;
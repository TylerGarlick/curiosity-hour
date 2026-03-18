import { Room } from './room';
import { supabase, ROOMS_TABLE } from './supabase';

// In-memory fallback for development without Supabase
const memoryStore = new Map<string, Room>();

// Clean up rooms older than 24 hours
const ROOM_TTL_MS = 24 * 60 * 60 * 1000;

// Check if Supabase is configured (client exists)
const isSupabaseConfigured = Boolean(supabase);

// In-memory cleanup interval (only when using memory store)
setInterval(async () => {
  const now = Date.now();
  
  if (isSupabaseConfigured && supabase) {
    // Clean up via Supabase - delete rooms older than 24 hours
    const cutoff = new Date(now - ROOM_TTL_MS).toISOString();
    const { error } = await supabase
      .from(ROOMS_TABLE)
      .delete()
      .lt('created_at', cutoff);
    
    if (error) {
      console.error('Failed to clean up old rooms:', error);
    }
  } else {
    // Fallback: clean up in-memory store
    for (const [code, room] of memoryStore.entries()) {
      if (now - room.createdAt > ROOM_TTL_MS) {
        memoryStore.delete(code);
      }
    }
  }
}, ROOM_TTL_MS);

export const roomStore = {
  async create(code: string, room: Room): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(ROOMS_TABLE)
        .upsert({ code, data: room }, { onConflict: 'code' });
      
      if (error) {
        console.error('Failed to create room in Supabase:', error);
        throw new Error('Failed to create room');
      }
    } else {
      // Fallback to in-memory
      memoryStore.set(code, room);
    }
  },

  async get(code: string): Promise<Room | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(ROOMS_TABLE)
        .select('data')
        .eq('code', code)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - room doesn't exist
          return undefined;
        }
        console.error('Failed to get room from Supabase:', error);
        return undefined;
      }
      
      return data?.data as Room | undefined;
    } else {
      // Fallback to in-memory
      return memoryStore.get(code);
    }
  },

  async update(code: string, room: Room): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(ROOMS_TABLE)
        .upsert({ code, data: room }, { onConflict: 'code' });
      
      if (error) {
        console.error('Failed to update room in Supabase:', error);
        throw new Error('Failed to update room');
      }
    } else {
      // Fallback to in-memory
      memoryStore.set(code, room);
    }
  },

  async delete(code: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from(ROOMS_TABLE)
        .delete()
        .eq('code', code);
      
      if (error) {
        console.error('Failed to delete room from Supabase:', error);
        throw new Error('Failed to delete room');
      }
    } else {
      // Fallback to in-memory
      memoryStore.delete(code);
    }
  },

  async getAll(): Promise<Map<string, Room>> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from(ROOMS_TABLE)
        .select('code, data');
      
      if (error) {
        console.error('Failed to get all rooms from Supabase:', error);
        return new Map();
      }
      
      const rooms = new Map<string, Room>();
      for (const row of data || []) {
        rooms.set(row.code, row.data as Room);
      }
      return rooms;
    } else {
      // Fallback to in-memory
      return memoryStore;
    }
  },
  
  // Check if using persistent storage
  isUsingPersistentStorage(): boolean {
    return isSupabaseConfigured;
  },
};
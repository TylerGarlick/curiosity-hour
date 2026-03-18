// Simple in-memory user store for email/password auth
// For production, use a real database (Supabase, PostgreSQL, etc.)

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  roomCodes: string[];
}

// In-memory store (replace with DB in production)
const users = new Map<string, User>();

// Simple hash function for passwords (for demo - use bcrypt in production)
function hashPassword(password: string): string {
  // Simple hash for demo - not secure for production!
  let hash = 0;
  const salt = 'curiosity-hour-salt';
  const combined = password + salt;
  for (let i = 0; i < 1000; i++) {
    const char = combined.charCodeAt(i % combined.length);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16) + ':' + combined.length.toString(16);
}

function generateUserId(): string {
  return 'user_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
}

// In-memory session store
const sessions = new Map<string, string>(); // sessionToken -> userId

export const userStore = {
  // Create a new user
  create(email: string, password: string): User {
    const existingUser = Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      throw new Error('User already exists');
    }

    const passwordHash = hashPassword(password);
    const user: User = {
      id: generateUserId(),
      email: email.toLowerCase(),
      passwordHash,
      createdAt: Date.now(),
      roomCodes: []
    };

    users.set(user.id, user);
    return user;
  },

  // Find user by email
  findByEmail(email: string): User | undefined {
    return Array.from(users.values()).find(u => u.email.toLowerCase() === email.toLowerCase());
  },

  // Find user by ID
  findById(id: string): User | undefined {
    return users.get(id);
  },

  // Verify password
  verifyPassword(user: User, password: string): boolean {
    const [hash, len] = user.passwordHash.split(':');
    const passwordHash = hashPassword(password);
    return passwordHash.startsWith(hash);
  },

  // Create session (returns session token)
  createSession(userId: string): string {
    const sessionToken = Date.now().toString(36) + Math.random().toString(36).substring(2);
    sessions.set(sessionToken, userId);
    return sessionToken;
  },

  // Verify session and get user
  verifySession(sessionToken: string): User | undefined {
    const userId = sessions.get(sessionToken);
    if (!userId) return undefined;
    return users.get(userId);
  },

  // Add room to user's room list
  addRoomToUser(userId: string, roomCode: string): void {
    const user = users.get(userId);
    if (user && !user.roomCodes.includes(roomCode)) {
      user.roomCodes.push(roomCode);
    }
  },

  // Get user's rooms
  getUserRooms(userId: string): string[] {
    const user = users.get(userId);
    return user ? user.roomCodes : [];
  },

  // Delete session (logout)
  deleteSession(sessionToken: string): void {
    sessions.delete(sessionToken);
  }
};
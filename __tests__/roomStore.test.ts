import { roomStore } from '@/lib/roomStore';
import { Room, generateRoomCode, generatePlayerId, areBothPlayersAnswered } from '@/lib/room';

// Mock Supabase environment
const originalEnv = { ...process.env };

describe('roomStore', () => {
  // Reset environment for each test
  beforeEach(() => {
    process.env = { ...originalEnv };
    // Clear environment to use in-memory store
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('In-memory fallback', () => {
    it('should create a room', async () => {
      const room: Room = {
        code: 'TEST01',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        ownerId: null,
        players: {},
        revealed: false,
      };

      await roomStore.create(room.code, room);
      const retrieved = await roomStore.get(room.code);

      expect(retrieved).toEqual(room);
    });

    it('should return undefined for non-existent room', async () => {
      const retrieved = await roomStore.get('NONEXIST');
      expect(retrieved).toBeUndefined();
    });

    it('should update a room', async () => {
      const room: Room = {
        code: 'TEST02',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        ownerId: null,
        players: {},
        revealed: false,
      };

      await roomStore.create(room.code, room);

      room.revealed = true;
      await roomStore.update(room.code, room);

      const retrieved = await roomStore.get(room.code);
      expect(retrieved?.revealed).toBe(true);
    });

    it('should delete a room', async () => {
      const room: Room = {
        code: 'TEST03',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        ownerId: null,
        players: {},
        revealed: false,
      };

      await roomStore.create(room.code, room);
      await roomStore.delete(room.code);

      const retrieved = await roomStore.get(room.code);
      expect(retrieved).toBeUndefined();
    });

    it('should get all rooms', async () => {
      const room1: Room = {
        code: 'TEST04',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Question 1?',
        ownerId: null,
        players: {},
        revealed: false,
      };

      const room2: Room = {
        code: 'TEST05',
        createdAt: Date.now(),
        questionId: 'q2',
        questionText: 'Question 2?',
        ownerId: null,
        players: {},
        revealed: false,
      };

      await roomStore.create(room1.code, room1);
      await roomStore.create(room2.code, room2);

      const allRooms = await roomStore.getAll();

      expect(allRooms.size).toBeGreaterThanOrEqual(2);
      expect(allRooms.get(room1.code)).toEqual(room1);
      expect(allRooms.get(room2.code)).toEqual(room2);
    });

    it('should indicate in-memory storage when no Supabase configured', () => {
      expect(roomStore.isUsingPersistentStorage()).toBe(false);
    });
  });

  describe('Room utilities', () => {
    it('should generate a 6-character room code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
      expect(code).toMatch(/^[A-Z2-9]+$/);
    });

    it('should generate unique player IDs', () => {
      const id1 = generatePlayerId();
      const id2 = generatePlayerId();
      expect(id1).not.toEqual(id2);
      expect(id1).toMatch(/^player_\d+_[a-z0-9]+$/);
    });

    it('should detect when both players have answered', () => {
      const room: Room = {
        code: 'TEST06',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test?',
        ownerId: null,
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Answer A', answeredAt: Date.now() },
          player2: { id: 'player2', name: 'Bob', response: 'Answer B', answeredAt: Date.now() },
        },
        revealed: false,
      };

      expect(areBothPlayersAnswered(room)).toBe(true);
    });

    it('should return false when only one player answered', () => {
      const room: Room = {
        code: 'TEST07',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test?',
        ownerId: null,
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Answer A', answeredAt: Date.now() },
          player2: { id: 'player2', name: 'Bob', response: null, answeredAt: null },
        },
        revealed: false,
      };

      expect(areBothPlayersAnswered(room)).toBe(false);
    });

    it('should return false when there are more or fewer than 2 players', () => {
      const room1Player: Room = {
        code: 'TEST08',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test?',
        ownerId: null,
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Answer A', answeredAt: Date.now() },
        },
        revealed: false,
      };

      const room3Players: Room = {
        code: 'TEST09',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test?',
        ownerId: null,
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Answer A', answeredAt: Date.now() },
          player2: { id: 'player2', name: 'Bob', response: 'Answer B', answeredAt: Date.now() },
          player3: { id: 'player3', name: 'Charlie', response: 'Answer C', answeredAt: Date.now() },
        },
        revealed: false,
      };

      expect(areBothPlayersAnswered(room1Player)).toBe(false);
      expect(areBothPlayersAnswered(room3Players)).toBe(false);
    });
  });
});
import { generateRoomCode, generatePlayerId, areBothPlayersAnswered, Room } from '../lib/room';

describe('room utilities', () => {
  describe('generateRoomCode', () => {
    it('generates a 6-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(6);
    });

    it('only uses valid characters (no confusing ones like 0/O/1/I)', () => {
      const validChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        for (const char of code) {
          expect(validChars).toContain(char);
        }
      }
    });

    it('generates unique codes', () => {
      const codes = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        codes.add(generateRoomCode());
      }
      expect(codes.size).toBe(1000);
    });
  });

  describe('generatePlayerId', () => {
    it('generates a player ID with the correct prefix', () => {
      const id = generatePlayerId();
      expect(id).toMatch(/^player_/);
    });

    it('generates unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generatePlayerId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('areBothPlayersAnswered', () => {
    it('returns false when no players', () => {
      const room: Room = {
        code: 'TEST01',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        players: {},
        revealed: false,
      };
      expect(areBothPlayersAnswered(room)).toBe(false);
    });

    it('returns false when only one player', () => {
      const room: Room = {
        code: 'TEST01',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Yes', answeredAt: Date.now() },
        },
        revealed: false,
      };
      expect(areBothPlayersAnswered(room)).toBe(false);
    });

    it('returns false when one player has not answered', () => {
      const room: Room = {
        code: 'TEST01',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Yes', answeredAt: Date.now() },
          player2: { id: 'player2', name: 'Bob', response: null, answeredAt: null },
        },
        revealed: false,
      };
      expect(areBothPlayersAnswered(room)).toBe(false);
    });

    it('returns true when both players have answered', () => {
      const room: Room = {
        code: 'TEST01',
        createdAt: Date.now(),
        questionId: 'q1',
        questionText: 'Test question?',
        players: {
          player1: { id: 'player1', name: 'Alice', response: 'Yes', answeredAt: Date.now() },
          player2: { id: 'player2', name: 'Bob', response: 'No', answeredAt: Date.now() },
        },
        revealed: false,
      };
      expect(areBothPlayersAnswered(room)).toBe(true);
    });
  });
});
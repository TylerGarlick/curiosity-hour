// Types for the shared room feature

export interface RoomPlayer {
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
  ownerId: string | null;
  players: Record<string, RoomPlayer>;
  revealed: boolean;
}

// Generate a random 6-character alphanumeric code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluded confusing chars like 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate a unique player ID
export function generatePlayerId(): string {
  return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Check if both players have answered
export function areBothPlayersAnswered(room: Room): boolean {
  const playerIds = Object.keys(room.players);
  if (playerIds.length !== 2) return false;
  return playerIds.every((id) => room.players[id].response !== null);
}
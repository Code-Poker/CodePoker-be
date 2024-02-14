export interface Poker {
  pokerId: string;
  name: string;
  createdAt: string;
  participants: string[];
}

export interface Participant {
  handle: string;
  profileImage: string;
  goal: number;
  point: number;
  problems: number[];
}

export interface PokerResult {
  pokerId: string;
  name: string;
  createdAt: string;
  results: Participant[];
}

import type { Grade } from '../../types';

export interface SessionState {
  queue: string[];
  flipped: boolean;
  done: boolean;
}

export function reveal(_s: SessionState): SessionState {
  throw new Error('reveal: not implemented');
}

export function rate(_s: SessionState, _cardId: string, _grade: Grade): SessionState {
  throw new Error('rate: not implemented');
}

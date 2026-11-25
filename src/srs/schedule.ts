import type { Card, Grade } from '../types';

export function schedule(_card: Card, _grade: Grade, _now: number = Date.now()): Card {
  throw new Error('schedule: not implemented');
}

export function isDue(_card: Card, _now: number = Date.now()): boolean {
  throw new Error('isDue: not implemented');
}

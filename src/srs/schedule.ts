import type { Card, Grade } from '../types';

/**
 * Computes a card's next review based on how well it was recalled.
 * Simplified SM-2: intervals grow by the card's ease factor on each
 * successful review, and failures reset the learning streak.
 *
 * @param card  The card that was just reviewed.
 * @param grade 0 = Again, 1 = Hard, 2 = Good, 3 = Easy.
 * @param now   Review time in ms. Defaults to Date.now(); injectable for tests.
 * @returns A new card with updated reps, interval, ease and due. The input is not mutated.
 */
export function schedule(card: Card, grade: Grade, now: number = Date.now()): Card {
  let reps = card.reps + 1;
  let ease = card.ease;
  let interval: number;
  if (grade === 0) {
    // Lapse: relearn from scratch and slow down future growth.
    reps = 0;
    interval = 0;
    ease = ease - 0.2;
  } else {
    reps = card.reps + 1;
    // Fixed learning steps (1d, 3d) before switching to ease-based growth.
    if (reps === 1) {
      interval = 1;
    } else if (reps === 2) {
      interval = 3;
    } else {
      interval = Math.round(card.interval * ease);
    }
  }
  // Hard/Easy scale the Good interval and nudge ease for future reviews.
  if (grade === 1) {
    interval = Math.round(interval * 0.8);
    interval = Math.max(1, interval);
    ease = ease - 0.15;
  } else if (grade === 3) {
    interval = Math.round(interval * 1.15);
    ease = ease + 0.15;
  }

  // Floor keeps difficult cards from collapsing to near-zero intervals.
  ease = Math.max(1.3, ease);

  const due = new Date(now + interval * 24 * 60 * 60 * 1000).toISOString();

  return {
    ...card,
    reps,
    interval,
    ease,
    due
  }
}

/**
 * Whether a card is ready for review. A card is due from its due time onward (inclusive).
 *
 * @param card The card to check.
 * @param now  Reference time in ms. Defaults to Date.now(); injectable for tests.
 */
export function isDue(card: Card, now: number = Date.now()): boolean {
  const due = Date.parse(card.due);
  return due <= now;
}

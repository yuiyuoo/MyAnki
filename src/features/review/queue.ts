import type { Grade } from '../../types';

/**
 * In-memory state of a review session. Not persisted: a reload starts a new session,
 * while each card's scheduling is saved to the database as it is rated.
 */
export interface SessionState {
  /** IDs of cards still to review, in order. queue[0] is the current card. */
  queue: string[];
  /** Whether the current card's answer is shown. */
  flipped: boolean;
  /** True once the queue is empty. */
  done: boolean;
}

/** Shows the answer of the current card. */
export function reveal(s: SessionState): SessionState {
  return {
    ...s, flipped: true
  };
}

/**
 * Advances the session after a card was rated.
 * Cards rated Again are re-queued at the end so they come back in the same session;
 * any other grade removes the card. Scheduling across days is handled by `schedule`.
 */
export function rate(s: SessionState, cardId: string, grade: Grade): SessionState {
  let array = s.queue;
  array = array.filter((id) => id !== cardId)
  if (grade === 0) {
    array.push(cardId);
  }
  return {
    queue: array,
    flipped: false,
    done: (array.length === 0)
  }
}

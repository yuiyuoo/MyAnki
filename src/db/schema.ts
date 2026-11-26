import Dexie, { type Table } from 'dexie';

/**
 * Grade = the button the user pressed after seeing the answer.
 * 0 = Again (forgot it), 1 = Hard (remembered with difficulty),
 * 2 = Good (remembered normally), 3 = Easy (remembered instantly).
 */
export type Grade = 0 | 1 | 2 | 3;

export interface Deck {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

/** Card = one flashcard: a question (front) and an answer (back), plus its learning progress. */
export interface Card {
  /** Unique ID of this card. */
  id: string;
  /** ID of the deck this card belongs to. */
  deckId: string;
  /** Question side, e.g. "der Apfel". */
  front: string;
  /** Answer side, e.g. "the apple". */
  back: string;
  /** Labels for filtering, e.g. ["food"]. */
  tags: string[];
  /**
   * How easy the card is for you: the multiplier for the next interval.
   * Starts at 2.5. Easy raises it, Hard/Again lower it, never below 1.3.
   * Example: interval 4 days × ease 2.5 → next interval 10 days.
   */
  ease: number;
  /** Days between the last review and the next one. 0 = review again right away. */
  interval: number;
  /** When the card should be shown next (ISO date string). Due when this is now or in the past. */
  due: string;
  /** How many times in a row you answered correctly. Again resets it to 0. */
  reps: number;
  /** When the card was created (ISO date string). */
  createdAt: string;
}

export interface Review {
  id: string;
  cardId: string;
  grade: Grade;
  at: string;
}

export interface Setting {
  key: string;
  value: unknown;
}

class PixelDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<Card, string>;
  reviews!: Table<Review, string>;
  settings!: Table<Setting, string>;

  constructor() {
    super('pixel-cards');
    this.version(1).stores({
      decks: 'id, parentId, name',
      cards: 'id, deckId, due, *tags',
      reviews: 'id, cardId, at',
      settings: 'key',
    });
  }
}

export const db = new PixelDB();

const newCard = (deckId: string, front: string, back: string, tags: string[], now: string): Card => ({
  id: crypto.randomUUID(),
  deckId,
  front,
  back,
  tags,
  ease: 2.5,
  interval: 0,
  due: now,
  reps: 0,
  createdAt: now,
});

export async function seedIfEmpty(): Promise<void> {
  await db.transaction('rw', db.decks, db.cards, async () => {
    if ((await db.decks.count()) > 0) return;
    const now = new Date().toISOString();
    const german: Deck = { id: crypto.randomUUID(), name: 'Deutsch', parentId: null, createdAt: now };
    const japanese: Deck = { id: crypto.randomUUID(), name: 'Japanisch', parentId: null, createdAt: now };
    await db.decks.bulkAdd([german, japanese]);
    await db.cards.bulkAdd([
      newCard(german.id, 'der Apfel', 'the apple', ['food'], now),
      newCard(german.id, 'die Katze', 'the cat', ['animals'], now),
      newCard(japanese.id, '猫 (ねこ)', 'cat', ['animals'], now),
    ]);
  });
}

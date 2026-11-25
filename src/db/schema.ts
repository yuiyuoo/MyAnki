import Dexie, { type Table } from 'dexie';

export type Grade = 0 | 1 | 2 | 3;

export interface Deck {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

export interface Card {
  id: string;
  deckId: string;
  front: string;
  back: string;
  tags: string[];
  ease: number;
  interval: number;
  due: string;
  reps: number;
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

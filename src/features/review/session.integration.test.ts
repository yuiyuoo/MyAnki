import 'fake-indexeddb/auto';
import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../../db/schema';
import { schedule } from '../../srs/schedule';

const NOW = Date.parse('2026-11-24T10:00:00Z');

beforeEach(async () => {
  await db.delete();
  await db.open();
});

describe('Review-Integration', () => {
  it('Bewertung aktualisiert Karte und schreibt Review-Log', async () => {
    const at = new Date(NOW).toISOString();
    await db.decks.add({ id: 'd1', name: 'Deck', parentId: null, createdAt: at });
    await db.cards.add({
      id: 'c1', deckId: 'd1', front: 'f', back: 'b', tags: [],
      ease: 2.5, interval: 0, reps: 0, due: at, createdAt: at,
    });

    const card = await db.cards.get('c1');
    await db.cards.put(schedule(card!, 2, NOW));
    await db.reviews.add({ id: 'r1', cardId: 'c1', grade: 2, at });

    const after = await db.cards.get('c1');
    expect(after!.reps).toBe(1);
    expect(after!.interval).toBe(1);
    expect(after!.due).toBe(new Date(NOW + 86_400_000).toISOString());

    const logs = await db.reviews.where('cardId').equals('c1').toArray();
    expect(logs).toHaveLength(1);
    expect(logs[0].grade).toBe(2);
  });
});

import { describe, it, expect } from 'vitest';
import { schedule, isDue } from './schedule';
import type { Card } from '../types';

const NOW = Date.parse('2026-11-24T10:00:00Z');
const DAY = 86_400_000;

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: 'c1',
    deckId: 'd1',
    front: 'f',
    back: 'b',
    tags: [],
    ease: 2.5,
    interval: 0,
    reps: 0,
    due: new Date(NOW).toISOString(),
    createdAt: new Date(NOW).toISOString(),
    ...overrides,
  };
}

describe('schedule — Grundpfad', () => {
  it('neue Karte + Good → 1 Tag, ease unverändert', () => {
    const out = schedule(makeCard(), 2, NOW);
    expect(out.reps).toBe(1);
    expect(out.interval).toBe(1);
    expect(out.ease).toBeCloseTo(2.5);
    expect(Date.parse(out.due)).toBe(NOW + DAY);
  });

  it('reps=1 + Good → 3 Tage', () => {
    const out = schedule(makeCard({ reps: 1, interval: 1 }), 2, NOW);
    expect(out.reps).toBe(2);
    expect(out.interval).toBe(3);
    expect(Date.parse(out.due)).toBe(NOW + 3 * DAY);
  });

  it('reps=2 + Good → interval × ease', () => {
    const out = schedule(makeCard({ reps: 2, interval: 3 }), 2, NOW);
    expect(out.reps).toBe(3);
    expect(out.interval).toBe(8);
  });

  it('reps=5, interval=20 + Good → 50 Tage', () => {
    const out = schedule(makeCard({ reps: 5, interval: 20 }), 2, NOW);
    expect(out.interval).toBe(50);
  });

  it('verändert die Eingabekarte nicht', () => {
    const card = makeCard({ reps: 2, interval: 3 });
    const snapshot = { ...card };
    schedule(card, 3, NOW);
    expect(card).toEqual(snapshot);
  });
});

describe('schedule — Bewertungen', () => {
  it('Again setzt reps/interval zurück, senkt ease, fällig sofort', () => {
    const out = schedule(makeCard({ reps: 5, interval: 50 }), 0, NOW);
    expect(out.reps).toBe(0);
    expect(out.interval).toBe(0);
    expect(out.ease).toBeCloseTo(2.3);
    expect(Date.parse(out.due)).toBe(NOW);
  });

  it('Hard reduziert interval und senkt ease', () => {
    const out = schedule(makeCard({ reps: 3, interval: 10 }), 1, NOW);
    expect(out.reps).toBe(4);
    expect(out.interval).toBe(20);
    expect(out.ease).toBeCloseTo(2.35);
  });

  it('Easy vergrößert interval und erhöht ease', () => {
    const out = schedule(makeCard({ reps: 3, interval: 10 }), 3, NOW);
    expect(out.interval).toBe(29);
    expect(out.ease).toBeCloseTo(2.65);
  });
});

describe('schedule — Grenzen', () => {
  it('ease sinkt nie unter 1.3 (Hard)', () => {
    const out = schedule(makeCard({ ease: 1.3, reps: 3, interval: 5 }), 1, NOW);
    expect(out.ease).toBeCloseTo(1.3);
  });

  it('ease sinkt nie unter 1.3 (Again)', () => {
    const out = schedule(makeCard({ ease: 1.3, reps: 3, interval: 5 }), 0, NOW);
    expect(out.ease).toBeCloseTo(1.3);
  });

  it('Hard auf neuer Karte bleibt mindestens 1 Tag', () => {
    const out = schedule(makeCard(), 1, NOW);
    expect(out.interval).toBe(1);
    expect(Date.parse(out.due)).toBe(NOW + DAY);
  });

  it('Again → Good startet Lernfolge neu', () => {
    let c = makeCard({ reps: 5, interval: 50 });
    c = schedule(c, 0, NOW);
    expect(c.reps).toBe(0);
    c = schedule(c, 2, NOW);
    expect(c.reps).toBe(1);
    expect(c.interval).toBe(1);
  });
});

describe('isDue', () => {
  it('Vergangenheit → true', () => {
    expect(isDue(makeCard({ due: new Date(NOW - 3_600_000).toISOString() }), NOW)).toBe(true);
  });

  it('Zukunft → false', () => {
    expect(isDue(makeCard({ due: new Date(NOW + 3_600_000).toISOString() }), NOW)).toBe(false);
  });

  it('genau jetzt → true (inklusiv)', () => {
    expect(isDue(makeCard({ due: new Date(NOW).toISOString() }), NOW)).toBe(true);
  });
});

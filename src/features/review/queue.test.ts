import { describe, it, expect } from 'vitest';
import { reveal, rate, type SessionState } from './queue';

const base = (queue: string[]): SessionState => ({ queue, flipped: false, done: false });

describe('reveal', () => {
  it('setzt flipped=true', () => {
    expect(reveal(base(['a'])).flipped).toBe(true);
  });

  it('lässt queue unverändert', () => {
    expect(reveal(base(['a', 'b'])).queue).toEqual(['a', 'b']);
  });
});

describe('rate — Good/Hard/Easy', () => {
  it('Good entfernt Karte, reset flipped', () => {
    const s = rate({ queue: ['a', 'b', 'c'], flipped: true, done: false }, 'a', 2);
    expect(s.queue).toEqual(['b', 'c']);
    expect(s.flipped).toBe(false);
    expect(s.done).toBe(false);
  });

  it('Bewertung aus Mitte erhält Reihenfolge', () => {
    const s = rate(base(['a', 'b', 'c', 'd']), 'b', 3);
    expect(s.queue).toEqual(['a', 'c', 'd']);
  });

  it('letzte Karte + Good → done=true', () => {
    const s = rate(base(['a']), 'a', 2);
    expect(s.queue).toEqual([]);
    expect(s.done).toBe(true);
  });

  it('verändert den Eingabe-State nicht', () => {
    const input = base(['a', 'b']);
    rate(input, 'a', 2);
    expect(input.queue).toEqual(['a', 'b']);
  });
});

describe('rate — Again', () => {
  it('Again hängt Karte ans Ende', () => {
    const s = rate(base(['a', 'b', 'c']), 'a', 0);
    expect(s.queue).toEqual(['b', 'c', 'a']);
    expect(s.done).toBe(false);
  });

  it('einzige Karte + Again → Queue bleibt bestehen', () => {
    const s = rate(base(['a']), 'a', 0);
    expect(s.queue).toEqual(['a']);
    expect(s.done).toBe(false);
  });
});

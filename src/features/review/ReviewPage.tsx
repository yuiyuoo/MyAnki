import { useEffect, useState } from 'react';
import { Card } from '../../components/Card';
import { rate, reveal, type SessionState } from './queue';
import { db, Grade } from '../../db/schema'
import { useLiveQuery } from 'dexie-react-hooks';
import { Button } from '../../components/Button';
import { schedule } from '../../srs/schedule';


export function ReviewPage() {
  const [state, setState] = useState<SessionState | null>(null); // idont understand it much
  useEffect(() => {
    db.cards.where('due').belowOrEqual(new Date().toISOString()).primaryKeys().then((ids) => {
      setState({ queue: ids, flipped: false, done: ids.length === 0 })
    })
  }, [])

  // console.log(state);
  const currentId = state?.queue[0];
  // console.log(currentId);
  const card = useLiveQuery(() => currentId ? db.cards.get(currentId) : undefined, [currentId]);
  // console.log(card);

  async function onGrade(grade:Grade) {
    if (!state || !card) return;
    await db.cards.put(schedule(card, grade));
    await db.reviews.add({ id: crypto.randomUUID(), cardId: card.id, grade, at: new Date().toISOString()});
    setState(rate(state, card.id, grade));
  }

  // Keyboard: Space reveals the answer, 1–4 grade it (Again, Hard, Good, Easy).
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!state || state.done || !card || e.repeat) return;
      if (e.key === ' ' && !state.flipped) {
        e.preventDefault();
        setState(reveal(state));
      } else if (state.flipped && ['1', '2', '3', '4'].includes(e.key)) {
        void onGrade((Number(e.key) - 1) as Grade);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  if (state === null) {
    return (
      <p>Lade ...</p>
    )
  }

  if (state.done) {
    return (
      <p>Fertig!</p>
    )
  }
  if (!card) {
    return (
      <p>Lade ...</p>
    )
  }

  return (
    <>
      <h2>Review</h2>
      <Card>
        <p>{card.front}</p>
        {!state.flipped && <Button onClick={() => setState(reveal(state))}>Antwort zeigen</Button>}
        {state.flipped && <p>{card.back}</p>}
        {state.flipped &&
          <div>
            <Button accent='pink' onClick={() => onGrade(0)}>Again</Button>
            <Button accent='yellow' onClick={() => onGrade(1)}>Hard</Button>
            <Button accent='mint' onClick={() => onGrade(2)}>Good</Button>
            <Button accent='lilac'onClick={() => onGrade(3)}>Easy</Button>
          </div>
        }
      </Card>
    </>
  )

}

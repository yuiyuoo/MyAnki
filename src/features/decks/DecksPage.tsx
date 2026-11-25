import { useLiveQuery } from 'dexie-react-hooks';
import { Card } from '../../components/Card';
import { db } from '../../db/schema';

export function DecksPage() {
  const decks = useLiveQuery(() => db.decks.orderBy('name').toArray(), [], []);
  return (
    <>
      <h2>Decks</h2>
      <div className="grid">
        {decks.map((d) => (
          <Card key={d.id} accent="pink">
            <p>{d.name}</p>
          </Card>
        ))}
      </div>
    </>
  );
}

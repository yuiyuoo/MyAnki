import { useLiveQuery } from 'dexie-react-hooks';
import { Card } from '../../components/Card';
import { countCards, countDue } from '../cards/queries';

export function DashboardPage() {
  const total = useLiveQuery(countCards, [], 0);
  const due = useLiveQuery(countDue, [], 0);
  return (
    <>
      <h2>Dashboard</h2>
      <div className="grid">
        <Card accent="mint">
          <p className="stat-label">Karten</p>
          <p className="stat-value">{total}</p>
        </Card>
        <Card accent="yellow">
          <p className="stat-label">Fällig</p>
          <p className="stat-value">{due}</p>
        </Card>
      </div>
    </>
  );
}

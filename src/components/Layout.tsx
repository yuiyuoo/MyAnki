import { NavLink, Outlet } from 'react-router-dom';
import styles from './Layout.module.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/decks', label: 'Decks' },
  { to: '/review', label: 'Review' },
  { to: '/import', label: 'Import' },
  { to: '/settings', label: 'Settings' },
];

export function Layout() {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1>PIXEL CARDS</h1>
      </header>
      <nav className={styles.sidebar}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

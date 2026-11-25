import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useTheme } from './themeStore';

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <>
      <h2>Einstellungen</h2>
      <Card>
        <p>Theme: {theme === 'light' ? 'Hell' : 'Dunkel'}</p>
        <Button accent="lilac" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
          Theme wechseln
        </Button>
      </Card>
    </>
  );
}

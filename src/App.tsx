import { useEffect } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { DashboardPage } from './features/stats/DashboardPage';
import { DecksPage } from './features/decks/DecksPage';
import { ReviewPage } from './features/review/ReviewPage';
import { ImportPage } from './features/import/ImportPage';
import { SettingsPage } from './features/settings/SettingsPage';
import { useTheme } from './features/settings/themeStore';

export default function App() {
  const { theme, load } = useTheme();

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="decks" element={<DecksPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

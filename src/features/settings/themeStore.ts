import { create } from 'zustand';
import { db } from '../../db/schema';
import type { Theme } from '../../types';

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  load: () => Promise<void>;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: 'light',
  setTheme: (theme) => {
    set({ theme });
    void db.settings.put({ key: 'theme', value: theme });
  },
  load: async () => {
    const s = await db.settings.get('theme');
    if (s?.value === 'light' || s?.value === 'dark') set({ theme: s.value });
  },
}));

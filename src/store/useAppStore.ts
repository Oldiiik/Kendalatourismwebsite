import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Season } from '../contexts/SeasonContext';
import { Language } from '../contexts/LanguageContext';
import { ItineraryItem } from '../components/pages/plannerTypes';

interface PlannerSlice {
  pendingActivity: Partial<ItineraryItem> | null;
  setPendingActivity: (activity: Partial<ItineraryItem>) => void;
  consumePendingActivity: () => Partial<ItineraryItem> | null;
}

interface UiSlice {
  hasCompletedRitual: boolean;
  language: Language | null;
  season: Season;
  setRitualCompleted: (completed: boolean) => void;
  setLanguage: (lang: Language) => void;
  setSeason: (season: Season) => void;
}

type AppStore = PlannerSlice & UiSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      pendingActivity: null,
      setPendingActivity: (activity) => set({ pendingActivity: activity }),
      consumePendingActivity: () => {
        const activity = get().pendingActivity;
        if (activity) {
          set({ pendingActivity: null });
        }
        return activity;
      },

      hasCompletedRitual: false,
      language: null, 
      season: null,
      
      setRitualCompleted: (completed) => set({ hasCompletedRitual: completed }),
      setLanguage: (lang) => set({ language: lang }),
      setSeason: (season) => set({ season: season }),
    }),
    {
      name: 'kendala-ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasCompletedRitual: state.hasCompletedRitual,
        language: state.language,
        season: state.season,
      }),
    }
  )
);
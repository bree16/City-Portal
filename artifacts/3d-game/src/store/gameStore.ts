import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type HairstyleId = 'short' | 'medium' | 'locs' | 'curly' | 'ponytail' | 'fade';
export type AccessoryId = 'glasses' | 'earrings' | 'hat';

export type CharacterAppearance = {
  skinTone: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  // New fields
  name: string;
  pronouns: string;
  hairstyle: HairstyleId;
  eyeColor: string;
  bodyScale: number; // 0 = slimmer, 1 = broader
  accessories: AccessoryId[];
};

export interface GameState {
  stage: number;
  month: number;
  gameStarted: boolean;
  transitioning: boolean;
  phoneOpen: boolean;

  cash: number;
  savings: number;
  creditScore: number;
  debt: number;
  monthlyIncome: number;
  monthlyExpenses: number;

  characterAppearance: CharacterAppearance;
  playerPosition: [number, number, number];
  targetPosition: [number, number, number];

  activeDialogue: { npcId: string; lineIndex: number } | null;

  achievements: string[];
  completedInteractions: string[];
  selectedHomeId: number | null;
  furnitureOwned: string[];
  lastLifeEvent: string | null;

  setPhoneOpen: (v: boolean) => void;
  togglePhone: () => void;
  startGame: (appearance: CharacterAppearance) => void;
  setStage: (stage: number) => void;
  setTransitioning: (v: boolean) => void;
  setPlayerTarget: (pos: [number, number, number]) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;
  openDialogue: (npcId: string) => void;
  advanceDialogue: () => void;
  closeDialogue: () => void;
  completeInteraction: (id: string) => void;
  addAchievement: (id: string) => void;
  updateCash: (delta: number) => void;
  updateSavings: (delta: number) => void;
  updateCreditScore: (delta: number) => void;
  updateDebt: (delta: number) => void;
  updateMonthlyIncome: (delta: number) => void;
  advanceMonth: () => void;
  setSelectedHome: (id: number) => void;
  buyFurniture: (id: string, price: number) => void;
  resetGame: () => void;
}

export const DEFAULT_APPEARANCE: CharacterAppearance = {
  skinTone: '#FDBCB4',
  hairColor: '#3B1F0A',
  shirtColor: '#0A8F7E',
  pantsColor: '#1A3A6B',
  name: 'Alex',
  pronouns: 'They/Them',
  hairstyle: 'medium',
  eyeColor: '#5B3A29',
  bodyScale: 0.5,
  accessories: [],
};

/** Merge a (possibly partial/legacy) persisted appearance onto the full default. */
export function normalizeAppearance(raw: Partial<CharacterAppearance> | undefined): CharacterAppearance {
  return {
    ...DEFAULT_APPEARANCE,
    ...(raw ?? {}),
    // Array and number fields must not be undefined
    accessories: Array.isArray(raw?.accessories) ? raw!.accessories : DEFAULT_APPEARANCE.accessories,
    bodyScale: typeof raw?.bodyScale === 'number' ? raw!.bodyScale : DEFAULT_APPEARANCE.bodyScale,
  };
}

// Generous starting stats — players advance by doing 2-3 quick interactions, not grinding
const INITIAL_STATE = {
  stage: 1,
  month: 1,
  gameStarted: false,
  transitioning: false,
  phoneOpen: false,
  cash: 5800,
  savings: 3500,
  creditScore: 635,
  debt: 4000,
  monthlyIncome: 3800,
  monthlyExpenses: 2100,
  characterAppearance: DEFAULT_APPEARANCE,
  playerPosition: [0, 0, 0] as [number, number, number],
  targetPosition: [0, 0, 0] as [number, number, number],
  activeDialogue: null,
  achievements: [] as string[],
  completedInteractions: [] as string[],
  selectedHomeId: null,
  furnitureOwned: [] as string[],
  lastLifeEvent: null,
};

// Fields that should not be persisted (runtime-only state)
const TRANSIENT_FIELDS: (keyof GameState)[] = [
  'transitioning',
  'activeDialogue',
  'playerPosition',
  'targetPosition',
  'phoneOpen',
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      setPhoneOpen: (v) => set({ phoneOpen: v }),
      togglePhone: () => set((s) => ({ phoneOpen: !s.phoneOpen })),
      startGame: (appearance) => set({ gameStarted: true, characterAppearance: appearance }),
      setStage: (stage) => set({ stage, completedInteractions: [], transitioning: false }),
      setTransitioning: (v) => set({ transitioning: v }),
      setPlayerTarget: (pos) => set({ targetPosition: pos }),
      setPlayerPosition: (pos) => set({ playerPosition: pos }),
      openDialogue: (npcId) => set({ activeDialogue: { npcId, lineIndex: 0 } }),
      advanceDialogue: () =>
        set((s) =>
          s.activeDialogue
            ? { activeDialogue: { ...s.activeDialogue, lineIndex: s.activeDialogue.lineIndex + 1 } }
            : {}
        ),
      closeDialogue: () => set({ activeDialogue: null }),
      completeInteraction: (id) =>
        set((s) => ({
          completedInteractions: s.completedInteractions.includes(id)
            ? s.completedInteractions
            : [...s.completedInteractions, id],
        })),
      addAchievement: (id) =>
        set((s) => ({
          achievements: s.achievements.includes(id) ? s.achievements : [...s.achievements, id],
        })),
      updateCash: (delta) => set((s) => ({ cash: Math.max(0, s.cash + delta) })),
      updateSavings: (delta) => set((s) => ({ savings: Math.max(0, s.savings + delta) })),
      updateCreditScore: (delta) =>
        set((s) => ({ creditScore: Math.max(300, Math.min(850, s.creditScore + delta)) })),
      updateDebt: (delta) => set((s) => ({ debt: Math.max(0, s.debt + delta) })),
      updateMonthlyIncome: (delta) => set((s) => ({ monthlyIncome: s.monthlyIncome + delta })),
      advanceMonth: () =>
        set((s) => {
          const net = s.monthlyIncome - s.monthlyExpenses;
          return { month: s.month + 1, cash: Math.max(0, s.cash + net) };
        }),
      setSelectedHome: (id) => set({ selectedHomeId: id }),
      buyFurniture: (id, price) =>
        set((s) => ({
          furnitureOwned: [...s.furnitureOwned, id],
          cash: Math.max(0, s.cash - price),
        })),
      resetGame: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'path-to-home-game-state',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => {
        const persisted = { ...state } as Record<string, unknown>;
        for (const key of TRANSIENT_FIELDS) {
          delete persisted[key as string];
        }
        return persisted;
      },
      migrate: (persistedState: unknown, fromVersion: number) => {
        const s = (persistedState ?? {}) as Record<string, unknown>;
        if (fromVersion < 1) {
          // v0 → v1: fill in new CharacterAppearance fields that may be missing
          s.characterAppearance = normalizeAppearance(
            s.characterAppearance as Partial<CharacterAppearance> | undefined
          );
        }
        return s;
      },
    }
  )
);

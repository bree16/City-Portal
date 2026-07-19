import { create } from 'zustand';
import { HomeOption } from '@/data/homes';
import { FurnitureItem } from '@/data/furniture';

export interface GameState {
  stage: number;
  month: number;
  cash: number;
  savings: number;
  creditScore: number;
  debt: number;
  monthlyIncome: number;
  achievements: string[];
  selectedHome: HomeOption | null;
  furnitureOwned: FurnitureItem[];
  homeEquity: number;
  completedTasks: string[];
  lastEvent: string | null;

  setStage: (stage: number) => void;
  advanceMonth: (cashDelta: number) => void;
  updateCash: (amount: number) => void;
  updateSavings: (amount: number) => void;
  updateCreditScore: (amount: number) => void;
  updateDebt: (amount: number) => void;
  updateMonthlyIncome: (amount: number) => void;
  addAchievement: (id: string) => void;
  setSelectedHome: (home: HomeOption | null) => void;
  addFurniture: (item: FurnitureItem) => void;
  updateHomeEquity: (amount: number) => void;
  completeTask: (taskId: string) => void;
  setLastEvent: (eventId: string | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  stage: 1,
  month: 1,
  cash: 2400,
  savings: 0,
  creditScore: 620,
  debt: 8500,
  monthlyIncome: 3800,
  achievements: [],
  selectedHome: null,
  furnitureOwned: [],
  homeEquity: 0,
  completedTasks: [],
  lastEvent: null,

  setStage: (stage) => set({ stage }),
  advanceMonth: (cashDelta) => set((state) => ({ month: state.month + 1, cash: state.cash + cashDelta })),
  updateCash: (amount) => set((state) => ({ cash: state.cash + amount })),
  updateSavings: (amount) => set((state) => ({ savings: state.savings + amount })),
  updateCreditScore: (amount) => set((state) => ({ creditScore: state.creditScore + amount })),
  updateDebt: (amount) => set((state) => ({ debt: state.debt + amount })),
  updateMonthlyIncome: (amount) => set((state) => ({ monthlyIncome: state.monthlyIncome + amount })),
  addAchievement: (id) => set((state) => ({ achievements: [...state.achievements, id] })),
  setSelectedHome: (home) => set({ selectedHome: home }),
  addFurniture: (item) => set((state) => ({ furnitureOwned: [...state.furnitureOwned, item] })),
  updateHomeEquity: (amount) => set((state) => ({ homeEquity: state.homeEquity + amount })),
  completeTask: (taskId) => set((state) => ({ completedTasks: [...state.completedTasks, taskId] })),
  setLastEvent: (eventId) => set({ lastEvent: eventId }),
  resetGame: () => set({
    stage: 1,
    month: 1,
    cash: 2400,
    savings: 0,
    creditScore: 620,
    debt: 8500,
    monthlyIncome: 3800,
    achievements: [],
    selectedHome: null,
    furnitureOwned: [],
    homeEquity: 0,
    completedTasks: [],
    lastEvent: null
  }),
}));

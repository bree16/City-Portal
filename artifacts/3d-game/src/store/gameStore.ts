import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { LifeEvent } from '@/data/lifeEvents';
import type { MaintenanceEvent } from '@/data/maintenanceEvents';
import { shouldMaintenanceFire, selectMaintenanceEvent } from '@/data/maintenanceEvents';

export interface YearSummaryEvent {
  label: string;
  cashDelta: number;
}

export interface SellNegotiationState {
  listingPrice: number;
  round: number; // 0 = not started, 1-3 = rounds
  buyerOffer: number;
  status: 'pending' | 'accepted' | 'failed';
  salePrice: number | null;
  eventLog: string[];
}

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
  /** How many in-world interactions the player has ever made — used for first-time hints. */
  interactionCount: number;

  cash: number;
  savings: number;
  creditScore: number;
  /** Credit score when the game was first started — used for end-game delta. */
  startCreditScore: number;
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
  showResultsCard: boolean;

  careerId: string | null;
  pendingLifeEvent: LifeEvent | null;
  lifeEventLog: string[];
  currentLocation: string; // 'city' | buildingId | 'home_tour' | 'homelife'
  tourProgress: Record<string, string[]>; // homeId → visited room names

  // Home Life (Stage 8) state
  homeValue: number;
  mortgageBalance: number;
  /** Fixed monthly mortgage payment set at purchase (30-yr fixed at 6.5%). */
  mortgagePayment: number;
  improvementsOwned: string[];
  pendingMaintenance: MaintenanceEvent | null; // transient
  /** Months elapsed inside the homelife phase (used for maintenance scheduling). */
  homeLifeMonths: number;
  /** Whether the Home Dashboard DraggablePanel is open. */
  dashboardOpen: boolean;
  /** Whether the Listing/Sell modal DraggablePanel is open. */
  listingOpen: boolean;
  /** Current annual mortgage interest rate as a percent (default 6.5). */
  mortgageRate: number;
  /** Whether the home has been sold (end-game trigger). */
  homeSold: boolean;
  /** Whether to show the full end-game screen. */
  showEndGame: boolean;
  /** Total interest paid over the home life period (accumulated). */
  totalInterestPaid: number;
  /** Actual sale price accepted by player (set once in completeSale, never recomputed). */
  finalSalePrice: number;
  /** Net proceeds after agent fee, closing costs, and mortgage payoff at sale time. */
  finalSaleProceeds: number;
  /** Mortgage balance at the moment of sale (for audit display). */
  mortgagePayoffAtSale: number;
  /** Summary of events that fired during a "Pass a Year". Cleared after display. */
  yearSummary: YearSummaryEvent[] | null;
  /** Active sell negotiation state (transient). */
  sellNegotiation: SellNegotiationState | null;
  /** Whether dev mode has been unlocked (persisted so it survives quit-to-menu). */
  devMode: boolean;

  // Audio preferences — persisted with the save so they survive clearing localStorage-only keys
  musicVolume: number; // 0–1
  sfxVolume: number; // 0–1
  audioMuted: boolean;
  setMusicVolume: (level: number) => void;
  setSfxVolume: (level: number) => void;
  setAudioMuted: (muted: boolean) => void;

  setPhoneOpen: (v: boolean) => void;
  setCurrentLocation: (id: string) => void;
  markRoomVisited: (homeId: string, room: string) => void;
  startHomeTour: (homeId: number) => void;
  startNegotiation: () => void;
  initHomeLife: (homePrice: number) => void;
  setPendingMaintenance: (event: MaintenanceEvent | null) => void;
  applyMaintenance: (fix: boolean) => void;
  buyImprovement: (id: string, cost: number, valuePct: number) => void;
  advanceHomeMonth: () => void;
  togglePhone: () => void;
  noteInteraction: () => void;
  setCareer: (id: string, monthlyIncome: number, monthlyExpenses: number, bonus: { type: 'cash' | 'savings' | 'creditScore'; amount: number }) => void;
  setPendingLifeEvent: (event: LifeEvent | null) => void;
  applyLifeEvent: () => void;
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
  setShowResultsCard: (v: boolean) => void;
  setDashboardOpen: (v: boolean) => void;
  setListingOpen: (v: boolean) => void;
  /** Advance one month in homelife: pays mortgage, accrues income, checks maintenance. */
  advanceHomeLifeMonth: () => void;
  /** Advance a full year (12 months) in homelife, auto-resolving maintenance events. */
  passYear: () => void;
  /** Apply a lump-sum extra principal payment toward the mortgage. */
  payDownMortgage: (amount: number) => void;
  /** Refinance the mortgage: reduce rate, recalculate payment, deduct closing fee. */
  refinanceMortgage: (newRate: number, fee: number) => void;
  /** Complete a home sale: pay off mortgage, add equity to savings, trigger end game. */
  completeSale: (salePrice: number) => void;
  /** Skip the sell flow and go straight to end game (home still owned). */
  wrapUpJourney: () => void;
  /** Show or hide the end-game screen. */
  setShowEndGame: (v: boolean) => void;
  /** Set player cash directly (dev tool). */
  setDevCash: (amount: number) => void;
  /** Unlock or lock dev mode. */
  setDevMode: (v: boolean) => void;
  /** Clear the year summary after it has been displayed. */
  clearYearSummary: () => void;
  /** Update sell negotiation state. */
  setSellNegotiation: (state: SellNegotiationState | null) => void;
  quitToMenu: () => void;
  resetGame: () => void;

  /** End-game */
  showEndGame: boolean;
  homeSold: boolean;
  saleProceeds: number;
  totalInterestPaid: number;
  /** Dev mode: unlocked by "2005" on title screen; exposes in-game money cheat panel */
  devMode: boolean;
  /** Events collected during a passYear call — shown in year-end summary modal */
  yearSummaryEvents: string[];
  setShowEndGame: (v: boolean) => void;
  /** Pay off mortgage from sale price, add net proceeds to cash, trigger end game */
  sellHome: (salePrice: number) => void;
  /** Advance 12 months at once, collecting a summary of events */
  passYear: () => void;
  setDevCash: (amount: number) => void;
  setDevMode: (v: boolean) => void;
  clearYearSummary: () => void;
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
  interactionCount: 0,
  cash: 5800,
  savings: 3500,
  creditScore: 635,
  startCreditScore: 635,
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
  showResultsCard: false,
  careerId: null,
  pendingLifeEvent: null,
  lifeEventLog: [] as string[],
  currentLocation: 'apartment', // new games start inside the apartment
  tourProgress: {} as Record<string, string[]>,
  homeValue: 0,
  mortgageBalance: 0,
  mortgagePayment: 0,
  mortgageRate: 6.5,
  improvementsOwned: [] as string[],
  homeLifeMonths: 0,
  dashboardOpen: true,
  listingOpen: false,
  homeSold: false,
  showEndGame: false,
  totalInterestPaid: 0,
  finalSalePrice: 0,
  finalSaleProceeds: 0,
  mortgagePayoffAtSale: 0,
  yearSummary: null as YearSummaryEvent[] | null,
  sellNegotiation: null as SellNegotiationState | null,
  devMode: false,
};

export const DEFAULT_VOLUME = 0.6;

// Fields that should not be persisted (runtime-only state)
const TRANSIENT_FIELDS: (keyof GameState)[] = [
  'transitioning',
  'activeDialogue',
  'playerPosition',
  'targetPosition',
  'phoneOpen',
  'pendingLifeEvent',
  'pendingMaintenance',
  'listingOpen',
  'dashboardOpen',
  'yearSummary',
  'sellNegotiation',
];

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      pendingMaintenance: null,
      musicVolume: DEFAULT_VOLUME,
      sfxVolume: DEFAULT_VOLUME,
      audioMuted: false,

      setMusicVolume: (level) => set({ musicVolume: Math.max(0, Math.min(1, level)) }),
      setSfxVolume: (level) => set({ sfxVolume: Math.max(0, Math.min(1, level)) }),
      setAudioMuted: (muted) => set({ audioMuted: muted }),

      setPhoneOpen: (v) => set({ phoneOpen: v }),
      togglePhone: () => set((s) => ({ phoneOpen: !s.phoneOpen })),
      noteInteraction: () => set((s) => ({ interactionCount: s.interactionCount + 1 })),
      setCurrentLocation: (id) => set({ currentLocation: id }),
      markRoomVisited: (homeId, room) =>
        set((s) => {
          const prev = s.tourProgress[homeId] ?? [];
          if (prev.includes(room)) return {};
          return { tourProgress: { ...s.tourProgress, [homeId]: [...prev, room] } };
        }),
      startHomeTour: (homeId) => set({ currentLocation: 'home_tour', selectedHomeId: homeId }),
      // Moves directly to negotiation without triggering the city routing in setStage
      startNegotiation: () =>
        set((s) => ({
          currentLocation: 'negotiation',
          stage: 4,
          completedInteractions: [],
          // Route-agnostic milestone: entering negotiation means a home was chosen
          achievements: s.achievements.includes('house_hunter')
            ? s.achievements
            : [...s.achievements, 'house_hunter'],
        })),
      // Home Life (Stage 8) actions
      initHomeLife: (homePrice) =>
        set((s) => {
          if (s.homeValue > 0) return {}; // already initialized — don't overwrite
          return {
            homeValue: homePrice,
            mortgageBalance: Math.round(homePrice * 0.90),
            mortgagePayment: Math.round(homePrice * 0.90 * 0.006321), // fixed 30-yr payment at 6.5%
          };
        }),
      setPendingMaintenance: (event) => set({ pendingMaintenance: event }),
      applyMaintenance: (fix) =>
        set((s) => {
          if (!s.pendingMaintenance) return {};
          if (fix) {
            return { cash: Math.max(0, s.cash - s.pendingMaintenance.cost), pendingMaintenance: null };
          }
          // Defer: home value decreases by valueImpact fraction
          return {
            homeValue: Math.round(s.homeValue * (1 - s.pendingMaintenance.valueImpact)),
            pendingMaintenance: null,
          };
        }),
      buyImprovement: (id, cost, valuePct) =>
        set((s) => ({
          improvementsOwned: s.improvementsOwned.includes(id)
            ? s.improvementsOwned
            : [...s.improvementsOwned, id],
          cash: Math.max(0, s.cash - cost),
          homeValue: Math.round(s.homeValue * (1 + valuePct)),
        })),
      advanceHomeMonth: () =>
        set((s) => {
          const net = s.monthlyIncome - s.monthlyExpenses;
          const annualRate = (s.mortgageRate ?? 6.5) / 100;
          const monthlyRate = annualRate / 12;
          const payment = s.mortgagePayment > 0
            ? s.mortgagePayment
            : Math.round(s.homeValue * 0.9 * 0.006321);
          const interest = Math.round(s.mortgageBalance * monthlyRate);
          const principalPaid = Math.max(50, payment - interest);
          return {
            month: s.month + 1,
            cash: Math.max(0, s.cash + net),
            mortgageBalance: Math.max(0, s.mortgageBalance - principalPaid),
            totalInterestPaid: (s.totalInterestPaid ?? 0) + interest,
          };
        }),
      payDownMortgage: (amount) =>
        set((s) => ({
          cash: Math.max(0, s.cash - amount),
          mortgageBalance: Math.max(0, s.mortgageBalance - amount),
        })),
      refinanceMortgage: (newRate, fee) =>
        set((s) => {
          if (s.cash < fee) return {};
          const mr = newRate / 100 / 12;
          // Recalculate payment on full 30-year term from current balance
          const newPayment = Math.round(s.mortgageBalance * mr / (1 - Math.pow(1 + mr, -360)));
          return {
            mortgageRate: newRate,
            mortgagePayment: newPayment,
            cash: Math.max(0, s.cash - fee),
          };
        }),
      setCareer: (id, income, expenses, bonus) =>
        set((s) => {
          const base: Partial<GameState> = { careerId: id, monthlyIncome: income, monthlyExpenses: expenses };
          if (bonus.type === 'cash') base.cash = s.cash + bonus.amount;
          if (bonus.type === 'savings') base.savings = s.savings + bonus.amount;
          if (bonus.type === 'creditScore') base.creditScore = Math.max(300, Math.min(850, s.creditScore + bonus.amount));
          return base as Partial<GameState>;
        }),
      setPendingLifeEvent: (event) => set({ pendingLifeEvent: event }),
      applyLifeEvent: () =>
        set((s) => {
          if (!s.pendingLifeEvent) return {};
          const { effect, title } = s.pendingLifeEvent;
          const next: Partial<GameState> = {
            pendingLifeEvent: null,
            lastLifeEvent: title,
            lifeEventLog: [title, ...s.lifeEventLog].slice(0, 3),
          };
          if (effect.type === 'cash') next.cash = Math.max(0, s.cash + effect.delta);
          if (effect.type === 'savings') next.savings = Math.max(0, s.savings + effect.delta);
          if (effect.type === 'income') next.monthlyIncome = s.monthlyIncome + effect.delta;
          if (effect.type === 'expenses') next.monthlyExpenses = Math.max(0, s.monthlyExpenses + effect.delta);
          if (effect.type === 'credit') next.creditScore = Math.max(300, Math.min(850, s.creditScore + effect.delta));
          return next;
        }),
      startGame: (appearance) => set({ gameStarted: true, characterAppearance: appearance }),
      // Advancing stage returns the player to the city — except stage 7 (New Home) which is
      // a special location outside the city map and loads directly into the NewHomeScene.
      setStage: (stage) => set({
        stage,
        completedInteractions: [],
        transitioning: false,
        currentLocation: stage === 7 ? 'newhome' : stage === 8 ? 'homelife' : 'city',
      }),
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
      setShowResultsCard: (v) => set({ showResultsCard: v }),
      setDashboardOpen: (v) => set({ dashboardOpen: v }),
      setListingOpen: (v) => set({ listingOpen: v }),
      advanceHomeLifeMonth: () => {
        const state = useGameStore.getState();
        if (state.pendingMaintenance) return; // must resolve maintenance first
        // Re-use the existing mortgage / income logic
        state.advanceHomeMonth();
        // Increment month counter and possibly trigger maintenance
        useGameStore.setState((s) => {
          const newMonths = s.homeLifeMonths + 1;
          const maintenance = shouldMaintenanceFire(newMonths)
            ? selectMaintenanceEvent(newMonths)
            : null;
          return {
            homeLifeMonths: newMonths,
            ...(maintenance ? { pendingMaintenance: maintenance } : {}),
          };
        });
      },
      // Advance a full year (12 months), auto-resolving maintenance events
      passYear: () => {
        const events: YearSummaryEvent[] = [];
        useGameStore.setState((s) => {
          let cash = s.cash;
          let mortgageBalance = s.mortgageBalance;
          let homeValue = s.homeValue;
          let totalInterestPaid = s.totalInterestPaid ?? 0;
          let homeLifeMonths = s.homeLifeMonths;
          let month = s.month;
          const annualRate = (s.mortgageRate ?? 6.5) / 100;
          const monthlyRate = annualRate / 12;
          const payment = s.mortgagePayment > 0
            ? s.mortgagePayment
            : Math.round(s.homeValue * 0.9 * 0.006321);
          const net = s.monthlyIncome - s.monthlyExpenses;

          for (let i = 0; i < 12; i++) {
            // Income & mortgage
            const interest = Math.round(mortgageBalance * monthlyRate);
            const principalPaid = Math.max(50, payment - interest);
            cash = Math.max(0, cash + net);
            mortgageBalance = Math.max(0, mortgageBalance - principalPaid);
            totalInterestPaid += interest;
            month += 1;
            homeLifeMonths += 1;

            // Maintenance check
            if (shouldMaintenanceFire(homeLifeMonths)) {
              const evt = selectMaintenanceEvent(homeLifeMonths);
              if (evt) {
                if (cash >= evt.cost) {
                  // Auto-fix
                  cash -= evt.cost;
                  events.push({ label: `${evt.title} (fixed)`, cashDelta: -evt.cost });
                } else {
                  // Auto-defer: reduce home value
                  homeValue = Math.round(homeValue * (1 - evt.valueImpact));
                  events.push({ label: `${evt.title} (deferred — home value ↓)`, cashDelta: 0 });
                }
              }
            }
          }

          // Small annual appreciation (~3%)
          const appreciation = Math.round(homeValue * 0.03);
          homeValue += appreciation;
          events.push({ label: 'Annual market appreciation +3%', cashDelta: appreciation });

          return {
            cash,
            mortgageBalance,
            homeValue,
            totalInterestPaid,
            homeLifeMonths,
            month,
            yearSummary: events,
          };
        });
      },
      completeSale: (salePrice: number) =>
        set((s) => {
          // Compute proceeds from the PRE-SALE mortgage balance (captured before zeroing it)
          const agentFee = Math.round(salePrice * 0.05);
          const closingCosts = Math.round(salePrice * 0.02);
          const mortgagePayoffAtSale = s.mortgageBalance;
          const netProceeds = Math.max(0, salePrice - agentFee - closingCosts - mortgagePayoffAtSale);
          // Credit proceeds to cash ONLY — do not double-count into savings
          return {
            homeSold: true,
            showEndGame: true,
            finalSalePrice: salePrice,
            finalSaleProceeds: netProceeds,
            mortgagePayoffAtSale,
            cash: s.cash + netProceeds,
            // Zero out the mortgage — home is sold
            mortgageBalance: 0,
          };
        }),
      wrapUpJourney: () => set({ showEndGame: true }),
      setShowEndGame: (v: boolean) => set({ showEndGame: v }),
      setDevCash: (amount: number) => set({ cash: Math.max(0, amount) }),
      setDevMode: (v: boolean) => set({ devMode: v }),
      clearYearSummary: () => set({ yearSummary: null }),
      setSellNegotiation: (state: SellNegotiationState | null) => set({ sellNegotiation: state }),
      // Return to the character screen mid-game. Progress (stage, cash, etc.)
      // stays in the persisted save; only transient/session flags are cleared.
      quitToMenu: () =>
        set({
          gameStarted: false,
          phoneOpen: false,
          activeDialogue: null,
          transitioning: false,
          pendingLifeEvent: null,
          pendingMaintenance: null,
        }),
      // Reset gameplay state, but preserve audio preferences
      resetGame: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'path-to-home-game-state',
      version: 8,
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
        if (fromVersion < 2) {
          // v1 → v2: add careerId. Players who were mid-game get a default so they aren't blocked.
          if (!s.careerId) {
            const stage = typeof s.stage === 'number' ? s.stage : 1;
            s.careerId = stage > 1 ? 'government' : null;
          }
          if (!Array.isArray(s.lifeEventLog)) s.lifeEventLog = [];
        }
        if (fromVersion < 3) {
          // v2 → v3: add currentLocation. Existing saves go to city so player can explore.
          if (!s.currentLocation) {
            s.currentLocation = 'city';
          }
        }
        if (fromVersion < 4) {
          // v3 → v4: add tourProgress for home walkthroughs.
          if (!s.tourProgress) s.tourProgress = {};
        }
        if (fromVersion < 5) {
          // v4 → v5: add Home Life fields.
          if (typeof s.homeValue !== 'number') s.homeValue = 0;
          if (typeof s.mortgageBalance !== 'number') s.mortgageBalance = 0;
          if (typeof s.mortgagePayment !== 'number') s.mortgagePayment = 0;
          if (!Array.isArray(s.improvementsOwned)) s.improvementsOwned = [];
        }
        if (fromVersion < 6) {
          // v5 → v6: audio prefs move into the save. Seed from the legacy
          // localStorage key so existing players keep their volume.
          if (typeof s.audioVolume !== 'number') {
            let vol = DEFAULT_VOLUME;
            try {
              const legacy = localStorage.getItem('gameAudioVolume');
              if (legacy !== null) {
                const parsed = parseFloat(legacy);
                if (!isNaN(parsed)) vol = Math.max(0, Math.min(1, parsed));
              }
            } catch (_) { /* localStorage unavailable */ }
            s.audioVolume = vol;
          }
          if (typeof s.audioMuted !== 'boolean') s.audioMuted = false;
        }
        if (fromVersion < 7) {
          // v6 → v7: split the single master volume into music + SFX volumes.
          // Seed both from the old audioVolume so players keep their level.
          const legacy = typeof s.audioVolume === 'number' ? Math.max(0, Math.min(1, s.audioVolume as number)) : DEFAULT_VOLUME;
          if (typeof s.musicVolume !== 'number') s.musicVolume = legacy;
          if (typeof s.sfxVolume !== 'number') s.sfxVolume = legacy;
          delete s.audioVolume;
        }
        if (fromVersion < 8) {
          // v7 → v8: add end-game / sell-home fields.
          if (typeof s.homeSold !== 'boolean') s.homeSold = false;
          if (typeof s.showEndGame !== 'boolean') s.showEndGame = false;
          if (typeof s.totalInterestPaid !== 'number') s.totalInterestPaid = 0;
          if (typeof s.devMode !== 'boolean') s.devMode = false;
          if (typeof s.startCreditScore !== 'number') s.startCreditScore = 635;
          if (typeof s.finalSalePrice !== 'number') s.finalSalePrice = 0;
          if (typeof s.finalSaleProceeds !== 'number') s.finalSaleProceeds = 0;
          if (typeof s.mortgagePayoffAtSale !== 'number') s.mortgagePayoffAtSale = 0;
        }
        return s;
      },
    }
  )
);

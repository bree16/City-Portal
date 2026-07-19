export interface BuildingDef {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  color: string;
  accentColor: string;
  /** Position in the city [x, y, z] */
  cityPos: [number, number, number];
  /** Which stage this building unlocks; null = always accessible (ambient) */
  stageFor: number | null;
  /** Whether this building has a playable interior the player can enter */
  hasInterior: boolean;
  /** Building footprint [w, d] for mini-map */
  footprint: [number, number];
  /** Where the player spawns in the city after exiting this building */
  exitCityPos: [number, number, number];
}

/** The city layout: two rows of buildings separated by a main east–west road. */
export const buildings: BuildingDef[] = [
  {
    id: 'apartment',
    name: 'Apartment Complex',
    subtitle: 'Where your journey begins',
    icon: '🏠',
    color: '#6B5B95',
    accentColor: '#8B7BB5',
    cityPos: [-18, 0, -13],
    stageFor: 1,
    hasInterior: true,
    footprint: [8, 7],
    exitCityPos: [-13, 0, -7],
  },
  {
    id: 'coffee',
    name: 'The Java Joint',
    subtitle: 'Newport News\'s finest brew',
    icon: '☕',
    color: '#8B4513',
    accentColor: '#D2691E',
    cityPos: [-5, 0, -13],
    stageFor: null,
    hasInterior: false, // ambient only — no playable interior yet
    footprint: [5, 5],
    exitCityPos: [-2, 0, -8],
  },
  {
    id: 'counselor',
    name: 'Housing Counselor',
    subtitle: 'Get pre-qualified for a mortgage',
    icon: '📋',
    color: '#0A8F7E',
    accentColor: '#12C4AC',
    cityPos: [7, 0, -13],
    stageFor: 2,
    hasInterior: true,
    footprint: [7, 6],
    exitCityPos: [10, 0, -7],
  },
  {
    id: 'park',
    name: 'Riverside Park',
    subtitle: 'A quiet place to think',
    icon: '🌳',
    color: '#228B22',
    accentColor: '#32CD32',
    cityPos: [19, 0, -14],
    stageFor: null,
    hasInterior: false, // open park area, no interior
    footprint: [9, 8],
    exitCityPos: [15, 0, -7],
  },
  {
    id: 'realestate',
    name: 'Real Estate Office',
    subtitle: 'Browse homes in Newport News',
    icon: '🔑',
    color: '#C0392B',
    accentColor: '#E74C3C',
    cityPos: [-18, 0, 12],
    stageFor: 3,
    hasInterior: true,
    footprint: [7, 6],
    exitCityPos: [-14, 0, 6],
  },
  {
    id: 'negotiation',
    name: "Buyer's Agent",
    subtitle: 'Make your offer on a home',
    icon: '🤝',
    color: '#D4A843',
    accentColor: '#F0C050',
    cityPos: [-5, 0, 12],
    stageFor: 4,
    hasInterior: true,
    footprint: [6, 6],
    exitCityPos: [-2, 0, 6],
  },
  {
    id: 'bank',
    name: 'Community Bank',
    subtitle: 'Get your mortgage approved',
    icon: '🏦',
    color: '#0D2B5E',
    accentColor: '#1A4A8A',
    cityPos: [7, 0, 12],
    stageFor: 5,
    hasInterior: true,
    footprint: [8, 7],
    exitCityPos: [10, 0, 6],
  },
  {
    id: 'closing',
    name: 'City Hall',
    subtitle: 'Sign your closing papers',
    icon: '🏛️',
    color: '#4A3728',
    accentColor: '#D4A843',
    cityPos: [19, 0, 12],
    stageFor: 6,
    hasInterior: true,
    footprint: [8, 7],
    exitCityPos: [15, 0, 6],
  },
];

/** Find a building by id */
export function findBuilding(id: string): BuildingDef | undefined {
  return buildings.find((b) => b.id === id);
}

/** What stage is required to enter a building (null = always open) */
export function buildingRequiredStage(b: BuildingDef, currentStage: number): 'open' | 'current' | 'locked' {
  if (b.stageFor === null) return 'open';
  if (b.stageFor === currentStage) return 'current'; // current objective
  if (b.stageFor < currentStage) return 'open';      // completed, can revisit
  return 'locked';                                    // not yet unlocked
}

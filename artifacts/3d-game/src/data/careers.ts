import { GameIconName } from '@/components/ui/GameIcon';

export interface Career {
  id: string;
  name: string;
  icon: GameIconName;
  description: string;
  flavorQuote: string;
  /** Realistic take-home pay per month for an entry-level worker in Newport News / Hampton Roads. */
  monthlyIncome: number;
  /** Typical monthly living costs for this lifestyle (rent share, food, car, phone, etc.). */
  monthlyExpenses: number;
  startingBonus: {
    type: 'cash' | 'savings' | 'creditScore';
    amount: number;
    label: string;
  };
}

// Income figures are entry-level monthly TAKE-HOME estimates for the Newport News
// area (mid-2020s): annual gross → minus federal/VA taxes & FICA (~22-25%).
// Expenses assume a young single adult: apartment rent (often shared), food,
// car, insurance, phone. Higher earners tend to spend a bit more.
export const careers: Career[] = [
  {
    id: 'shipbuilding',
    name: 'Shipbuilding',
    icon: 'anchor',
    description: 'Apprentice welder or electrician at Newport News Shipbuilding (~$24/hr + overtime).',
    flavorQuote: '"Built with pride, ship by ship."',
    monthlyIncome: 3600,
    monthlyExpenses: 2100,
    startingBonus: { type: 'savings', amount: 2000, label: '+$2,000 savings (apprentice program pay)' },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'health',
    description: 'New registered nurse at Riverside or Sentara (~$72k/yr to start).',
    flavorQuote: '"Caring for others starts with caring for yourself."',
    monthlyIncome: 4200,
    monthlyExpenses: 2300,
    startingBonus: { type: 'creditScore', amount: 15, label: '+15 credit score (financial literacy program)' },
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: 'laptop',
    description: 'Junior developer or cybersecurity analyst at a defense contractor (~$70k/yr).',
    flavorQuote: '"The future is built in code."',
    monthlyIncome: 4400,
    monthlyExpenses: 2400,
    startingBonus: { type: 'cash', amount: 1200, label: '+$1,200 cash (signing bonus)' },
  },
  {
    id: 'government',
    name: 'Government',
    icon: 'city-hall',
    description: 'Entry-level role with the City of Newport News or a federal agency (~$45k/yr).',
    flavorQuote: '"Public service is its own reward."',
    monthlyIncome: 3000,
    monthlyExpenses: 2000,
    startingBonus: { type: 'savings', amount: 1000, label: '+$1,000 savings (pension match)' },
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book',
    description: 'First-year teacher at Newport News Public Schools (~$50k/yr to start).',
    flavorQuote: '"Every student is a future homeowner."',
    monthlyIncome: 3200,
    monthlyExpenses: 2100,
    startingBonus: { type: 'creditScore', amount: 20, label: '+20 credit score (loan forgiveness program)' },
  },
  {
    id: 'military',
    name: 'Military',
    icon: 'medal',
    description: 'E-4 at Joint Base Langley–Eustis — housing allowance keeps your costs low.',
    flavorQuote: '"Discipline builds wealth, one month at a time."',
    monthlyIncome: 3300,
    monthlyExpenses: 1800,
    startingBonus: { type: 'savings', amount: 2800, label: '+$2,800 savings (BAH housing allowance)' },
  },
  {
    id: 'fastfood',
    name: 'Fast Food & Restaurants',
    icon: 'dining',
    description: 'Full-time crew or server on Jefferson Ave (~$14/hr + tips). Roommates help a lot.',
    flavorQuote: '"Every shift gets you one step closer."',
    monthlyIncome: 2100,
    monthlyExpenses: 1600,
    startingBonus: { type: 'creditScore', amount: 10, label: '+10 credit score (on-time bill streak)' },
  },
  {
    id: 'retail',
    name: 'Retail & Warehouse',
    icon: 'cart',
    description: 'Store associate or warehouse worker near Patrick Henry Mall (~$17/hr full-time).',
    flavorQuote: '"Hustle now, keys later."',
    monthlyIncome: 2400,
    monthlyExpenses: 1700,
    startingBonus: { type: 'cash', amount: 500, label: '+$500 cash (holiday overtime)' },
  },
  {
    id: 'student',
    name: 'College Student',
    icon: 'school',
    description: 'CNU or Thomas Nelson student working ~25 hrs/week while living cheap on campus.',
    flavorQuote: '"Investing in yourself pays the best interest."',
    monthlyIncome: 1600,
    monthlyExpenses: 1200,
    startingBonus: { type: 'creditScore', amount: 25, label: '+25 credit score (student card built early)' },
  },
];

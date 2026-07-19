export interface Career {
  id: string;
  name: string;
  icon: string;
  description: string;
  flavorQuote: string;
  monthlyIncome: number;
  startingBonus: {
    type: 'cash' | 'savings' | 'creditScore';
    amount: number;
    label: string;
  };
}

export const careers: Career[] = [
  {
    id: 'shipbuilding',
    name: 'Shipbuilding',
    icon: '⚓',
    description: 'Work at Newport News Shipbuilding, one of the largest shipyards in the US.',
    flavorQuote: '"Built with pride, ship by ship."',
    monthlyIncome: 4800,
    startingBonus: { type: 'savings', amount: 2000, label: '+$2,000 savings (union benefits)' },
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: '🏥',
    description: 'Serve the community as a nurse, technician, or healthcare administrator.',
    flavorQuote: '"Caring for others starts with caring for yourself."',
    monthlyIncome: 4200,
    startingBonus: { type: 'creditScore', amount: 15, label: '+15 credit score (financial literacy program)' },
  },
  {
    id: 'technology',
    name: 'Technology',
    icon: '💻',
    description: 'Work in cybersecurity, software, or defense tech at a local contractor.',
    flavorQuote: '"The future is built in code."',
    monthlyIncome: 5200,
    startingBonus: { type: 'cash', amount: 1200, label: '+$1,200 cash (signing bonus)' },
  },
  {
    id: 'government',
    name: 'Government',
    icon: '🏛️',
    description: 'Serve the City of Newport News or a federal agency in the region.',
    flavorQuote: '"Public service is its own reward."',
    monthlyIncome: 3800,
    startingBonus: { type: 'savings', amount: 1000, label: '+$1,000 savings (pension match)' },
  },
  {
    id: 'education',
    name: 'Education',
    icon: '📚',
    description: 'Teach at Newport News Public Schools or Christopher Newport University.',
    flavorQuote: '"Every student is a future homeowner."',
    monthlyIncome: 3400,
    startingBonus: { type: 'creditScore', amount: 20, label: '+20 credit score (loan forgiveness program)' },
  },
  {
    id: 'military',
    name: 'Military',
    icon: '🎖️',
    description: 'Serve at Joint Base Langley–Eustis with housing and benefit support.',
    flavorQuote: '"Discipline builds wealth, one month at a time."',
    monthlyIncome: 3200,
    startingBonus: { type: 'savings', amount: 2800, label: '+$2,800 savings (BAH housing allowance)' },
  },
];

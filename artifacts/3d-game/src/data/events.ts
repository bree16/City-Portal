export interface LifeEvent {
  id: string;
  title: string;
  description: string;
  icon: string;
  cashEffect?: number;
  creditEffect?: number;
  incomeEffect?: number;
  monthlyExpenseEffect?: number;
  lesson: string;
}

export const lifeEvents: LifeEvent[] = [
  { id: 'car', title: 'Car Breakdown!', description: 'Your car needs repairs.', icon: '🚗', cashEffect: -800, creditEffect: 0, lesson: "This is why an emergency fund is essential." },
  { id: 'promotion', title: 'Job Promotion!', description: 'You got a raise — +$300/month income!', icon: '📈', incomeEffect: 300, creditEffect: 5, lesson: "Higher income improves your debt-to-income ratio." },
  { id: 'medical', title: 'Medical Bill', description: 'Unexpected medical expense.', icon: '🏥', cashEffect: -500, lesson: "Health insurance and HSAs protect your savings." },
  { id: 'bonus', title: 'Year-End Bonus!', description: 'You received a work bonus!', icon: '🎁', cashEffect: 1000, lesson: "Windfalls are great for boosting your down payment fund." },
  { id: 'rent_increase', title: 'Rent Increase', description: 'Your landlord raised rent by $150/month.', icon: '📬', monthlyExpenseEffect: 150, lesson: "Homeownership locks in your housing cost." },
  { id: 'tax_refund', title: 'Tax Refund!', description: 'You got a $800 tax refund.', icon: '💵', cashEffect: 800, lesson: "Consider putting tax refunds directly into your down payment fund." },
];
